import * as React from 'react'

import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'

import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import MapIcon from '@mui/icons-material/Map'
import HomeIcon from '@mui/icons-material/Home'
import { useRouter } from 'next/router'
import Image from 'next/image'
import transmuteLogo from '../public/logo.black.svg'

export default function SearchAppBar({ actions, children }) {
  const router = useRouter()
  return (
    <Box>
      <AppBar position="absolute">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
            onClick={()=>{
              router.push('/')
            }}
          >
           <Image
              priority
              height={32}
              style={{ filter: 'invert(80%)' }}
              src={transmuteLogo}
              alt="Transmute Logo"
            />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            Transmute
          </Typography>
          {actions}
        </Toolbar>
      </AppBar>
      {children}
      <Paper
        sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 100 }}
        elevation={3}
      >
        <BottomNavigation showLabels>
          <BottomNavigationAction
            label="Home"
            icon={<HomeIcon />}
            onClick={() => {
              router.push('/')
            }}
          />
          <BottomNavigationAction
            label="Map"
            icon={<MapIcon />}
            onClick={() => {
              router.push('/map')
            }}
          />
        </BottomNavigation>
      </Paper>
    </Box>
  )
}
