import * as Types from '../types-hasura.generated';

import { useQuery, UseQueryOptions } from 'react-query';
import { hasuraFetcher } from 'lib/clients/graphql';
export type UserFollowersVariables = Types.Exact<{
  publicKey: Types.Scalars['String'];
  currentUserPublicKey: Types.Scalars['String'];
  offset: Types.Scalars['Int'];
  limit: Types.Scalars['Int'];
}>;


export type UserFollowers = { user?: Types.Maybe<{ follows: Array<(
      Pick<Types.Follow, 'id'>
      & { user: (
        Pick<Types.User, 'name' | 'username' | 'profileImageUrl' | 'userIndex' | 'publicKey'>
        & { isFollowingUser: { aggregate?: Types.Maybe<Pick<Types.Follow_Aggregate_Fields, 'count'>> } }
      ) }
    )> }> };


export const UserFollowersDocument = /*#__PURE__*/ `
    query UserFollowers($publicKey: String!, $currentUserPublicKey: String!, $offset: Int!, $limit: Int!) {
  user: user_by_pk(publicKey: $publicKey) {
    follows(where: {isFollowing: {_eq: true}}, offset: $offset, limit: $limit) {
      id
      user: userByFollowingUser {
        name
        username
        profileImageUrl
        userIndex
        publicKey
        isFollowingUser: follows_aggregate(
          where: {user: {_eq: $currentUserPublicKey}, isFollowing: {_eq: true}}
        ) {
          aggregate {
            count
          }
        }
      }
    }
  }
}
    `;
export const useUserFollowers = <
      TData = UserFollowers,
      TError = Error
    >(
      variables: UserFollowersVariables, 
      options?: UseQueryOptions<UserFollowers, TError, TData>
    ) => 
    useQuery<UserFollowers, TError, TData>(
      ['UserFollowers', variables],
      hasuraFetcher<UserFollowers, UserFollowersVariables>(UserFollowersDocument, variables),
      options
    );
useUserFollowers.getKey = (variables: UserFollowersVariables) => ['UserFollowers', variables];
