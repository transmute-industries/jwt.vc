import dynamic from 'next/dynamic'
import { Typography, Box } from '@mui/material'
import { useEffect, useState } from 'react'
import MappingHero from './MappingHero'

import token from '../services/token'

const Editor = dynamic(() => import('./Editor'), {
  ssr: false,
})
export const MappedRepresentation = ({ value }) => {
  const [credential, setCredential]: any = useState()
  useEffect(() => {
    if (value.length){
    setCredential(undefined)
    setTimeout(async ()=>{
      try {
        const credential = await token.transform(value)
        setCredential(credential)
      } catch (e) {
        console.error(e)
        setCredential(undefined)
      }
    }, 5 * 1000)
  }
  }, [value])
  return (
    <Box sx={{ p: 2 }}>
      {!credential ? (
        <>
          <MappingHero message={'Transforming token...'}/>
        </>
      ) : (
        <>
          <Box sx={{ p: 2 }}>
            <Typography variant="h2" gutterBottom>
              Verifiable Credential <span style={{ fontSize: '0.5em' }}>PREVIEW</span>
            </Typography>
            <Editor mode={'json'} value={JSON.stringify(credential, null, 2)} sx={{height: '512px'}}/>
          </Box>
        </>
      )}
    </Box>
  )
}

export default MappedRepresentation
