import { useState } from 'react'

import { Grid, Box, Typography } from '@mui/material'

import TokenViewer from '../components/TokenViewer'
import DecodedView from '../components/DecodedView'
import MappedRepresentation from '../components/MappedRepresentation'
import RdfView from '../components/RdfView'
import Particles, { mappingParams } from '../components/Particles'

const defaultToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`

const IndexPage = () => {
  const [token, setToken] = useState(defaultToken)
  const onTokenChange = (token) => {
    setToken(token)
  }
  return (
    <>
      <Particles
        params={mappingParams}
        sx={{ position: 'absolute', zIndex: -1000 }}
      />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box sx={{ textAlign: 'center', mt: 4, p: 4 }}>
            <Typography variant="h1">
              Transmute JSON Web Tokens into Verifiable Credentials
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <TokenViewer value={token} onChange={onTokenChange} />
        </Grid>
        <Grid item xs={6}>
          <DecodedView value={token} />
        </Grid>
        <Grid item xs={12}>
          <MappedRepresentation value={token} />
        </Grid>
        <Grid item xs={12}>
          <RdfView value={token} />
        </Grid>
        
      </Grid>
    </>
  )
}

export default IndexPage
