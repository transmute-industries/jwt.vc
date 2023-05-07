import * as React from 'react';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { orange, blue } from '@mui/material/colors';
import CssBaseline from '@mui/material/CssBaseline';
import { darken, lighten } from '@mui/material/styles';
declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: string;
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}

const primaryFont = '"Rajdhani"';
// const lightGrey = '#f5f7fd';
const darkerLightGrey = '#8286a3';
const primaryColor = '#594aa8';
const secondaryColor = blue['200'];
const darkBackgroundColor = '#2a2d4c';
const lightBackgroundColor = '#565a7c';
const successColor = '#48caca';

export const backgroundColor = darken(darkBackgroundColor, 0.4)

export const theme = createTheme({
  palette: {
    mode:'dark',
    primary: {
      main: lighten(primaryColor, 0.2),
    },
    secondary: {
      main: secondaryColor,
    },
    background: {
      default: backgroundColor
    }
  },
  typography: {
    fontFamily: [primaryFont].join(','),
    h1: {
      fontSize: '4em'
    },
    h2: {
      fontSize: '3em'
    },
    h3: {
      fontSize: '2em'
    },
  }
});

export default function CustomTheme({children}) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}