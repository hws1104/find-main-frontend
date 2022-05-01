import { UseQueryOptions } from 'react-query';

import {
  useUserSocialVerificationsByService,
  UserSocialVerificationsByService,
  UserSocialVerificationsByServiceVariables,
} from 'graphql/hasura/queries/user-social-verifications-by-service.generated';

import {
  useUserValidSocialVerificationsByService,
  UserValidSocialVerificationsByService,
  UserValidSocialVerificationsByServiceVariables,
} from 'graphql/hasura/queries/user-valid-social-verifications-by-service.generated';

import { getFirstValue, isAllTrue } from 'utils/helpers';

import { isQueryEnabled } from '../shared';

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export function useSocialVerificationByService(
  variables: UserSocialVerificationsByServiceVariables,
  options?: UseQueryOptions<
    UserSocialVerificationsByService,
    Error,
    UserSocialVerificationsByService['socialVerifications'][0]
  >
) {
  return useUserSocialVerificationsByService(variables, {
    ...options,
    select: (res) => getFirstValue(res.socialVerifications),
    enabled: isAllTrue([...Object.values(variables), isQueryEnabled(options)]),
  });
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export function useValidSocialVerificationByService(
  variables: UserValidSocialVerificationsByServiceVariables,
  options?: UseQueryOptions<
    UserValidSocialVerificationsByService,
    Error,
    UserValidSocialVerificationsByService['socialVerifications'][0]
  >
) {
  return useUserValidSocialVerificationsByService(variables, {
    ...options,
    select: (res) => getFirstValue(res.socialVerifications),
    enabled: isAllTrue([...Object.values(variables), isQueryEnabled(options)]),
  });
}
