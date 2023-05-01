import Script from 'next/script'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import examples from '../services/examples'

const { vcLdJwt } = examples

const Main = dynamic(() => import('../components/Main'), {
  ssr: false,
})

const IndexPage = () => {
  return (
    <>
      <Head>
        <Script type="application/vc+ld+jwt">{vcLdJwt}</Script>
        <Script type="application/vc+ld+json">
          {JSON.stringify(
            {
              '@context': [
                'https://www.w3.org/ns/credentials/v2',
                'https://w3id.org/vc/status-list/2021/v1',
              ],
              id: 'https://vendor.example/credentials/status/3',
              type: ['VerifiableCredential', 'StatusList2021Credential'],
              issuer: 'did:example:123',
              validFrom: '2021-04-05T14:27:40.000Z',
              credentialSubject: {
                id: 'https://vendor.example/credentials/status/3#list',
                type: 'StatusList2021',
                statusPurpose: 'suspension',
                encodedList: 'H4sIAAAAAAAAA2MAAI3vAtIBAAAA',
              },
            },
            null,
            2,
          )}
        </Script>
        <Script type="application/ld+json">
          {JSON.stringify(
            {
              '@context': 'https://schema.org',
              '@type': ['EducationalOccupationalCredential'],
              name: 'Certified Safety Professional',
              url: 'https://www.bcsp.org/CSP',
              description: `Certified Safety Professionals (CSP) are persons who 
perform at least 50% of professional level safety duties, 
including making worksite assessments to determine risks, 
assessing potential hazards and controls, 
evaluating risks and hazard control measures, 
investigating incidents, 
maintaining and evaluating incident and loss records, 
and preparing emergency response plans.`,
              credentialCategory: {
                '@type': 'DefinedTerm',
                '@id': 'http://purl.org/ctdl/terms/Certification',
                name: 'Certification',
                inDefinedTermSet: {
                  '@type': 'DefinedTermSet',
                  '@id': 'http://purl.org/ctdl/terms/',
                  name: 'Credential Transparency Description Language',
                },
              },
            },
            null,
            2,
          )}
        </Script>
      </Head>
      <Main />
    </>
  )
}

export default IndexPage
