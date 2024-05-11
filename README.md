# jwt.vc

This is a demo that was built to explore binding of digital credentials to domain names.

It is intended to be used with international identifiers that contain well formed internation domain names, including URLs, GS1 Digital Links (which are URLS), and DID Web (a URN that is converted to a URL by software called a DID Resolver).

```bash
dig @pam.ns.cloudflare.com. jwk.cnf.jwt.vc. TLSA
```

or

```bash
curl -s --http2 -H "accept: application/dns-json" "https://1.1.1.1/dns-query?name=_did.jwt.vc&type=TLSA" | jq '.'
```

Related draft here: 

- https://github.com/OR13/draft-steele-spice-tlsa-cnf