import dynamic from 'next/dynamic'
import { Typography, Box } from '@mui/material'
import { useEffect, useState } from 'react'
import MappingHero from './MappingHero'

import token from '../services/token'
import {toast} from 'react-toastify'

const Editor = dynamic(() => import('./Editor'), {
  ssr: false,
})
export const MappedRepresentation = ({ value }) => {
  const [nquads, setNquads]: any = useState('')
  useEffect(() => {
    if (value.length){
      setNquads('')
      setTimeout(async ()=>{
        try {
          const abstractDataModel = await token.rdf(value)
          setNquads(abstractDataModel)
        } catch (e) {
          console.error(e)
          toast.error(e.message)
          setNquads('')
        }
      }, 10 * 1000)
    }
    
  }, [value])
  return (
    <Box sx={{ p: 2 }}>
      {!nquads ? (
        <>
          <MappingHero message={'Canonicalizing the hyper graph....'}/>
        </>
      ) : (
        <>
          <Box sx={{ p: 2 }}>
            <Typography variant="h2" gutterBottom>
              Resource Description Framework <span style={{ fontSize: '0.5em' }}>PREVIEW</span>
            </Typography>
            <Editor mode={'markdown'} value={nquads} sx={{height: '512px'}}/>
          </Box>
        </>
      )}
    </Box>
  )
}

export default MappedRepresentation
