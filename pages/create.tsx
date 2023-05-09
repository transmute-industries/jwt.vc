import { useRef, useState, useEffect } from 'react'
import { Box, Button } from '@mui/material'
import moment from 'moment'
import CreateIcon from '@mui/icons-material/Create'

import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

import issuer from '../services/issuer'
import AppPage from '../components/AppPage'
const CredentialEditor = dynamic(
  () => import('../components/CredentialEditor'),
  {
    ssr: false,
  },
)

const example = `${JSON.stringify(
  {
    '@context': ['https://www.w3.org/ns/credentials/v2'],
    type: ['VerifiableCredential'],
    issuer: {
      id: issuer.iss,
      type: 'Organization',
      name: 'Capital Factory',
      location: {
        type: 'Place',
        address: {
          type: 'PostalAddress',
          streetAddress: '701 Brazos St',
          addressLocality: 'Austin',
          addressRegion: 'Texas',
          postalCode: '78701',
          addressCountry: 'US',
        },
      },
    },
    validFrom: moment().toISOString(),
    credentialSubject: {
      id: issuer.iss,
      type: 'Organization',
      name: 'Los Angeles Harbor Department',
      location: {
        type: 'Place',
        address: {
          type: 'PostalAddress',
          streetAddress: '425 S. Palos Verdes St.',
          addressLocality: 'San Pedro',
          addressRegion: 'CA',
          postalCode: '90731',
          addressCountry: 'US',
        },
      },
    },
  },
  null,
  2,
)}
`

const IndexPage = () => {
  const router = useRouter()
  const [credential, setCredential] = useState(example)
  const handleIssue = async () => {
    const vc = await issuer.signer.sign({
      header: {
        iss: issuer.iss,
        kid: issuer.kid,
        alg: issuer.alg,
        typ: 'vc+ld+jwt',
        cty: 'vc+ld+json',
      },
      claimset: JSON.parse(credential)
    })
    router.push(`/#${vc}`)
  }
  return (
    <AppPage
      actions={
        <Button
          variant="contained"
          color={'secondary'}
          endIcon={<CreateIcon />}
          onClick={handleIssue}
        >
          Issue
        </Button>
      }
    >
      <Box sx={{ mt: 8 }}>
        <CredentialEditor
          mode={'json'}
          value={credential}
          onChange={(text) => {
            setCredential(text)
          }}
          sx={{height: '600px'}}
        />
      </Box>
    </AppPage>
  )
}

export default IndexPage
