import { useMutation, UseMutationOptions } from 'react-query';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { useRouter } from 'next/router';

import useWalletLocalStorage from './use-wallet-local-storage';
import useDisconnectWalletSession from './use-disconnect-wallet-session';

import { isAuthenticatedRoute } from 'utils/auth';

interface DisconnectWallet {
  done: boolean;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function useDisconnectWallet(
  options?: UseMutationOptions<DisconnectWallet, Error>
) {
  const web3React = useWeb3React<Web3Provider>();

  const router = useRouter();

  const { setLatestOp, resetWalletConnectState } = useWalletLocalStorage();
  const { mutateAsync: disconnectWalletSession } = useDisconnectWalletSession();

  return useMutation(
    async () => {
      web3React.deactivate();
      setLatestOp('disconnect');
      resetWalletConnectState();

      return await disconnectWalletSession();
    },
    {
      ...options,
      onSuccess: async () => {
        const isAuthRoute = isAuthenticatedRoute(router.pathname);

        if (isAuthRoute) {
          await router.push('/');
        }
      },
    }
  );
}
