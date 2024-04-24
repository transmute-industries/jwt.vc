'use client'

import * as jose from 'jose'
import * as React from 'react';

import AppPage from '../../components/AppPage'
import { passport } from '@/services/passport';
import { JsonViewer } from '@textea/json-viewer'
export default function VerifyPage() {
  const [credential, setCredential] = React.useState(window.location.hash.split('#').pop() || '')
  const [claims, setClaims] = React.useState()
  React.useEffect(()=>{
    if (credential === ''){
      (async ()=>{
        const c = await passport.get()
        window.location.hash = '#' + c
        setCredential(c)
      })()
    } else {
      (async ()=>{
        const decoded = await jose.decodeJwt(credential)
        setClaims(decoded as any)
      })()
    }
  }, [credential])
  return (
    <AppPage>
      <>
        {claims && <JsonViewer  theme={'dark'} rootName={false} value={claims} />}
      </>
    </AppPage>
  );
}
