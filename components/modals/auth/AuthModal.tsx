import * as Sentry from '@sentry/nextjs';
import { useCallback, useEffect } from 'react';
import { useIsMutating } from 'react-query';
import { useWeb3React } from '@web3-react/core';

import ModalContainer from 'components/modals/common/ModalContainer';
import ModalContent from 'components/modals/common/ModalContent';
import AuthConnect from 'components/auth/AuthConnect';

import useModal from 'hooks/use-modal';
import useSegment from 'hooks/use-segment';
import useWalletSession from 'hooks/web3/wallet/use-wallet-session';
import useUserByPublicKey from 'hooks/queries/use-user-by-public-key';
import useWalletObserver from 'hooks/web3/wallet/use-wallet-observer';
import useConnectWalletSession from 'hooks/web3/wallet/use-connect-wallet-session';
import useConnectWallet from 'hooks/web3/wallet/use-connect-wallet';

import { WalletConnector } from 'types/Wallet';
import { ModalKey } from 'types/modal';

import { isAllTrue, isAnyTrue } from 'utils/helpers';

export default function AuthModal(): JSX.Element {
  const analytics = useSegment();

  useWalletObserver();

  const { data: user } = useWalletSession({
    onSuccess: (user) => {
      if (user) {
        analytics?.identify(user.publicAddress, {
          publicAddress: user.publicAddress,
          provider: user.walletType,
        });
      }
    },
  });

  useUserByPublicKey(
    { publicKey: user?.publicAddress },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      onSuccess: (res) => {
        // Set user information, as well as tags and further extras
        Sentry.configureScope((scope) => {
          scope.setUser({
            id: res.user.publicKey,
            username: res.user.username,
          });
        });
      },
    }
  );

  const { resetModal, currentModal } = useModal();

  const web3React = useWeb3React();

  const { mutateAsync: connectWalletSession } = useConnectWalletSession();

  // Returns a number (if > 0 then this mutation is firing)
  const isMutating = useIsMutating({
    mutationKey: useConnectWalletSession.getKey(),
  });

  const {
    mutateAsync: connectWallet,
    variables: connectWalletVariables,
    isLoading: isConnectWalletLoading,
    isSuccess: isConnectWalletSuccess,
    error: çonnectWalletError,
  } = useConnectWallet();

  const currentConnector = connectWalletVariables?.connector;

  // because the wallet session mutation fires outside of this context
  // we need to find its state using the currently selected connector
  const getWalletLoadingState = useCallback(
    (connector: WalletConnector) =>
      isAllTrue([
        // pass in whether metamask or walletconnect
        currentConnector === connector,
        // has the wallet connected
        isConnectWalletSuccess,
        // is the external mutation firing
        isAnyTrue([isConnectWalletLoading, isMutating > 0]),
      ]),
    [
      currentConnector,
      isConnectWalletSuccess,
      isConnectWalletLoading,
      isMutating,
    ]
  );

  const getWalletSuccessState = useCallback(
    (connector: WalletConnector) =>
      isAllTrue([currentConnector === connector, isConnectWalletSuccess]),
    [currentConnector, isConnectWalletSuccess]
  );

  const connectWalletConnect = useCallback(
    async (hasPreviousAttempt: boolean, connector: WalletConnector) => {
      const canConnectSession = isAllTrue([
        hasPreviousAttempt,
        web3React.library,
      ]);

      if (canConnectSession) {
        await connectWalletSession({ provider: web3React.library });
      } else {
        await connectWallet({ connector });
      }
    },
    [web3React, connectWalletSession, connectWallet]
  );

  const isModalOpen = currentModal === ModalKey.AUTH_MAIN;

  const canCloseModal = isAllTrue([user, web3React.library, isModalOpen]);

  useEffect(() => {
    if (canCloseModal) {
      resetModal();
    }
  }, [canCloseModal, resetModal]);

  const isLoading = isAnyTrue([
    getWalletLoadingState('METAMASK'),
    getWalletLoadingState('WALLETCONNECT'),
    web3React.library,
  ]);

  return (
    <ModalContainer modalKey={ModalKey.AUTH_MAIN}>
      <ModalContent
        css={{
          maxWidth: 440,
          padding: 0,
          '@bp0': {
            borderRadius: 24,
          },
        }}
      >
        <AuthConnect
          connectWalletConnect={connectWalletConnect}
          çonnectWalletError={çonnectWalletError}
          currentConnector={currentConnector}
          isLoading={isLoading}
          walletState={{
            METAMASK: {
              connector: 'METAMASK',
              isLoading: getWalletLoadingState('METAMASK'),
              isSuccess: getWalletSuccessState('METAMASK'),
            },
            WALLETCONNECT: {
              connector: 'WALLETCONNECT',
              isLoading: getWalletLoadingState('WALLETCONNECT'),
              isSuccess: getWalletSuccessState('WALLETCONNECT'),
            },
          }}
        />
      </ModalContent>
    </ModalContainer>
  );
}
