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

export const theme = createTheme({
 
  palette: {
    mode:'dark',
    background: {
      light: lighten(darkBackgroundColor, 0.07),
      main: darken(darkBackgroundColor, 0.5),
      dark: darken(darkBackgroundColor, 0.2),
      default: darken(darkBackgroundColor, 0.5),
    } as any,
    primary: {
      light: lighten(primaryColor, 0.3),
      main: lighten(primaryColor, 0.2),
      dark: darken(primaryColor, 0.07),
    },
    secondary: {
      light: lighten(secondaryColor, 0.07),
      main: secondaryColor,
      dark: darken(secondaryColor, 0.07),
    },
    text: {
      primary: lighten(darkerLightGrey, 0.5),
      secondary: darkerLightGrey,
    },
    success: {
      light: lighten(successColor, 0.07),
      main: successColor,
      dark: darken(successColor, 0.07),
    },
  },
  status: {
    danger: orange[500],
  },
  typography: {
    fontSize: 16,
    fontFamily: [primaryFont].join(','),
    h1: {
      fontSize: '4em',
      fontWeight: 500,
      fontFamily: 'Rajdhani',
    },
    h2: {
      fontSize: '2em',
      fontWeight: 100,
      fontFamily: 'Rajdhani',
    },
    h3: {
      fontSize: '1.5em',
      fontWeight: 100,
      fontFamily: 'Roboto Condensed',
      letterSpacing: '.1em',
      textTransform: 'uppercase',
    },
    h4: {
      fontSize: '1.75em',
      fontWeight: 100,
      fontFamily: 'Rajdhani',
    },
    h5: {
      fontSize: '1.25em',
      fontWeight: 600,
      fontFamily: 'Rajdhani',
    },
    h6: {},
    subtitle1: {},
    subtitle2: {
      fontSize: '12px',
      color: 'rgba(0,0,0,0.54)',
    },
    body1: {
      fontSize: '1.25em',
    },
    body2: {
      fontSize: '1.1em',
    },
    button: {
      fontSize: '1em',
      fontWeight: 600,
      letterSpacing: '.1em',
      fontFamily: 'Roboto Condensed',
    },
    caption: {},
    overline: {},
  },
});

export default function CustomTheme({children}) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}