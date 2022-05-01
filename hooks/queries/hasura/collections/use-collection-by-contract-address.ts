import { UseQueryOptions } from 'react-query';

import {
  useCollectionByContractAddress as useCollectionByContractAddressBaseHook,
  CollectionByContractAddressVariables,
  CollectionByContractAddress,
} from 'graphql/hasura/queries/collection-by-contract-address.generated';

import { getFirstValue, isAllTrue } from 'utils/helpers';
import { isQueryEnabled } from 'hooks/queries/shared';

type Collection = CollectionByContractAddress['collections'][0];

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function useCollectionByContractAddress(
  variables: CollectionByContractAddressVariables,
  options?: UseQueryOptions<CollectionByContractAddress, Error, Collection>
) {
  return useCollectionByContractAddressBaseHook(variables, {
    ...options,
    enabled: isAllTrue([variables.contractAddress, isQueryEnabled(options)]),
    select: (res) => getFirstValue(res.collections),
  });
}
