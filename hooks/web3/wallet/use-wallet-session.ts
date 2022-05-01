import { useQuery, UseQueryOptions } from 'react-query';

import WalletUser from 'types/WalletUser';

import { getWalletSession } from 'lib/auth';

// TODO: update wallet user cache or refetch session
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function useWalletSession(
  options?: UseQueryOptions<WalletUser, Error>
) {
  return useQuery(
    useWalletSession.getKey(),
    async () => {
      const res = await getWalletSession();
      return res.data.user;
    },
    {
      ...options,
      retry: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );
}

useWalletSession.getKey = () => 'WalletSession';
