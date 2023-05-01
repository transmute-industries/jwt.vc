import { Box, CircularProgress, Typography } from '@mui/material'

export default function MappingHero({message}) {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="256px"
      flexDirection={'column'}
    >
      <CircularProgress sx={{mb: 2}} />
      <Typography color={'seconary'}>{message || 'Transforming...'}</Typography>
    </Box>
  )
}
