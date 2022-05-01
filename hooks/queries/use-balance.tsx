import { Networkish } from '@ethersproject/providers';
import { useQuery, UseQueryResult } from 'react-query';
import { ClientError } from 'graphql-request';

import useReadOnlyProvider from 'hooks/web3/use-read-only-provider';
import useWalletSession from 'hooks/web3/wallet/use-wallet-session';

import { fromBNDec } from 'utils/numbers';
import { isAllTrue } from 'utils/helpers';

import { QueryCacheKey } from 'types/Queries';

export default function useBalance(
  chainId?: Networkish
): UseQueryResult<number, ClientError> {
  const { data: user } = useWalletSession();
  const { provider } = useReadOnlyProvider(chainId);

  const publicAddress = user?.publicAddress;

  const isReady = isAllTrue([publicAddress, provider]);

  return useQuery(
    [QueryCacheKey.Balance, publicAddress, chainId],
    async () => {
      const balanceData = await provider.getBalance(publicAddress);
      return fromBNDec(balanceData);
    },
    { enabled: isReady, staleTime: 1000 * 60 * 10, refetchOnMount: false }
  );
}
