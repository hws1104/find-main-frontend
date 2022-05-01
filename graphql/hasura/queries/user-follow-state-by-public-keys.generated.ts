import * as Types from '../types-hasura.generated';

import { useQuery, UseQueryOptions } from 'react-query';
import { hasuraFetcher } from 'lib/clients/graphql';
export type UserFollowStateByPublicKeysVariables = Types.Exact<{
  publicKeys: Array<Types.Scalars['String']> | Types.Scalars['String'];
  currentUserPublicKey: Types.Scalars['String'];
}>;


export type UserFollowStateByPublicKeys = { users: Array<(
    Pick<Types.User, 'publicKey'>
    & { followerCount: { aggregate?: Types.Maybe<Pick<Types.Follow_Aggregate_Fields, 'count'>> }, follows: Array<Pick<Types.Follow, 'createdAt' | 'isFollowing'>> }
  )> };


export const UserFollowStateByPublicKeysDocument = /*#__PURE__*/ `
    query UserFollowStateByPublicKeys($publicKeys: [String!]!, $currentUserPublicKey: String!) {
  users: user(where: {publicKey: {_in: $publicKeys}}) {
    publicKey
    followerCount: follows_aggregate(where: {isFollowing: {_eq: true}}) {
      aggregate {
        count
      }
    }
    follows(where: {user: {_eq: $currentUserPublicKey}, isFollowing: {_eq: true}}) {
      createdAt
      isFollowing
    }
  }
}
    `;
export const useUserFollowStateByPublicKeys = <
      TData = UserFollowStateByPublicKeys,
      TError = Error
    >(
      variables: UserFollowStateByPublicKeysVariables, 
      options?: UseQueryOptions<UserFollowStateByPublicKeys, TError, TData>
    ) => 
    useQuery<UserFollowStateByPublicKeys, TError, TData>(
      ['UserFollowStateByPublicKeys', variables],
      hasuraFetcher<UserFollowStateByPublicKeys, UserFollowStateByPublicKeysVariables>(UserFollowStateByPublicKeysDocument, variables),
      options
    );
useUserFollowStateByPublicKeys.getKey = (variables: UserFollowStateByPublicKeysVariables) => ['UserFollowStateByPublicKeys', variables];
