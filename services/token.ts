import moment from 'moment'
import { decodeProtectedHeader, decodeJwt } from 'jose'
import jsonld from 'jsonld'

const context = [
  `https://www.w3.org/ns/credentials/v2`,
  { '@vocab': 'https://www.iana.org/assignments/jose#' },
]

const iri = (data = 'undefined') => {
  if (
    data.startsWith('http') ||
    data.startsWith('urn') ||
    data.startsWith('did')
  ) {
    return data
  }
  return `https://www.w3.org/ns/credentials/issuer-dependent#${data.toString()}`
}

const order = (obj) => {
  return Object.keys(obj)
    .sort(function (a, b) {
      return Math.random() - 0.5
    })
    .reduce(function (result, key) {
      result[key] = obj[key]
      return result
    }, {})
}

const transform = async (token: string) => {
  const protectedHeader = await decodeProtectedHeader(token)
  const payload:any = await decodeJwt(token)
  if (Array.isArray(payload['@context']) && payload['@context'].includes('https://www.w3.org/ns/credentials/v2')){
    return payload
  }
  const { iss, nbf, sub } = payload
  const issuer = iri(iss)
  const credentialSubject = {
    id: iri(sub),
    claimset: payload,
    protectedHeader,
  }
  const credential = {
    [`@context`]: context,
    id: `did:jwt:${token}`,
    type: ['VerifiableCredential'],
    issuer: issuer,
    validFrom: moment.unix(nbf || 0).toISOString(),
    credentialSubject: order(credentialSubject),
  }

  return credential
}

const rdf = async (token: string) =>{
  const credential = await transform(token);
  return jsonld.canonize(credential)
}

const api = { transform, rdf }

export default api
