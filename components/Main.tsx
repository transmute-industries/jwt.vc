import { useState } from 'react'

import { Grid, Box, Typography, Button } from '@mui/material'

import TokenViewer from './TokenViewer'
import DecodedView from './DecodedView'
import MappedRepresentation from './MappedRepresentation'
import RdfView from './RdfView'
import Particles, { mappingParams } from './Particles'

import { Source } from '@mui/icons-material'
import examples from '../services/examples'

const { normalJwt, vcLdJwt } = examples

const MainPage = () => {
  const [token, setToken] = useState(normalJwt)
  const onTokenChange = (token) => {
    setToken(token)
  }
  return (
    <>
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
                endIcon={<Source />}
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

export default MainPage
