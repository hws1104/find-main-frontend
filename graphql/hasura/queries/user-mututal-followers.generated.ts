import * as Types from '../types-hasura.generated';

import { useQuery, UseQueryOptions } from 'react-query';
import { hasuraFetcher } from 'lib/clients/graphql';
export type UserMutualFollowsVariables = Types.Exact<{
  publicKey: Types.Scalars['String'];
  currentUserPublicKey: Types.Scalars['String'];
  offset: Types.Scalars['Int'];
  limit: Types.Scalars['Int'];
}>;


export type UserMutualFollows = { user?: Types.Maybe<{ mutualFollows: Array<(
      Pick<Types.Follow, 'id'>
      & { user: Pick<Types.User, 'name' | 'username' | 'profileImageUrl' | 'userIndex' | 'publicKey'> }
    )>, follows: Array<(
      Pick<Types.Follow, 'id'>
      & { user: Pick<Types.User, 'name' | 'username' | 'profileImageUrl' | 'userIndex' | 'publicKey'> }
    )> }> };


export const UserMutualFollowsDocument = /*#__PURE__*/ `
    query UserMutualFollows($publicKey: String!, $currentUserPublicKey: String!, $offset: Int!, $limit: Int!) {
  user: user_by_pk(publicKey: $publicKey) {
    mutualFollows: follows(
      where: {userByFollowingUser: {follows: {user: {_eq: $currentUserPublicKey}, isFollowing: {_eq: true}}}}
      offset: $offset
      limit: $limit
    ) {
      id
      user: userByFollowingUser {
        name
        username
        profileImageUrl
        userIndex
        publicKey
      }
    }
    follows(where: {isFollowing: {_eq: true}}, offset: $offset, limit: $limit) {
      id
      user: userByFollowingUser {
        name
        username
        profileImageUrl
        userIndex
        publicKey
      }
    }
  }
}
    `;
export const useUserMutualFollows = <
      TData = UserMutualFollows,
      TError = Error
    >(
      variables: UserMutualFollowsVariables, 
      options?: UseQueryOptions<UserMutualFollows, TError, TData>
    ) => 
    useQuery<UserMutualFollows, TError, TData>(
      ['UserMutualFollows', variables],
      hasuraFetcher<UserMutualFollows, UserMutualFollowsVariables>(UserMutualFollowsDocument, variables),
      options
    );
useUserMutualFollows.getKey = (variables: UserMutualFollowsVariables) => ['UserMutualFollows', variables];
