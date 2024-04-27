
import Demo from "@/components/Demo"
import Head from "next/head";
export default function VerifyPage() {
 
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta property="og:title" content="Transmute GLN Passport" />
        <meta property="og:description" content="The Global Location Number (GLN) provides businesses the ability to know who is involved in transactions and where things are located throughout the supply chain." />
        <meta property="og:image" content="https://jwt.vc/ai-qr-passport.png"/>
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:domain" content={'jwt.vc'} />
        <meta name="twitter:url" content={'https://jwt.vc/417/1200144791171'} />
        <meta name="twitter:title" content={"Transmute GLN Passport"} />
        <meta name="twitter:description" content={"The Global Location Number (GLN) provides businesses the ability to know who is involved in transactions and where things are located throughout the supply chain."} />
        <meta name="twitter:image" content={"https://jwt.vc/ai-qr-passport.png"} />
      </Head>
      <Demo/>
    </>

  );
}
