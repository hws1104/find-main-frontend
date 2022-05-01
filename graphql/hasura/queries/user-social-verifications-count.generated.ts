import * as Types from '../types-hasura.generated';

import { useQuery, UseQueryOptions } from 'react-query';
import { hasuraFetcher } from 'lib/clients/graphql';
export type UserSocialVerificationsCountVariables = Types.Exact<{
  publicKey: Types.Scalars['String'];
}>;


export type UserSocialVerificationsCount = { socialVerificationsCount: { aggregate?: Types.Maybe<Pick<Types.Social_Verification_Aggregate_Fields, 'count'>> } };


export const UserSocialVerificationsCountDocument = /*#__PURE__*/ `
    query UserSocialVerificationsCount($publicKey: String!) {
  socialVerificationsCount: social_verification_aggregate(
    where: {user: {_eq: $publicKey}, isValid: {_eq: true}}
  ) {
    aggregate {
      count
    }
  }
}
    `;
export const useUserSocialVerificationsCount = <
      TData = UserSocialVerificationsCount,
      TError = Error
    >(
      variables: UserSocialVerificationsCountVariables, 
      options?: UseQueryOptions<UserSocialVerificationsCount, TError, TData>
    ) => 
    useQuery<UserSocialVerificationsCount, TError, TData>(
      ['UserSocialVerificationsCount', variables],
      hasuraFetcher<UserSocialVerificationsCount, UserSocialVerificationsCountVariables>(UserSocialVerificationsCountDocument, variables),
      options
    );
useUserSocialVerificationsCount.getKey = (variables: UserSocialVerificationsCountVariables) => ['UserSocialVerificationsCount', variables];
