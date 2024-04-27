import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Theme from "@/components/Theme";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Digitial Passport",
  description: "JSON Web Token based Verifiable Credentials, with JKT TLSA Records for Issuers.",
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
          <Theme>
            {children}
          </Theme>
      </body>
    </html>
  );
}
