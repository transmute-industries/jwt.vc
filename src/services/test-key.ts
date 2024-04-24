//  these keys are for testing purposes...
//  obviously these are not safe to use for any other purpose...

const testPrivateKey = { 
  "kty": "EC", 
  "crv": "P-256",
  "alg": "ES256",
  "x": "V8ctRWc2deLSjfOjqQm7-m33SinduQbKJVgSHFj7ZxQ", 
  "y": "svjg0e-iAe5zElQhfqqagr4-S8k3WWgzz6JDPmRE_bk", 
  "d": "C-5QLfqkE0pffZfp3tA5TfS06haBEWrW13VNwqmv4uc" 
}

const { d, ...testPublicKey } = testPrivateKey

export const key = { publicKeyJwk: testPublicKey, privateKeyJwk: testPrivateKey }