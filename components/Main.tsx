import { useState } from 'react'

import { Grid, Box, Typography, Button } from '@mui/material'

import TokenViewer from './TokenViewer'
import DecodedView from './DecodedView'
import MappedRepresentation from './MappedRepresentation'
import RdfView from './RdfView'
import NetworkView from './NetworkView'
import Particles, { mappingParams } from './Particles'

import { Source } from '@mui/icons-material'
import examples from '../services/examples'

import { useRouter } from 'next/router'

const { normalJwt, vcLdJwt } = examples

const MainPage = () => {
  const router = useRouter()
  const defaultToken =
    router.asPath.replace('/#', '') === '/'
      ? normalJwt
      : router.asPath.replace('/#', '')
  const [token, setToken] = useState(defaultToken)
  const onTokenChange = (token) => {
    setToken(token)
    history.pushState({}, '', `#${token}`)
  }
  return (
    <>
      <Particles params={mappingParams} sx={{}} />
      <Grid container spacing={2} sx={{mb: 4}}>
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
                color={'primary'}
                sx={{ m: 1, textTransform: 'none' }}
                onClick={() => {
                  window.open('https://github.com/w3c/vc-jwt')
                }}
                endIcon={<Source />}
              >
                W3C Spec
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
        <Grid item xs={12} sm={12} md={12}>
          <TokenViewer value={token} onChange={onTokenChange} />
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <DecodedView value={token} />
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <MappedRepresentation value={token} />
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <RdfView value={token} />
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <NetworkView value={token} />
        </Grid>
      </Grid>
    </>
  )
}

export default MainPage
