import { UseQueryOptions } from 'react-query';
import {
  useUserFollowState as useUserFollowStateBaseHook,
  UserFollowStateVariables,
  UserFollowState,
} from 'graphql/hasura/queries/user-follow-state.generated';

import { isQueryEnabled } from 'hooks/queries/shared';

import { isAllTrue } from 'utils/helpers';
import { maybeGetAddressOrEmpty } from 'utils/users';

export type UserFollowStateSelected = {
  isFollowingUser: boolean;
  followerCount: number;
  followingCount: number;
};

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function useUserFollowState(
  variables: UserFollowStateVariables,
  options?: UseQueryOptions<UserFollowState, Error, UserFollowStateSelected>
) {
  return useUserFollowStateBaseHook(
    {
      publicKey: variables.publicKey,
      currentUserPublicKey: maybeGetAddressOrEmpty(
        variables.currentUserPublicKey
      ),
    },
    {
      ...options,
      enabled: isAllTrue([isQueryEnabled(options), variables.publicKey]),
      select: (res) => ({
        isFollowingUser: res.user?.isFollowingUser?.aggregate?.count > 0,
        followerCount: res.user?.followerCount?.aggregate?.count,
        followingCount: res.user?.followingCount?.aggregate?.count,
      }),
    }
  );
}
