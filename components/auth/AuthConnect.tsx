/* eslint-disable react/jsx-max-depth */
/* eslint-disable max-lines */
import React from 'react';
import { useIsMutating } from 'react-query';
import { isMobile } from '@walletconnect/browser-utils';
import { NoEthereumProviderError } from '@web3-react/injected-connector';
import { useRouter } from 'next/router';

import useConnectWalletSession from 'hooks/web3/wallet/use-connect-wallet-session';
import useDisconnectWallet from 'hooks/web3/wallet/use-disconnect-wallet';

import MetaMaskGradientLink from 'components/auth/MetaMaskGradientLink';
import WalletConnectGradientLink from 'components/auth/WalletConnectGradientLink';
import LoadingButtonV2 from 'components/buttons/LoadingButtonV2';
import Heading from 'components/base/Heading';
import Paragraph from 'components/base/Paragraph';
import TextLink from 'components/base/TextLink';
import Grid from 'components/base/Grid';
import Box from 'components/base/Box';
import Text from 'components/base/Text';
import Flex from 'components/base/Flex';
import MetaMaskNotInstalled from './MetaMaskNotInstalled';

import { WalletConnector } from 'types/Wallet';

import { styled } from 'stitches.config';

const WALLET_LEARN_LINK =
  'https://help.foundation.app/en/articles/4731452-a-complete-guide-to-getting-eth-and-a-wallet-with-metamask';

type ConnectWalletConnectFn = (
  hasPreviousAttempt: boolean,
  connector: WalletConnector
) => Promise<void>;

type WalletState = {
  connector: WalletConnector;
  isSuccess: boolean;
  isLoading: boolean;
};

type WalletRecord = Record<WalletConnector, WalletState>;

interface AuthConnectProps {
  çonnectWalletError: Error;
  walletState: WalletRecord;
  currentConnector: WalletConnector;
  isLoading: boolean;
  connectWalletConnect: ConnectWalletConnectFn;
}

export default function AuthConnect(props: AuthConnectProps): JSX.Element {
  const {
    isLoading,
    çonnectWalletError,
    currentConnector,
    walletState,
    connectWalletConnect,
  } = props;

  const router = useRouter();

  // Returns a number (if > 0 then this mutation is firing)
  const isMutating = useIsMutating({
    mutationKey: useConnectWalletSession.getKey(),
  });

  const { mutateAsync: disconnectWallet } = useDisconnectWallet({
    onSettled: () => {
      router.reload();
    },
  });

  if (çonnectWalletError instanceof NoEthereumProviderError) {
    return (
      <Container.Loading>
        <MetaMaskNotInstalled />
      </Container.Loading>
    );
  }

  // TODO: move this into separate component
  if (isLoading) {
    return (
      <Container.Loading>
        <Heading
          size={3}
          css={{
            marginBottom: '$7',
            textAlign: 'center',
            maxWidth: 260,
          }}
        >
          Sign the message in your wallet to continue
        </Heading>
        <Grid css={{ gap: '$7', width: '100%' }}>
          <Paragraph
            css={{
              textAlign: 'center',
              maxWidth: 260,
              marginX: 'auto',
            }}
          >
            Foundation uses this signature to verify that you’re the owner of
            this Ethereum address.
          </Paragraph>
          <Grid css={{ gap: '$4' }}>
            <LoadingButtonV2
              onClick={() => connectWalletConnect(true, currentConnector)}
              isLoading={isMutating > 0}
              isError={false}
              isSuccess={false}
              label={{
                default: 'Continue',
                loading: 'Sign message in wallet',
              }}
            />

            <TextLink
              onClick={() => disconnectWallet()}
              css={{ marginX: 'auto' }}
            >
              Disconnect
            </TextLink>
          </Grid>
        </Grid>
      </Container.Loading>
    );
  }

  // TODO: move this into separate component
  return (
    <Container.Default>
      <Heading
        size={4}
        css={{
          marginBottom: '$4',
          textAlign: 'center',
        }}
      >
        Select a wallet
      </Heading>
      <Grid
        css={{
          gap: '$6',
          marginBottom: '$6',
          textAlign: 'center',
          '@bp0': {
            gap: '$7',
            marginBottom: '$7',
          },
        }}
      >
        <Paragraph>
          By connecting your wallet, you agree to our{` `}
          <TextLink css={{ display: 'inline' }} href="/terms">
            Terms of Service
          </TextLink>
          {` `}and our{` `}
          <TextLink css={{ display: 'inline' }} href="/privacy">
            Privacy Policy
          </TextLink>
          .
        </Paragraph>
        <Grid css={{ gap: '$3' }}>
          {!isMobile() && (
            <MetaMaskGradientLink
              onClick={() => {
                connectWalletConnect(
                  walletState.METAMASK.isSuccess,
                  'METAMASK'
                );
              }}
              isLoading={walletState.METAMASK.isLoading}
            />
          )}

          <WalletConnectGradientLink
            onClick={() => {
              connectWalletConnect(
                walletState.WALLETCONNECT.isSuccess,
                'WALLETCONNECT'
              );
            }}
            isLoading={walletState.WALLETCONNECT.isLoading}
          />
        </Grid>
      </Grid>
      <Grid css={{ justifyContent: 'center', textAlign: 'center', gap: '$2' }}>
        <Text>New to Ethereum?</Text>
        <Text>
          <TextLink href={WALLET_LEARN_LINK}>Learn more about wallets</TextLink>
        </Text>
      </Grid>
    </Container.Default>
  );
}

const Container = {
  Default: styled(Box, {
    padding: '$7',
    '@bp0': {
      padding: '$8',
    },
  }),
  Loading: styled(Flex, {
    flexDirection: 'column',
    alignItems: 'center',
    padding: '$7',
    paddingTop: '$8',
    '@bp0': {
      paddingX: 40,
      paddingTop: '$9',
      paddingBottom: 40,
    },
  }),
};
