import { useInfiniteQuery, UseInfiniteQueryOptions } from 'react-query';
import { ClientError } from 'graphql-request';

import {
  UserFollowersVariables,
  UserFollowers,
  UserFollowersDocument,
} from 'graphql/hasura/queries/user-followers.generated';

import { PUBLIC_FEED_PER_PAGE_COUNT } from 'lib/constants';
import { fndHasuraClient } from 'lib/clients/graphql';
import { OmitPagination } from 'types/utils';

import { isQueryEnabled } from '../shared';

import { isAllTrue } from 'utils/helpers';
import { getNextPageParam } from 'utils/artwork/artwork';
import { maybeGetAddressOrEmpty } from 'utils/users';

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export async function getUserFollowers(variables: UserFollowersVariables) {
  const client = fndHasuraClient();
  const data = await client.request<UserFollowers, UserFollowersVariables>(
    UserFollowersDocument,
    variables
  );
  return data.user.follows;
}

type UserFollows = UserFollowers['user']['follows'];

export default function useUserFollowers(
  variables: OmitPagination<UserFollowersVariables>,
  options?: UseInfiniteQueryOptions<UserFollows, ClientError, UserFollows>
) {
  return useInfiniteQuery(
    useUserFollowers.getKey(variables),
    ({ pageParam = 0 }) =>
      getUserFollowers({
        publicKey: variables.publicKey,
        currentUserPublicKey: maybeGetAddressOrEmpty(
          variables.currentUserPublicKey
        ),
        limit: PUBLIC_FEED_PER_PAGE_COUNT,
        offset: PUBLIC_FEED_PER_PAGE_COUNT * pageParam,
      }),
    {
      ...options,
      getNextPageParam,
      enabled: isAllTrue([isQueryEnabled(options), variables.publicKey]),
    }
  );
}

useUserFollowers.getKey = (
  variables: OmitPagination<UserFollowersVariables>
) => ['UserFollowers', variables];
