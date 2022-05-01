import { useInfiniteQuery, UseInfiniteQueryOptions } from 'react-query';
import { ClientError } from 'graphql-request';

import {
  CollectionOwners,
  CollectionOwnersVariables,
  CollectionOwnersDocument,
} from 'graphql/hasura/queries/collection-owners.generated';

import { OmitPagination } from 'types/utils';

import { PUBLIC_FEED_PER_PAGE_COUNT } from 'lib/constants';
import { fndHasuraClient } from 'lib/clients/graphql';

import { isAllTrue } from 'utils/helpers';
import { maybeGetAddressOrEmpty } from 'utils/users';
import { getNextPageParam } from 'utils/artwork/artwork';
import { isQueryEnabled } from '../shared';

export type CollectionOwner = CollectionOwners['owners'][0];

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export async function getCollectionOwners(
  variables: CollectionOwnersVariables
) {
  const client = fndHasuraClient();
  const query = await client.request<
    CollectionOwners,
    CollectionOwnersVariables
  >(CollectionOwnersDocument, variables);
  return query.owners;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function useCollectionOwners(
  variables: OmitPagination<CollectionOwnersVariables>,
  options?: UseInfiniteQueryOptions<
    CollectionOwner[],
    ClientError,
    CollectionOwner[]
  >
) {
  const { contractSlug } = variables;

  const currentUserPublicKey = maybeGetAddressOrEmpty(
    variables.currentUserPublicKey
  );

  return useInfiniteQuery(
    useCollectionOwners.getKey(variables),
    ({ pageParam = 0 }) =>
      getCollectionOwners({
        contractSlug,
        currentUserPublicKey,
        limit: PUBLIC_FEED_PER_PAGE_COUNT,
        offset: PUBLIC_FEED_PER_PAGE_COUNT * pageParam,
      }),
    {
      ...options,
      getNextPageParam,
      enabled: isAllTrue([isQueryEnabled(options), variables.contractSlug]),
    }
  );
}

useCollectionOwners.getKey = (
  variables: OmitPagination<CollectionOwnersVariables>
) => ['CollectionOwners', variables];
