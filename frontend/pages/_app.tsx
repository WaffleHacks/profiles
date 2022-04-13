import type { AppProps } from 'next/app';
import Head from 'next/head';

import '../styles/globals.css';

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>WaffleHacks Profile</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />

        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#da6f2c" />
        <meta name="theme-color" content="#da6f2c" />
      </Head>

      <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <Component {...pageProps} />
      </div>
    </>
  );
}

export default App;
