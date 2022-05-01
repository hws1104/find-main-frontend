import {
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  UseQueryOptions,
} from 'react-query';
import { ClientError } from 'graphql-request';

import {
  UserCollections,
  UserCollectionsDocument,
  UserCollectionsVariables,
  useUserCollections as useUserCollectionsBaseHook,
} from 'graphql/hasura/queries/user-collections.generated';

import {
  UserAvailableCollections,
  UserAvailableCollectionsVariables,
  useUserAvailableCollections as useUserAvailableCollectionsBaseHook,
} from 'graphql/hasura/queries/user-available-collections.generated';

import { CollectionFragmentExtended } from 'graphql/hasura/hasura-fragments.generated';

import { PUBLIC_FEED_PER_PAGE_COUNT } from 'lib/constants';
import { fndHasuraClient } from 'lib/clients/graphql';

import { maybeGetAddress } from 'utils/users';
import { getNextPageParam } from 'utils/artwork/artwork';
import { OmitPagination } from 'types/utils';
import { getNFT721Address } from 'lib/addresses';
import { isAllTrue } from 'utils/helpers';

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export async function getUserCollections(variables: UserCollectionsVariables) {
  const client = fndHasuraClient();
  const data = await client.request<UserCollections, UserCollectionsVariables>(
    UserCollectionsDocument,
    variables
  );
  return data.collections;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function useUserCollections(
  variables: OmitPagination<UserCollectionsVariables>,
  options?: UseInfiniteQueryOptions<CollectionFragmentExtended[], ClientError>
) {
  const { publicKey } = variables;
  return useInfiniteQuery(
    ['UserCollections', variables],
    ({ pageParam = 0 }) =>
      getUserCollections({
        publicKey: maybeGetAddress(publicKey),
        limit: PUBLIC_FEED_PER_PAGE_COUNT,
        offset: PUBLIC_FEED_PER_PAGE_COUNT * pageParam,
      }),
    { ...options, enabled: Boolean(publicKey), getNextPageParam }
  );
}

export type MintableCollection = UserAvailableCollections['userCollections'][0];

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export function useUserAvailableCollections(
  variables: Pick<UserAvailableCollectionsVariables, 'publicKey'>,
  options?: UseQueryOptions<
    UserAvailableCollections,
    ClientError,
    MintableCollection[]
  >
) {
  const { publicKey } = variables;
  return useUserAvailableCollectionsBaseHook(
    { publicKey, fndContractAddress: getNFT721Address() },
    {
      ...options,
      enabled: isAllTrue([publicKey]),
      select: (res) => [...res.userCollections, ...res.fndCollections],
    }
  );
}

useUserAvailableCollections.getKey = (
  variables: Pick<UserAvailableCollectionsVariables, 'publicKey'>
) => ['UserMintableCollections', variables];
