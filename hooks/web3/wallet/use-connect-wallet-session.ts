import { useMutation, UseMutationOptions, useQueryClient } from 'react-query';
import { JsonRpcProvider } from '@ethersproject/providers';

import WalletUser from 'types/WalletUser';

import { connectWalletSession } from 'lib/auth';

import useWalletLocalStorage from './use-wallet-local-storage';
import useWalletSession from './use-wallet-session';

interface ConnectWalletSessionVariables {
  provider: JsonRpcProvider;
}

// TODO: update wallet user cache or refetch session
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function useConnectWalletSession(
  options?: UseMutationOptions<
    WalletUser,
    Error,
    ConnectWalletSessionVariables,
    unknown
  >
) {
  const queryClient = useQueryClient();

  const { setLatestOp } = useWalletLocalStorage();

  return useMutation(
    async (variables) => {
      const { provider } = variables;

      const res = await connectWalletSession({ provider });

      return res.data.user;
    },
    {
      ...options,
      mutationKey: useConnectWalletSession.getKey(),
      onSuccess: (res) => {
        setLatestOp('connect');
        queryClient.setQueryData<WalletUser>(useWalletSession.getKey(), res);
      },
    }
  );
}

useConnectWalletSession.getKey = () => 'ConnectWalletSession';
