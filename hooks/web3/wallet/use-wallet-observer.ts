import { useEffect, useCallback } from 'react';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { isMobile } from '@walletconnect/browser-utils';
import { useTimeoutFn } from 'react-use';
import { usePageVisibility } from 'react-page-visibility';

import useConnectWalletSession from './use-connect-wallet-session';
import useWalletSession from './use-wallet-session';
import useWalletLocalStorage from './use-wallet-local-storage';

import { isAllTrue } from 'utils/helpers';
import { areKeysEqual } from 'utils/users';
import { injectedConnector, walletConnectConnector } from 'lib/connectors';

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function useWalletObserver() {
  const web3React = useWeb3React();

  const { data: user, isLoading: isUserLoading } = useWalletSession();

  const isPageVisible = usePageVisibility();

  const { latestOp, latestConnector } = useWalletLocalStorage();

  const { mutate: connectWalletSession, isLoading: isConnectingWalletSession } =
    useConnectWalletSession({
      onError: (err) => {
        web3React.setError(err);
      },
    });

  const connectInjected = useCallback(
    async (injected: InjectedConnector, isInactive: boolean) => {
      const isAuthorized = await injected.isAuthorized();
      const canActivate = isAllTrue([isAuthorized, isInactive]);
      if (canActivate) {
        await web3React.activate(injected);
      }
    },
    [web3React]
  );

  const reconnectWallet = useCallback(
    async () => {
      const isConnectOp = latestOp == 'connect';
      const isInactive = isAllTrue([!web3React.active, !web3React.error]);

      const canActivateInjected = isAllTrue([
        isConnectOp,
        latestConnector == 'METAMASK',
      ]);

      const canActivateWalletConnect = isAllTrue([
        isInactive,
        isConnectOp,
        latestConnector == 'WALLETCONNECT',
      ]);

      if (canActivateInjected) {
        await connectInjected(injectedConnector, isInactive);
      } else if (canActivateWalletConnect) {
        await web3React.activate(walletConnectConnector);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [latestOp, latestConnector, web3React]
  );

  useTimeoutFn(() => {
    reconnectWallet();
  }, 500);

  const userPublicKey = user?.publicAddress;
  const userPublicKeys = [userPublicKey, web3React.account];
  const areKeysPresent = isAllTrue(userPublicKeys);
  const areAccountsEqual = areKeysEqual(userPublicKeys);

  const canChangeAccount = isAllTrue([
    isPageVisible,
    !areAccountsEqual,
    !isConnectingWalletSession,
    areKeysPresent,
    web3React.library,
  ]);

  const canCreateSession = isAllTrue([
    !isMobile(),
    !isConnectingWalletSession,
    !isUserLoading,
    !user,
    web3React.library,
  ]);

  // here we reconnect the wallet session if accounts change
  // as well as when the provider is initially connected
  useEffect(
    () => {
      if (canChangeAccount || canCreateSession) {
        connectWalletSession({
          provider: web3React.library,
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [canChangeAccount, canCreateSession]
  );
}
