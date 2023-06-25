import { NextPage } from 'next';
import { AuthProvider } from '../context/auth';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ReactElement, ReactNode } from 'react';

export type NextPageWithLayout<P = {}> = NextPage<P> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};
function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return <AuthProvider>{getLayout(<Component {...pageProps} />)}</AuthProvider>;
}

export default MyApp;
