import { useQuery, UseQueryOptions } from 'react-query';

import useReadOnlyProvider from '../use-read-only-provider';

import { getCollectionFactory } from './use-deploy-collection';

import { isAllTrue } from 'utils/helpers';

interface PredictCollectionAddressVariables {
  creatorAddress: string;
  nonce: number;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function usePredictCollectionAddress(
  variables: PredictCollectionAddressVariables,
  options?: UseQueryOptions<string, Error>
) {
  const { provider } = useReadOnlyProvider();

  return useQuery(
    usePredictCollectionAddress.getKey(variables),
    async () => {
      const collectionFactory = getCollectionFactory(provider);
      return await collectionFactory.predictCollectionAddress(
        variables.creatorAddress,
        variables.nonce
      );
    },
    {
      ...options,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      enabled: isAllTrue([provider, ...Object.values(variables)]),
    }
  );
}

usePredictCollectionAddress.getKey = (
  variables: PredictCollectionAddressVariables
) => ['PredictCollectionAddress', variables];
