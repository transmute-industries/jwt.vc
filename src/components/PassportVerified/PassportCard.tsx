import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import FilledInput from '@mui/material/FilledInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import { Fingerprint, AutoDelete, SafetyCheck, Draw, ExitToApp, Verified, FactCheck, Google, Dns, KeyOff, Key, Flaky, TravelExplore } from '@mui/icons-material';
import moment from 'moment';
import { Grid, IconButton, Paper, Typography, Button, LinearProgress, Chip } from '@mui/material';


import { passport } from '@/services/passport';
import Image from 'next/image';
import QRCode from "react-qr-code";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`digital-passport-tabpanel-${index}`}
      aria-labelledby={`digital-passport-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ mt: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `digital-passport-tab-${index}`,
    'aria-controls': `digital-passport-tabpanel-${index}`,
  };
}

export default function PassportCard({ validation, json }: any) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const issuer = validation.content.issuer.id
  const issuerWebsite = 'https://' + issuer.replace('did:web:', '')
  const issuerURL = new URL(issuerWebsite)
  const issuerTransparency = `https://crt.sh/?q=${issuerURL.hostname}`
  const googleSafeBrowsing = `https://transparencyreport.google.com/safe-browsing/search?url=${encodeURI(issuerWebsite)}&hl=en`
  const tlsaLookup = `https://www.nslookup.io/domains/_did.${issuerURL.hostname}/dns-records/tlsa/`

  const [issuerVerificationKeyThumbprint, setIssuerVerificationKeyThumbprint] = React.useState(undefined);
  const [isChecking, setIsChecking] = React.useState(false);

  const checkSigningKeys = async () => {
    setIsChecking(true)
    setIssuerVerificationKeyThumbprint(undefined)
    const validation = await passport.client.controller.verify(issuer)
    if (validation.checks.TLSA.verified){
      setIssuerVerificationKeyThumbprint(validation.assurance.jkt)
    } else {
      setIssuerVerificationKeyThumbprint(null)
    }
    setIsChecking(false)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="digital passport tabs">
          <Tab label="Subject" {...a11yProps(0)} />
          <Tab label="Issuer" {...a11yProps(1)} />
          <Tab label="Validation" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
            <FormControl fullWidth sx={{ m: 1 }} variant="filled">
              <InputLabel htmlFor="filled-passport-issuer">Global Location Number</InputLabel>
              <FilledInput
                id="filled-passport-issuer"
                value={validation.content.credentialSubject.gln}
                endAdornment={<InputAdornment position="end">
                  <IconButton aria-label="review subject global location number" color="secondary" href={validation.content.credentialSubject.gln} target='_blank'>
                  <TravelExplore />
                    </IconButton>
                  </InputAdornment>}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{p:1}}>
              <QRCode value="https://jwt.vc/417/1200144791171" />
              {/* <Image src="/ai-qr-passport.png" alt={"passport qr code"} width={256} height={256}/> */}
            </Box>
          
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth sx={{ m: 1 }} variant="filled">
              <InputLabel htmlFor="filled-passport-identity">Subject</InputLabel>
              <FilledInput
                id="filled-passport-identity"
                value={validation.content.credentialSubject.id}
                endAdornment={<InputAdornment position="end"><Fingerprint /></InputAdornment>}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth sx={{ m: 1 }} variant="filled">
              <InputLabel htmlFor="filled-passport-issuer">Issuer</InputLabel>
              <FilledInput
                id="filled-passport-issuer"
                value={validation.content.issuer.id}

                endAdornment={<InputAdornment position="end"><Draw /></InputAdornment>}
              />
            </FormControl>
          </Grid>
          
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth sx={{ m: 1 }} variant="filled">
              <InputLabel htmlFor="filled-passport-issued">Issued</InputLabel>
              <FilledInput
                id="filled-passport-issued"
                value={moment(validation.content.validFrom).format('LLLL')}

                endAdornment={<InputAdornment position="end"><SafetyCheck /></InputAdornment>}
              />
              <FormHelperText sx={{ mt: 1 }}>
                Issued {moment(validation.content.validFrom).fromNow()}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth sx={{ m: 1 }} variant="filled">
              <InputLabel htmlFor="filled-passport-expires">Expires</InputLabel>
              <FilledInput
                id="filled-passport-expires"
                value={moment(validation.content.validUntil).format('LLLL')}

                endAdornment={<InputAdornment position="end"><AutoDelete /></InputAdornment>}
              />
              <FormHelperText sx={{ mt: 1 }}>
                Expires {moment(validation.content.validUntil).fromNow()}
              </FormHelperText>
            </FormControl>
          </Grid>
        </Grid>

      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth sx={{ m: 1 }} variant="filled">
              <InputLabel htmlFor="filled-passport-issuer">Website</InputLabel>
              <FilledInput
                id="filled-passport-issuer"
                value={issuerWebsite}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton aria-label="visit issuer website" color="secondary" href={issuerWebsite} target='_blank'>
                      <ExitToApp />
                    </IconButton>
                  </InputAdornment>

                }
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth sx={{ m: 1 }} variant="filled">
              <InputLabel htmlFor="filled-passport-issuer">Certificate Transparency</InputLabel>
              <FilledInput
                id="filled-passport-issuer"
                value={issuerURL.hostname}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton aria-label="review issuer certificate transparency" color="secondary" href={issuerTransparency} target='_blank'>
                      <Verified />
                    </IconButton>
                  </InputAdornment>

                }
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth sx={{ m: 1 }} variant="filled">
              <InputLabel htmlFor="filled-passport-issuer-google-transparency">Google Transparency Report</InputLabel>
              <FilledInput
                id="filled-passport-google-transparency"
                value={issuerURL.hostname}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton aria-label="review website on google save safe browsing" color="secondary" href={googleSafeBrowsing} target='_blank'>
                      <Google />
                    </IconButton>
                  </InputAdornment>

                }
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth sx={{ m: 1 }} variant="filled">
              <InputLabel htmlFor="filled-passport-issuer-tlsa">TLSA Records</InputLabel>
              <FilledInput
                id="filled-passport-issuer-tlsa"
                value={'_did.' + issuerURL.hostname}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton aria-label="review tlsa records for issuer" color="secondary" href={tlsaLookup} target='_blank'>
                      <Dns />
                    </IconButton>
                  </InputAdornment>

                }
              />
            </FormControl>
          </Grid>
        </Grid>

        <Box>

          <Paper >


            <Box sx={{ p: 4, m: 2 }}>

              <Typography variant='h4' sx={{ mb: 2 }}>Issuer verification key revoked?</Typography>
              <Typography variant='body1' sx={{ mb: 4 }}>{`Confirm the issuer's verification key matches their TLSA records.`}</Typography>

              <Typography variant='body1' sx={{ mb: 4 }}>
                {issuerVerificationKeyThumbprint === undefined ? <> <Chip icon={<Flaky />} color={'warning'} label={`TLSA records might not match verification key`} /></> : <>
                  {issuerVerificationKeyThumbprint === null ? <>
                    <Chip icon={<KeyOff />} color={'error'} label={`TLSA records DO NOT MATCH verification key`} />
                  </> : <>
                  <Chip icon={<Key />} color={'success'} label={issuerVerificationKeyThumbprint} />
                  </>}
                </>}

              </Typography>
              <Button variant="contained" endIcon={<FactCheck />} disabled={isChecking} onClick={checkSigningKeys}>
                Check Records
              </Button>
            </Box>
            {isChecking ? <> <LinearProgress /></> : <></>}
          </Paper>
        </Box>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        {json}
      </CustomTabPanel>
    </Box>
  );
}
