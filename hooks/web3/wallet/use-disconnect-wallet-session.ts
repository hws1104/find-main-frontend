import { useMutation, UseMutationOptions, useQueryClient } from 'react-query';

import WalletUser from 'types/WalletUser';

import { disconnectWalletSession } from 'lib/auth';

import useWalletSession from './use-wallet-session';

interface DisconnectWalletSession {
  done: boolean;
}

// TODO: update wallet user cache or refetch session
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function useDisconnectWalletSession(
  options?: UseMutationOptions<DisconnectWalletSession, Error>
) {
  const queryClient = useQueryClient();

  return useMutation(
    async () => {
      const res = await disconnectWalletSession();
      return res.data;
    },
    {
      ...options,
      onSuccess: () => {
        queryClient.setQueryData<WalletUser>(useWalletSession.getKey(), null);
      },
    }
  );
}
