import { UseQueryOptions } from 'react-query';

import {
  useUserByPublicKey as useUserByPublicKeyBaseHook,
  UserByPublicKey,
  UserByPublicKeyVariables,
} from 'graphql/hasura/queries/user-by-public-key.generated';

import {
  useUserWithEmailByPublicKey as useUserWithEmailByPublicKeyBaseHook,
  UserWithEmailByPublicKey,
  UserWithEmailByPublicKeyVariables,
} from 'graphql/server/queries/user-with-email-by-public-key.generated';

import { isAllTrue } from 'utils/helpers';
import { isQueryEnabled } from 'hooks/queries/shared';

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function useUserByPublicKey(
  variables: UserByPublicKeyVariables,
  options?: UseQueryOptions<UserByPublicKey, Error>
) {
  return useUserByPublicKeyBaseHook(variables, {
    ...options,
    enabled: isAllTrue([isQueryEnabled(options), ...Object.values(variables)]),
  });
}

useUserByPublicKey.getKey = useUserByPublicKeyBaseHook.getKey;
export function useUserWithEmailByPublicKey(
  variables: UserWithEmailByPublicKeyVariables,
  options?: UseQueryOptions<UserWithEmailByPublicKey, Error>
) {
  return useUserWithEmailByPublicKeyBaseHook(variables, {
    ...options,
    enabled: isAllTrue([isQueryEnabled(options), ...Object.values(variables)]),
  });
}

useUserWithEmailByPublicKey.getKey = useUserWithEmailByPublicKeyBaseHook.getKey;
