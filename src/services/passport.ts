
import moment from 'moment'
import * as jose from 'jose'

import { key } from './test-key'

import * as vc from '@transmute/verifiable-credentials'

const issuer = `did:web:jwt.vc`
const alg = `ES256`

const statusListSize = 131072
const revocationIndex = 94567
const suspensionIndex = 23452
const suspended = false
const revoked = false

export type DIDVerificationKeyThumbprint = {
  name: string
  type: 'TLSA'
  ttl: number
  jkt: string // hex encoded sha256 jwk thumbprint per https://datatracker.ietf.org/doc/rfc9278/
}

const getDidWebAssurance = async (name: string): Promise<DIDVerificationKeyThumbprint | null>  => {
  const recordName = `_did.${name}`
  try{
    const res = await fetch(`https://1.1.1.1/dns-query?name=${recordName}&type=TLSA`, { headers: {
      accept: 'application/dns-json'
    }})
    const records = await res.json()
    // console.log(records)
    const _did_ttl = records.Answer[0].TTL
    let record = records.Answer[0].data
    record = record.replace(`\\#`, '').replace(/ /g, '').substring(8) // ignore usage, selector, matching type
    record = jose.base64url.encode(Buffer.from(record, 'hex')) 
    return {
      name: recordName,
      type: 'TLSA',
      ttl: _did_ttl,
      jkt: record
    }
  } catch(e){
    return null
  }
  
}

const controller = async () => {
  const issuerWebsite = issuer.replace('did:web:', 'https://')
  const issuerUrl = new URL(issuerWebsite)
  const publicKeyThumbprint = await jose.calculateJwkThumbprint(key.publicKeyJwk)
  const thumbprintHex = Buffer.from(jose.base64url.decode(publicKeyThumbprint)).toString('hex')
  const assurance = await getDidWebAssurance(issuerUrl.hostname)
  
  key.publicKeyJwk = {
    kid: publicKeyThumbprint,
    ...key.publicKeyJwk 
  } as any

  assurance.jkt = thumbprintHex
  
  return {
    id: issuer,
    alsoKnownAs: [issuerWebsite],
    assurance,
    verificationMethod: [{
      id: `${issuer}#key-42`,
      type: `JsonWebKey`,
      controller: issuer,
      publicKeyJwk: key.publicKeyJwk
    }],
    assertionMethod: [`${issuer}#key-42`],
    authenticationMethod: [`${issuer}#key-42`]
  }
}

const sign = async (claimset: any) => {
  const didDoc = await controller();
  const jws = await new jose.CompactSign(
    new TextEncoder().encode(JSON.stringify(claimset)),
  )
    .setProtectedHeader({ alg, kid: didDoc.assertionMethod[0] })
    .sign(await jose.importJWK(key.privateKeyJwk))
  return jws
}

const create = async ({ id }: { id: string }) => {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
  return sign({
    "@context": [
      "https://www.w3.org/ns/credentials/v2",
    ],
    id,
    "type": [
      "VerifiableCredential",
      "ProductPassport"
    ],
    "issuer": { id: issuer },
    "validFrom": moment().toISOString(),
    "validUntil": moment().add(1, "day").toISOString(),
    "credentialSchema": {
      "id": `${BASE_URL}/schemas/product-passport.json`,
      "type": "JsonSchema"
    },
    "credentialStatus": [{
      "id": `${BASE_URL}/api/credentials/status/3#${revocationIndex}`,
      "type": "BitstringStatusListEntry",
      "statusPurpose": "revocation",
      "statusListIndex": `${revocationIndex}`,
      "statusListCredential": `${BASE_URL}/api/credentials/status/3`
    }, {
      "id": `${BASE_URL}/api/credentials/status/4#${suspensionIndex}`,
      "type": "BitstringStatusListEntry",
      "statusPurpose": "suspension",
      "statusListIndex": `${suspensionIndex}`,
      "statusListCredential": `${BASE_URL}/api/credentials/status/4`
    }],
    "cnf": { jwk: key.publicKeyJwk },
    "credentialSubject": {
      "id": issuer,
      "gln": "https://id.gs1.org/417/1200144791171"
    }
  })
}

const get = async () => {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
  const data = await fetch(BASE_URL + '/api/credentials/urn:uuid:2dafeaea-c89e-4074-a1ad-9f0bad22467f')
  return data.text()
}

const status = async ({ id }: { id: string }) => {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
  if (id === '3') {
    const encodedList = await vc.status.bs(statusListSize).set(revocationIndex, revoked).encode()
    return sign({
      "@context": [
        "https://www.w3.org/ns/credentials/v2"
      ],
      "id": `${BASE_URL}/api/credentials/status/${id}`,
      "type": ["VerifiableCredential", "BitstringStatusListCredential"],
      "issuer": { id: issuer },
      "validFrom": moment().toISOString(),
      "credentialSubject": {
        "id": `${BASE_URL}/api/credentials/status/${id}#list`,
        "type": "BitstringStatusList",
        "statusPurpose": "revocation",
        "encodedList": encodedList
      }
    })
  }
  if (id === '4') {
    const encodedList = await vc.status.bs(statusListSize).set(suspensionIndex, suspended).encode()
    return sign({
      "@context": [
        "https://www.w3.org/ns/credentials/v2"
      ],
      "id": `${BASE_URL}/api/credentials/status/${id}`,
      "type": ["VerifiableCredential", "BitstringStatusListCredential"],
      "issuer": { id: issuer },
      "validFrom": moment().toISOString(),
      "credentialSubject": {
        "id": `${BASE_URL}/api/credentials/status/${id}#list`,
        "type": "BitstringStatusList",
        "statusPurpose": "suspension",
        "encodedList": encodedList
      }
    })
  }
}

const check = async (jwt: string) => {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
  const res = await fetch(`${BASE_URL}/api/credentials/verify`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/vc+ld+json+jwt'
    },
    body: jwt
  });
  return res.json()
}

const verify = async (jwt: string) => {
  const didDoc = await controller();
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
  const validator = vc.validator({
    resolver: {
      resolve: async ({ id, type, content }: vc.ValidatorContentType) => {
        // console.log({ id, type, content })
        if (id === `${BASE_URL}/schemas/product-passport.json` && type === 'application/schema+json') {
          return {
            type: "application/schema+json",
            content: new TextEncoder().encode(JSON.stringify({
              "$id": `${BASE_URL}/schemas/product-passport.json`,
              "$schema": "https://json-schema.org/draft/2020-12/schema",
              "title": "ProductPassport",
              "description": "ProductPassport using JsonSchema",
              "type": "object",
              "properties": {
                "credentialSubject": {
                  "type": "object",
                  "properties": {
                    "id": {
                      "type": "string"
                    }
                  },
                  "required": [
                    "id"
                  ]
                }
              }
            }))
          }
        }
        if (id === `${BASE_URL}/api/credentials/status/3`) {
          return {
            type: `application/vc+ld+json+jwt`,
            content: vc.text.encoder.encode(await status({id : '3'}))
          }
        }
        if (id === `${BASE_URL}/api/credentials/status/4`) {
          return {
            type: `application/vc+ld+json+jwt`,
            content: vc.text.encoder.encode(await status({id : '4'}))
          }
        }
        return {
          type: "application/jwk+json",
          content: new TextEncoder().encode(JSON.stringify(didDoc.verificationMethod[0].publicKeyJwk))
        }

      }
    }
  })
  return validator.validate({
    type: "application/vc+ld+json+jwt",
    content: new TextEncoder().encode(jwt)
  })

}

const verifyController = async ({id}: any) => {
  const didDocumentResourceUri = id.replace('did:web:', 'https://') + '/.well-known/did.json'
  const uri = new URL(didDocumentResourceUri)
  const didDocumentResource = await (await fetch(uri)).json()
  const assurance = await getDidWebAssurance(uri.hostname)
  const verificationKey = didDocumentResource.verificationMethod[0].publicKeyJwk
  const verificationKeyThumbprint = await jose.calculateJwkThumbprint(verificationKey)
  const checks = {
    TLSA: {
      want: verificationKeyThumbprint,
      got: assurance.jkt,
      verified: verificationKeyThumbprint === assurance.jkt
    }
  }
  return { uri, checks, assurance, resource: didDocumentResource }
}

const requestVerifyController = async (id: string) => {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
  const res = await fetch(`${BASE_URL}/api/controller/verify?id=${id}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    }
  });
  return res.json()
}

const client = {
  controller: {
    verify: requestVerifyController
  }
}

export const passport = { create, get, status, check, controller, verify, verifyController, client }