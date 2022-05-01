import * as Types from '../types-hasura.generated';

import { SocialVerificationFragment } from '../hasura-fragments.generated';
import { useQuery, UseQueryOptions } from 'react-query';
import { hasuraFetcher } from 'lib/clients/graphql';
export type UserValidSocialVerificationsByServiceVariables = Types.Exact<{
  publicKey: Types.Scalars['String'];
  service: Types.Scalars['social_verification_service_enum'];
}>;


export type UserValidSocialVerificationsByService = { socialVerifications: Array<SocialVerificationFragment> };


export const UserValidSocialVerificationsByServiceDocument = /*#__PURE__*/ `
    query UserValidSocialVerificationsByService($publicKey: String!, $service: social_verification_service_enum!) {
  socialVerifications: social_verification(
    where: {user: {_eq: $publicKey}, service: {_eq: $service}, isValid: {_eq: true}}
    limit: 1
    order_by: {createdAt: desc}
  ) {
    ...SocialVerificationFragment
  }
}
    ${SocialVerificationFragment}`;
export const useUserValidSocialVerificationsByService = <
      TData = UserValidSocialVerificationsByService,
      TError = Error
    >(
      variables: UserValidSocialVerificationsByServiceVariables, 
      options?: UseQueryOptions<UserValidSocialVerificationsByService, TError, TData>
    ) => 
    useQuery<UserValidSocialVerificationsByService, TError, TData>(
      ['UserValidSocialVerificationsByService', variables],
      hasuraFetcher<UserValidSocialVerificationsByService, UserValidSocialVerificationsByServiceVariables>(UserValidSocialVerificationsByServiceDocument, variables),
      options
    );
useUserValidSocialVerificationsByService.getKey = (variables: UserValidSocialVerificationsByServiceVariables) => ['UserValidSocialVerificationsByService', variables];
