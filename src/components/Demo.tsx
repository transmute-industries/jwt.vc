
"use client"

import * as React from 'react';

import { useRouter } from 'next/navigation';
import AppPage from '@/components/AppPage'
import PassportVerified from '@/components/PassportVerified';
import { passport } from '@/services/passport';

import { Box, LinearProgress, Paper, Typography } from '@mui/material';
export default function Demo() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [credential, setCredential] = React.useState('')
  const [validation, setValidation] = React.useState()
  React.useEffect(() => {
    const maybeCredential = window.location.hash.split('#').pop() || ''
    if (maybeCredential === '') {
      (async () => {
        setIsLoading(true)
        const c = await passport.get()
        router.push('#' + c)
        setCredential(c)
        setIsLoading(false)
      })()
    } else {
      (async () => {
        setIsLoading(true)
        const v = await passport.check(maybeCredential)
        setValidation(v)
        setIsLoading(false)
      })()
    }
  }, [credential, router])
  return (
    
      <AppPage>
        <>
          {isLoading ? <Box sx={{ p: 2 }}>
            <LinearProgress />
            <Paper sx={{ p: 2 }}>
              <Typography variant='h5'>Verifying</Typography>
            </Paper>
          </Box> : <>
            {validation && <PassportVerified validation={validation} />}
          </>}

        </>
      </AppPage>
   

  );
}
