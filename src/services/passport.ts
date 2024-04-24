

import * as jose from 'jose'


const issue = async () => {
const BASE_URL = process.env.BASE_URL
const claimset = {
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
  ],
  "type": [
    "VerifiableCredential",
    "ProductPassport"
  ],
  "issuer": "did:web:jwt.vc",
  "validFrom": "2010-01-01T19:23:24Z",
  "credentialSchema": {
    "id": `${BASE_URL}/api/schemas/product-passport.json`,
    "type": "JsonSchema"
  },
  "credentialStatus": [{
    "id": `${BASE_URL}/credentials/status/3#94567`,
    "type": "BitstringStatusListEntry",
    "statusPurpose": "revocation",
    "statusListIndex": "94567",
    "statusListCredential": `${BASE_URL}/credentials/status/3`
  }, {
    "id": `${BASE_URL}/credentials/status/4#23452`,
    "type": "BitstringStatusListEntry",
    "statusPurpose": "suspension",
    "statusListIndex": "23452",
    "statusListCredential": `${BASE_URL}/credentials/status/4`
  }],
  "credentialSubject": {
    "id": "did:example:123",
  }
}
  const alg = `ES256`
  const keys = await jose.generateKeyPair(alg)
  const jws = await new jose.CompactSign(
    new TextEncoder().encode(JSON.stringify(claimset)),
  )
    .setProtectedHeader({ alg })
    .sign(keys.privateKey)
  return jws
}

const get = async () => {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
  const data = await fetch(BASE_URL + '/api/issuer')
  return data.json()
}

export const passport = { issue, get }