
import type { Metadata } from "next";

import Demo from "@/components/Demo"

export const metadata: Metadata = {
  title: "Transmute Passport",
  description: "The Global Location Number (GLN) provides businesses the ability to know who is involved in transactions and where things are located throughout the supply chain.",
  openGraph: {
    title: "Global Location Number Passport",
    description: "The Global Location Number (GLN) provides businesses the ability to know who is involved in transactions and where things are located throughout the supply chain.",
    url: "https://jwt.vc/417/1200144791171",
    images: [
      {
        url: "https://jwt.vc/ai-qr-passport.png"
      }
    ]
  },
  twitter: {
    title: "Global Location Number Passport",
    description: "The Global Location Number (GLN) provides businesses the ability to know who is involved in transactions and where things are located throughout the supply chain.",
    card: "summary_large_image",
    images: "https://jwt.vc/ai-qr-passport.png"
  }
  
};


export default function VerifyPage() {
  return (
    <>
      <Demo/>
    </>

  );
}
