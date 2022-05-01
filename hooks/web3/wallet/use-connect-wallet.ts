import { useMutation, UseMutationOptions } from 'react-query';
import { cond } from 'ramda';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { AbstractConnector } from '@web3-react/abstract-connector';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';

import { WalletConnector } from 'types/Wallet';

import { injectedConnector, walletConnectConnector } from 'lib/connectors';

import useWalletLocalStorage from './use-wallet-local-storage';

interface ConnectWalletVariables {
  connector: WalletConnector;
}

interface ConnectWallet {
  done: boolean;
  connector: AbstractConnector;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function useConnectWallet(
  options?: UseMutationOptions<
    ConnectWallet,
    Error,
    ConnectWalletVariables,
    unknown
  >
) {
  const web3React = useWeb3React<Web3Provider>();

  const { setLatestOp, setLatestConnector, resetWalletConnectState } =
    useWalletLocalStorage();

  return useMutation(async (variables) => {
    const connectorType = variables.connector;

    const connector = getConnector(connectorType);

    // https://github.com/NoahZinsmeister/web3-react/issues/124#issuecomment-984882534
    try {
      await web3React.activate(connector, undefined, true);
    } catch (err) {
      console.log('web3React.activate err', err);
      setLatestOp('disconnect');
      resetWalletConnectState();
      if (connectorType === 'WALLETCONNECT') {
        resetWalletConnector(connector);
      }
      throw err;
    }

    setLatestConnector(connectorType);

    return {
      done: true,
      connector,
    };
  }, options);
}

const getConnector = cond<WalletConnector, AbstractConnector>([
  [(connector) => connector === 'METAMASK', () => injectedConnector],
  [(connector) => connector === 'WALLETCONNECT', () => walletConnectConnector],
]);

// https://github.com/NoahZinsmeister/web3-react/issues/124#issuecomment-993923827
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export function resetWalletConnector(connector: AbstractConnector) {
  if (connector && connector instanceof WalletConnectConnector) {
    connector.walletConnectProvider = undefined;
  }
}
