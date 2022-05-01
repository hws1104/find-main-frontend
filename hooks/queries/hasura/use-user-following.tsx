import { useInfiniteQuery, UseInfiniteQueryOptions } from 'react-query';
import { ClientError } from 'graphql-request';

import {
  UserFollowingVariables,
  UserFollowing,
  UserFollowingDocument,
} from 'graphql/hasura/queries/user-following.generated';

import { PUBLIC_FEED_PER_PAGE_COUNT } from 'lib/constants';
import { fndHasuraClient } from 'lib/clients/graphql';
import { OmitPagination } from 'types/utils';

import { isQueryEnabled } from '../shared';

import { isAllTrue } from 'utils/helpers';
import { getNextPageParam } from 'utils/artwork/artwork';
import { maybeGetAddressOrEmpty } from 'utils/users';

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export async function getUserFollowing(variables: UserFollowingVariables) {
  const client = fndHasuraClient();
  const data = await client.request<UserFollowing, UserFollowingVariables>(
    UserFollowingDocument,
    variables
  );
  return data.user.following;
}

export type UserFollows = UserFollowing['user']['following'];

export default function useUserFollowing(
  variables: OmitPagination<UserFollowingVariables>,
  options?: UseInfiniteQueryOptions<UserFollows, ClientError, UserFollows>
) {
  return useInfiniteQuery(
    useUserFollowing.getKey(variables),
    ({ pageParam = 0 }) =>
      getUserFollowing({
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

useUserFollowing.getKey = (
  variables: OmitPagination<UserFollowingVariables>
) => ['UserFollowing', variables];
