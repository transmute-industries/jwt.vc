import { Box, CircularProgress, Typography } from '@mui/material'

export type LoadingProps = {
  message: string
}

export default function Loading({message}: LoadingProps) {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      flexDirection={'column'}
    >
      <CircularProgress sx={{mb: 2}} />
      <Typography color={'seconary'}>{message}</Typography>
    </Box>
  )
}
