import { useMutation, UseMutationOptions } from 'react-query';
import { JsonRpcProvider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';

import useReadOnlyProvider from 'hooks/web3/use-read-only-provider';

type WithProvider<T> = T & {
  provider: JsonRpcProvider;
  readOnlyProvider: JsonRpcProvider;
};

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function useWeb3Mutation<
  TData,
  TError,
  TVariables,
  TContext = unknown
>(
  mutateAsync: (arg0: WithProvider<TVariables>) => Promise<TData>,
  options?: UseMutationOptions<
    TData,
    TError,
    WithProvider<TVariables>,
    TContext
  >
) {
  const { library: provider } = useWeb3React();
  const { provider: readOnlyProvider } = useReadOnlyProvider();

  return useMutation<TData, TError, TVariables>(async (variables) => {
    // re-activate the provider when it’s not found
    if (!provider) {
      throw Error('No Provider Error');
    }
    return await mutateAsync({
      ...variables,
      provider,
      readOnlyProvider,
    });
  }, options);
}
