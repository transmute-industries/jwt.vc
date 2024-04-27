'use client'

import * as React from 'react';

import { useRouter } from 'next/navigation';
import AppPage from '@/components/AppPage'
import PassportVerified from '@/components/PassportVerified';
import { passport } from '@/services/passport';

import { Box, LinearProgress, Paper, Typography } from '@mui/material';
import Head from 'next/head'
export default function VerifyPage() {
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
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta property="og:title" content="Transmute GLN Passport" />
        <meta property="og:description" content="The Global Location Number (GLN) provides businesses the ability to know who is involved in transactions and where things are located throughout the supply chain." />
        <meta property="og:image" content="https://jwt.vc/ai-qr-passport.png"/>
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:domain" content={'jwt.vc'} />
        <meta name="twitter:url" content={'https://jwt.vc/417/1200144791171'} />
        <meta name="twitter:title" content={"Transmute GLN Passport"} />
        <meta name="twitter:description" content={"The Global Location Number (GLN) provides businesses the ability to know who is involved in transactions and where things are located throughout the supply chain."} />
        <meta name="twitter:image" content={"https://jwt.vc/ai-qr-passport.png"} />
      </Head>
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
    </>

  );
}
