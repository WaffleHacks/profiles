import type { AppProps } from 'next/app';
import Head from 'next/head';

import '../styles/globals.css';

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>WaffleHacks Profile</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <Component {...pageProps} />
      </div>
    </>
  );
}

export default App;
