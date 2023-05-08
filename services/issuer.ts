import * as jose from 'jose'


const iss = `did:web:jwt.vc`
const kid = `#0`


export const privateKeyJwk = {
  kty: 'EC',
  crv: 'P-256',
  alg: `ES256`,
  d: 'sjKZ6OT5F3d2IOiq9JkZ7WMR2rUqlNa3TumkrcedrBM',
  x: 'MYvnaI87pfrn3FpTqW-yNiFcF1K7fedJiqapm20_q7c',
  y: '9YEbT6Tyuc7xp9yRvhOUVKK_NIHkn5HpK9ZMgvK5pVw',
}

const alg = privateKeyJwk.alg;

const { d, ...publicKeyJwk } = privateKeyJwk

export { publicKeyJwk }

export const signer = {
  sign: async ({ header, claimset }: any) => {
    const jwt = await new jose.CompactSign(
      Buffer.from(JSON.stringify(claimset)),
    )
      .setProtectedHeader(header)
      .sign(await jose.importJWK(privateKeyJwk))
    return jwt
  },
}

export const verifier = {
  verify: async ({ jwt }: any) => {
    // const { iss, kid } = jose.decodeProtectedHeader(jwt)
    // const publicKey = await getPublicKey(iss + kid);
    // or...
    const publicKey = await jose.importJWK(publicKeyJwk)
    const { payload, protectedHeader } = await jose.jwtVerify(jwt, publicKey)
    return { protectedHeader, payload } as any
  },
}

const didDocument = {
  '@context': [
    'https://www.w3.org/ns/did/v1',
    { '@vocab': 'https://transmute.id#' },
  ],
  id: iss,
  verificationMethod: [{
    id: kid,
    type: 'JsonWebKey',
    controller: iss,
    publicKeyJwk: publicKeyJwk
  }],
  authentication: [kid],
  assertionMethod: [kid]
}
const issuer = { iss, kid, alg, signer, verifier, didDocument } 

export default issuer

