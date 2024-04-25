# jwt.vc

With TTL 1 minute, it takes only a few minutes to revoke a JWT verification key by changing the JKT that is expected in a given TLSA Record.

Check a public key thumbprint via DNS over https for a given HTTPS based credential issuer.

```bash
curl -s --http2 -H "accept: application/dns-json" "https://1.1.1.1/dns-query?name=_did.jwt.vc&type=TLSA" | jq '.'
```