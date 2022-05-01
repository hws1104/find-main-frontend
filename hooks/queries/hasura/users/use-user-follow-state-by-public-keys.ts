import { UseQueryOptions } from 'react-query';

import {
  useUserFollowStateByPublicKeys as useUserFollowStateByPublicKeysBaseHook,
  UserFollowStateByPublicKeysVariables,
  UserFollowStateByPublicKeys,
} from 'graphql/hasura/queries/user-follow-state-by-public-keys.generated';

import { maybeGetAddressOrEmpty } from 'utils/users';

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function useUserFollowStateByPublicKeys(
  variables: UserFollowStateByPublicKeysVariables,
  options: UseQueryOptions<
    UserFollowStateByPublicKeys,
    Error,
    UserFollowStateByPublicKeys['users']
  >
) {
  const currentUserPublicKey = maybeGetAddressOrEmpty(
    variables.currentUserPublicKey
  );

  return useUserFollowStateByPublicKeysBaseHook(
    { ...variables, currentUserPublicKey },
    {
      ...options,
      select: (res) => res.users,
      initialData: { users: [] },
    }
  );
}

useUserFollowStateByPublicKeys.getKey =
  useUserFollowStateByPublicKeysBaseHook.getKey;
