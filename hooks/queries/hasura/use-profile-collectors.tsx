import { UseInfiniteQueryOptions, useInfiniteQuery } from 'react-query';
import { ClientError } from 'graphql-request';

import { QueryCacheKey } from 'types/Queries';
import { OmitPagination } from 'types/utils';

import { isAllTrue } from 'utils/helpers';
import { getNextPageParam } from 'utils/artwork/artwork';
import { isQueryEnabled } from '../shared';

import { PUBLIC_FEED_PER_PAGE_COUNT } from 'lib/constants';

import { getUserCollectors } from 'queries/hasura/collectors';
import {
  UserCollectors,
  UserCollectorsVariables,
} from 'graphql/hasura/queries/user-collectors.generated';
import { maybeGetAddressOrEmpty } from 'utils/users';

const perPageCount = PUBLIC_FEED_PER_PAGE_COUNT;

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function useProfileCollectors(
  variables: OmitPagination<UserCollectorsVariables>,
  options?: UseInfiniteQueryOptions<
    UserCollectors['collectors'],
    ClientError,
    UserCollectors['collectors']
  >
) {
  return useInfiniteQuery(
    useProfileCollectors.getKey(variables),
    ({ pageParam = 0 }) =>
      getUserCollectors({
        publicKey: variables.publicKey,
        currentUserPublicKey: maybeGetAddressOrEmpty(
          variables.currentUserPublicKey
        ),
        limit: perPageCount,
        offset: perPageCount * pageParam,
      }),
    {
      ...options,
      getNextPageParam,
      enabled: isAllTrue([isQueryEnabled(options), variables.publicKey]),
    }
  );
}

useProfileCollectors.getKey = (
  variables: OmitPagination<UserCollectorsVariables>
) => [QueryCacheKey.ProfileCollectors, variables];
