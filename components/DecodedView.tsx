import dynamic from 'next/dynamic'
import { Typography, Grid } from '@mui/material'
import { decodeJwt, decodeProtectedHeader } from 'jose'
import { useEffect, useState } from 'react'
import Loading from './Loading'
const Editor = dynamic(() => import('./Editor'), {
  ssr: false,
})
export const DecodedView = ({ value }) => {
  const signature = value.split('.').pop()
  const [protectedHeader, setProtectedHeader]: any = useState()
  const [payload, setPayload]: any = useState()
  useEffect(() => {
    ;(async () => {
      try {
        const header = await decodeProtectedHeader(value)
        setProtectedHeader(header)
        const payload = await decodeJwt(value)
        setPayload(payload)
      } catch (e) {
        setProtectedHeader(undefined)
        setPayload(undefined)
      }
    })()
  }, [value])
  return (
    <Grid container spacing={2} sx={{p: 4}}>
      {!protectedHeader ? (
        <Grid item xs={12}>
          <Loading message={'Waiting for valid JSON Web Token...'} />
        </Grid>
      ) : (
        <>
          <Grid item xs={12} sm={12} md={6}>
            <Typography variant="h3" gutterBottom>
              Header <span style={{ fontSize: '0.5em' }}>DECODED</span>
            </Typography>
            <Editor
              mode={'json'}
              value={JSON.stringify(protectedHeader, null, 2)}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <Typography variant="h3" gutterBottom>
              Claimset <span style={{ fontSize: '0.5em' }}>DECODED</span>
            </Typography>
            <Editor mode={'json'} value={JSON.stringify(payload, null, 2)} />
          </Grid>
        </>
      )}
    </Grid>
  )
}

export default DecodedView
