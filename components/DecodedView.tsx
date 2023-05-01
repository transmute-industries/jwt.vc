import dynamic from 'next/dynamic'
import { Typography, Box } from '@mui/material'
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
    <Box sx={{ p: 2 }}>
      {!protectedHeader ? (
        <>
          <Loading message={'Waiting for valid JSON Web Token...'} />
        </>
      ) : (
        <>
          <Typography variant="h2">
            Decoded <span style={{ fontSize: '0.5em' }}>PREVIEW</span>
          </Typography>
          <Box sx={{ p: 2 }}>
            <Typography variant="h3" gutterBottom>
              Header
            </Typography>
            <Editor
              mode={'json'}
              value={JSON.stringify(protectedHeader, null, 2)}
            />
          </Box>
          <Box sx={{ p: 2 }}>
            <Typography variant="h3" gutterBottom>
              Payload
            </Typography>
            <Editor mode={'json'} value={JSON.stringify(payload, null, 2)} />
          </Box>
          {/* <Box sx={{ p: 2 }}>
            <Typography variant="h3" gutterBottom>
              Signature
            </Typography>
            <Editor mode={'text'} value={signature} sx={{ height: '32px' }} />
          </Box> */}
        </>
      )}
    </Box>
  )
}

export default DecodedView
