'use client'

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Globe from "@/components/Globe";
import VerifiedIcon from '@mui/icons-material/Verified';
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter();
  return (
    <Box sx={{ display: 'flex', flexGrow: 1, flexDirection: 'column' }}>
      <AppBar position="static" sx={{ maxWidth: 1024, margin: 'auto' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Digital Passport
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => { router.push('/verify') }}
            endIcon={<VerifiedIcon />}>
            Fast Lane Access
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ minHeight: 768, mb: '10%' }}>
        <Globe />
      </Box>
    </Box>

  );
}
