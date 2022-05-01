import * as Types from '../types-hasura.generated';

import { useQuery, UseQueryOptions } from 'react-query';
import { hasuraFetcher } from 'lib/clients/graphql';
export type UserFollowStateVariables = Types.Exact<{
  currentUserPublicKey: Types.Scalars['String'];
  publicKey: Types.Scalars['String'];
}>;


export type UserFollowState = { user?: Types.Maybe<{ followerCount: { aggregate?: Types.Maybe<Pick<Types.Follow_Aggregate_Fields, 'count'>> }, followingCount: { aggregate?: Types.Maybe<Pick<Types.Follow_Aggregate_Fields, 'count'>> }, isFollowingUser: { aggregate?: Types.Maybe<Pick<Types.Follow_Aggregate_Fields, 'count'>> } }> };


export const UserFollowStateDocument = /*#__PURE__*/ `
    query UserFollowState($currentUserPublicKey: String!, $publicKey: String!) {
  user: user_by_pk(publicKey: $publicKey) {
    followerCount: follows_aggregate(where: {isFollowing: {_eq: true}}) {
      aggregate {
        count
      }
    }
    followingCount: following_aggregate(where: {isFollowing: {_eq: true}}) {
      aggregate {
        count
      }
    }
    isFollowingUser: follows_aggregate(
      where: {user: {_eq: $currentUserPublicKey}, isFollowing: {_eq: true}}
    ) {
      aggregate {
        count
      }
    }
  }
}
    `;
export const useUserFollowState = <
      TData = UserFollowState,
      TError = Error
    >(
      variables: UserFollowStateVariables, 
      options?: UseQueryOptions<UserFollowState, TError, TData>
    ) => 
    useQuery<UserFollowState, TError, TData>(
      ['UserFollowState', variables],
      hasuraFetcher<UserFollowState, UserFollowStateVariables>(UserFollowStateDocument, variables),
      options
    );
useUserFollowState.getKey = (variables: UserFollowStateVariables) => ['UserFollowState', variables];
