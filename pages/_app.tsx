/* eslint-disable react/jsx-max-depth */
import React, { ReactNode, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Web3Provider } from '@ethersproject/providers';

import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Web3ReactProvider } from '@web3-react/core';

import type { AppProps } from 'next/app';

import 'minireset.css/minireset.css';

import 'assets/css/fonts.css';
import 'assets/css/global.css';
import 'assets/css/progress.css';
import 'assets/css/tooltip.css';

import 'react-toggle/style.css';
import 'assets/css/toggle.css';

import useSegment from 'hooks/use-segment';

import MarketApprovalModal from 'components/modals/MarketApprovalModal';
import AuthModal from 'components/modals/auth/AuthModal';
import ProgressBar from 'components/TopProgressBar';

import { globalCss } from 'stitches.config';

function getLibrary<T>(provider: T): Web3Provider {
  return new Web3Provider(provider);
}

type AppPropsComponent = AppProps['Component'];

type ComponentExtension = {
  getLayout: (page: ReactNode, props: unknown) => ReactNode;
};

type CustomComponent = ComponentExtension & AppPropsComponent;

type CustomAppProps = {
  err: unknown;
  Component: CustomComponent;
  pageProps: AppProps['pageProps'];
};

const queryClient = new QueryClient();

const globalStyles = globalCss({
  body: {
    fontFamily: '$body',
    WebkitFontSmoothing: 'antialiased',
    color: '$black100',
    transition: 'background-color $2 $ease',
  },
});

export default function App({
  Component,
  pageProps,
  err,
}: CustomAppProps): JSX.Element {
  // https://adamwathan.me/2019/10/17/persistent-layout-patterns-in-nextjs/
  const getLayout = Component.getLayout || ((page: ReactNode) => page);
  globalStyles();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Web3ReactProvider getLibrary={getLibrary}>
          <ProgressBar />
          <PageAnalytics />
          <>
            <MarketApprovalModal />
            <AuthModal />
            <div id="portal" />
            {getLayout(<Component {...pageProps} err={err} />, pageProps)}
          </>
        </Web3ReactProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
}

function PageAnalytics() {
  const router = useRouter();
  const analytics = useSegment();

  useEffect(
    () => {
      analytics?.page(null, router.pathname, router.query);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.pathname]
  );

  return null;
}
