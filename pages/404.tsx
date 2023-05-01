import { Box } from '@mui/material'

import Particles, { transmuteParticles } from '../components/Particles'

const IndexPage = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      flexDirection={'column'}
      sx={{
        backgroundImage: "url('./wallpaper.png')",
        backgroundSize: 'cover',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backgroundBlendMode: 'darken',
      }}
    >
      <Particles params={transmuteParticles} sx={{}}/>
    </Box>
  )
}

export default IndexPage
