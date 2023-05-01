import { useEffect, useState } from 'react'
import Script from 'next/script'
import { Grid, Box, Typography, Button } from '@mui/material'

import TokenViewer from '../components/TokenViewer'
import DecodedView from '../components/DecodedView'
import MappedRepresentation from '../components/MappedRepresentation'
import RdfView from '../components/RdfView'
import Particles, { mappingParams } from '../components/Particles'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { Source } from '@mui/icons-material'
const normalJwt = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`
const vcLdJwt = `eyJhbGciOiJFUzI1NiIsImlzcyI6ImRpZDpleGFtcGxlOjEyMyIsImtpZCI6IiMwIiwidHlwIjoidmMrbGQrand0IiwiY3R5IjoidmMrbGQranNvbiJ9.eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvbnMvY3JlZGVudGlhbHMvdjIiLCJodHRwczovL3czaWQub3JnL3ZjL3N0YXR1cy1saXN0LzIwMjEvdjEiXSwiaWQiOiJodHRwczovL3ZlbmRvci5leGFtcGxlL2NyZWRlbnRpYWxzL3N0YXR1cy8zIiwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCIsIlN0YXR1c0xpc3QyMDIxQ3JlZGVudGlhbCJdLCJpc3N1ZXIiOiJkaWQ6ZXhhbXBsZToxMjMiLCJ2YWxpZEZyb20iOiIyMDIxLTA0LTA1VDE0OjI3OjQwLjAwMFoiLCJjcmVkZW50aWFsU3ViamVjdCI6eyJpZCI6Imh0dHBzOi8vdmVuZG9yLmV4YW1wbGUvY3JlZGVudGlhbHMvc3RhdHVzLzMjbGlzdCIsInR5cGUiOiJTdGF0dXNMaXN0MjAyMSIsInN0YXR1c1B1cnBvc2UiOiJzdXNwZW5zaW9uIiwiZW5jb2RlZExpc3QiOiJINHNJQUFBQUFBQUFBMk1BQUkzdkF0SUJBQUFBIn19.eRnHulruzCNFAD4n3PlAkn7hPouynDvMZxmID8bP0hXCZN3_CswKyIOFSyndpD6EhJfET7j5vVEuVrZXnnC_2A`

const IndexPage = () => {
  const router = useRouter()
  const defaultToken =
    router.asPath.replace('/#', '') === '/'
      ? normalJwt
      : router.asPath.replace('/#', '')
  const [token, setToken] = useState(defaultToken)

  const onTokenChange = (token) => {
    setToken(token)
  }

  return (
    <>
      <Head>
        <Script type="application/vc+ld+jwt">{vcLdJwt}</Script>
        <Script type="application/vc+ld+json">
          {JSON.stringify(
            {
              '@context': [
                'https://www.w3.org/ns/credentials/v2',
                'https://w3id.org/vc/status-list/2021/v1',
              ],
              id: 'https://vendor.example/credentials/status/3',
              type: ['VerifiableCredential', 'StatusList2021Credential'],
              issuer: 'did:example:123',
              validFrom: '2021-04-05T14:27:40.000Z',
              credentialSubject: {
                id: 'https://vendor.example/credentials/status/3#list',
                type: 'StatusList2021',
                statusPurpose: 'suspension',
                encodedList: 'H4sIAAAAAAAAA2MAAI3vAtIBAAAA',
              },
            },
            null,
            2,
          )}
        </Script>
        <Script type="application/ld+json">
          {JSON.stringify(
            {
              '@context': 'https://schema.org',
              '@type': ['EducationalOccupationalCredential'],
              name: 'Certified Safety Professional',
              url: 'https://www.bcsp.org/CSP',
              description: `Certified Safety Professionals (CSP) are persons who 
perform at least 50% of professional level safety duties, 
including making worksite assessments to determine risks, 
assessing potential hazards and controls, 
evaluating risks and hazard control measures, 
investigating incidents, 
maintaining and evaluating incident and loss records, 
and preparing emergency response plans.`,
              credentialCategory: {
                '@type': 'DefinedTerm',
                '@id': 'http://purl.org/ctdl/terms/Certification',
                name: 'Certification',
                inDefinedTermSet: {
                  '@type': 'DefinedTermSet',
                  '@id': 'http://purl.org/ctdl/terms/',
                  name: 'Credential Transparency Description Language',
                },
              },
            },
            null,
            2,
          )}
        </Script>
      </Head>
    
      <Particles params={mappingParams} sx={{}} />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box sx={{ textAlign: 'center', mt: 4, p: 4 }}>
            <Typography variant="h1">
              Transmute JSON Web Tokens into Verifiable Credentials
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ textAlign: 'center', p: 4, pt: 0 }}>
            <Box>
              <Button
                variant="contained"
                color={'primary'}
                sx={{ m: 1, textTransform: 'none' }}
                onClick={() => {
                  onTokenChange(normalJwt)
                }}
              >
                jwt
              </Button>
              <Button
                variant="contained"
                color={'primary'}
                sx={{ m: 1, textTransform: 'none' }}
                onClick={() => {
                  onTokenChange(vcLdJwt)
                }}
              >
                vc+ld+jwt
              </Button>
              <Button
                variant="outlined"
                color={'secondary'}
                sx={{ m: 1, textTransform: 'none' }}
                onClick={() => {
                  window.open('https://github.com/transmute-industries/jwt.vc')
                }}
                endIcon={<Source/>}
              >
                Source
              </Button>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TokenViewer value={token} onChange={onTokenChange} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <DecodedView value={token} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <MappedRepresentation value={token} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <RdfView value={token} />
        </Grid>
      </Grid>
    </>
  )
}

export default IndexPage
