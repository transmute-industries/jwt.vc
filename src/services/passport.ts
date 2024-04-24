
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

const controller = {
  id: issuer,
  verificationMethod: [{
    id: `${issuer}#key-42`,
    type: `JsonWebKey`,
    controller: issuer,
    publicKeyJwk: key.publicKeyJwk
  }],
  assertionMethod: [`${issuer}#key-42`],
  authenticationMethod: [`${issuer}#key-42`]
}

const sign = async (claimset: any) => {
  const jws = await new jose.CompactSign(
    new TextEncoder().encode(JSON.stringify(claimset)),
  )
    .setProtectedHeader({ alg, kid: controller.assertionMethod[0] })
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
      "id": "did:example:123",
    }
  })
}

const get = async () => {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
  const data = await fetch(BASE_URL + '/api/credentials/urn:uuid:2dafeaea-c89e-4074-a1ad-9f0bad22467f')
  return data.json()
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
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
  const validator = vc.validator({
    resolver: {
      resolve: async ({ id, type, content }: vc.ValidatorContentType) => {
        console.log({ id, type, content })
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
          content: new TextEncoder().encode(JSON.stringify(controller.verificationMethod[0].publicKeyJwk))
        }

      }
    }
  })
  return validator.validate({
    type: "application/vc+ld+json+jwt",
    content: new TextEncoder().encode(jwt)
  })

}



export const passport = { create, get, status, check, controller, verify }