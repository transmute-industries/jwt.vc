import { Html, Head, Main, NextScript } from 'next/document'

import meta from '../services/social'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta property="og:title" content={meta.title} />
        <meta property="og:url" content={meta.url} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:image" content={meta.image} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:domain" content={meta.domain} />
        <meta name="twitter:url" content={meta.url} />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content={meta.image} />
        <link
          href="https://fonts.googleapis.com/css?family=Rajdhani:500"
          rel="stylesheet"
        />
        <style>
          {`
#tsparticles{
  position: fixed;
  z-index: -1;
}    
.transmute-jwt-header {
  position: absolute;
  background-color: red;
  opacity: 0.5;
}
.transmute-jwt-payload {
  position: absolute;
  background-color: purple;
  opacity: 0.5;
}
.transmute-jwt-signature {
  position: absolute;
  background-color: blue;
  opacity: 0.5;
}
          `}
        </style>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
