'use client'

import * as jose from 'jose'
import * as React from 'react';

import AppPage from '../../components/AppPage'
import { passport } from '@/services/passport';
import { JsonViewer } from '@textea/json-viewer'

import { useRouter } from 'next/navigation';

export default function VerifyPage() {
  const router = useRouter()
  const [credential, setCredential] = React.useState( '')
  const [validation, setValidation] = React.useState()
  React.useEffect(()=>{
    const maybeCredential = window.location.hash.split('#').pop() || ''
    if (maybeCredential === ''){
      (async ()=>{
        const c = await passport.get()
        router.push( '#' + c)
        setCredential(c)
      })()
    } else {
      (async ()=>{
        const v = await passport.check(maybeCredential)
        setValidation(v)
      })()
    }
  }, [credential, router])
  return (
    <AppPage>
      <>
        {validation && <JsonViewer  theme={'dark'} rootName={false} value={validation} />}
      </>
    </AppPage>
  );
}
