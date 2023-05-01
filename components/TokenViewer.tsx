
import dynamic from 'next/dynamic'
import {Typography, Box} from '@mui/material'
const TokenEditor = dynamic(() => import('./TokenEditor'), {
  ssr: false,
})

export const TokenViewer = ({
  value,
  onChange
}) => {
  return (
    <Box sx={{p:2}}>
      <Typography variant='h2' gutterBottom >Encoded <span style={{fontSize: '0.5em'}}>PASTE A TOKEN HERE</span></Typography>
      <TokenEditor value={value} onChange={onChange}/>
    </Box>
  )
}

export default TokenViewer