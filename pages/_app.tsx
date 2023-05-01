import type { AppProps } from 'next/app'
import CustomTheme from '../components/Theme'
import CssBaseline from '@mui/material/CssBaseline'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CustomTheme>
      <CssBaseline/>
      <ToastContainer position='bottom-right'/>
      <Component {...pageProps} />
    </CustomTheme>
  )
}
