import * as Types from '../types-hasura.generated';

import { SocialVerificationFragment } from '../hasura-fragments.generated';
import { useQuery, UseQueryOptions } from 'react-query';
import { hasuraFetcher } from 'lib/clients/graphql';
export type UserSocialVerificationsByServiceVariables = Types.Exact<{
  publicKey: Types.Scalars['String'];
  service: Types.Scalars['social_verification_service_enum'];
}>;


export type UserSocialVerificationsByService = { socialVerifications: Array<SocialVerificationFragment> };


export const UserSocialVerificationsByServiceDocument = /*#__PURE__*/ `
    query UserSocialVerificationsByService($publicKey: String!, $service: social_verification_service_enum!) {
  socialVerifications: social_verification(
    where: {user: {_eq: $publicKey}, service: {_eq: $service}}
    limit: 1
    order_by: {createdAt: desc}
  ) {
    ...SocialVerificationFragment
  }
}
    ${SocialVerificationFragment}`;
export const useUserSocialVerificationsByService = <
      TData = UserSocialVerificationsByService,
      TError = Error
    >(
      variables: UserSocialVerificationsByServiceVariables, 
      options?: UseQueryOptions<UserSocialVerificationsByService, TError, TData>
    ) => 
    useQuery<UserSocialVerificationsByService, TError, TData>(
      ['UserSocialVerificationsByService', variables],
      hasuraFetcher<UserSocialVerificationsByService, UserSocialVerificationsByServiceVariables>(UserSocialVerificationsByServiceDocument, variables),
      options
    );
useUserSocialVerificationsByService.getKey = (variables: UserSocialVerificationsByServiceVariables) => ['UserSocialVerificationsByService', variables];
