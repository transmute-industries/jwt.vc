import type { AppProps } from 'next/app'
import CustomTheme from '../components/Theme'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CustomTheme>
      <Component {...pageProps} />
    </CustomTheme>
  )
}
