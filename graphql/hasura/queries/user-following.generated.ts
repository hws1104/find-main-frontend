import * as Types from '../types-hasura.generated';

import { useQuery, UseQueryOptions } from 'react-query';
import { hasuraFetcher } from 'lib/clients/graphql';
export type UserFollowingVariables = Types.Exact<{
  publicKey: Types.Scalars['String'];
  currentUserPublicKey: Types.Scalars['String'];
  offset: Types.Scalars['Int'];
  limit: Types.Scalars['Int'];
}>;


export type UserFollowing = { user?: Types.Maybe<{ following: Array<(
      Pick<Types.Follow, 'id'>
      & { user: (
        Pick<Types.User, 'name' | 'username' | 'profileImageUrl' | 'userIndex' | 'publicKey'>
        & { isFollowingUser: { aggregate?: Types.Maybe<Pick<Types.Follow_Aggregate_Fields, 'count'>> } }
      ) }
    )> }> };


export const UserFollowingDocument = /*#__PURE__*/ `
    query UserFollowing($publicKey: String!, $currentUserPublicKey: String!, $offset: Int!, $limit: Int!) {
  user: user_by_pk(publicKey: $publicKey) {
    following(where: {isFollowing: {_eq: true}}, offset: $offset, limit: $limit) {
      id
      user: userByFollowedUser {
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
export const useUserFollowing = <
      TData = UserFollowing,
      TError = Error
    >(
      variables: UserFollowingVariables, 
      options?: UseQueryOptions<UserFollowing, TError, TData>
    ) => 
    useQuery<UserFollowing, TError, TData>(
      ['UserFollowing', variables],
      hasuraFetcher<UserFollowing, UserFollowingVariables>(UserFollowingDocument, variables),
      options
    );
useUserFollowing.getKey = (variables: UserFollowingVariables) => ['UserFollowing', variables];
