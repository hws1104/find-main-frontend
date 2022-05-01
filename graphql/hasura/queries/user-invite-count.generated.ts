import * as Types from '../types-hasura.generated';

import { useQuery, UseQueryOptions } from 'react-query';
import { hasuraFetcher } from 'lib/clients/graphql';
export type UserInviteCountVariables = Types.Exact<{
  publicKey: Types.Scalars['String'];
}>;


export type UserInviteCount = { inviteCount: { aggregate?: Types.Maybe<Pick<Types.Invite_Code_Aggregate_Fields, 'count'>> }, inviteRemainingCount: { aggregate?: Types.Maybe<Pick<Types.Invite_Code_Aggregate_Fields, 'count'>> } };


export const UserInviteCountDocument = /*#__PURE__*/ `
    query UserInviteCount($publicKey: String!) {
  inviteCount: invite_code_aggregate(where: {senderPublicKey: {_eq: $publicKey}}) {
    aggregate {
      count
    }
  }
  inviteRemainingCount: invite_code_aggregate(
    where: {senderPublicKey: {_eq: $publicKey}, redeemedAt: {_is_null: true}}
  ) {
    aggregate {
      count
    }
  }
}
    `;
export const useUserInviteCount = <
      TData = UserInviteCount,
      TError = Error
    >(
      variables: UserInviteCountVariables, 
      options?: UseQueryOptions<UserInviteCount, TError, TData>
    ) => 
    useQuery<UserInviteCount, TError, TData>(
      ['UserInviteCount', variables],
      hasuraFetcher<UserInviteCount, UserInviteCountVariables>(UserInviteCountDocument, variables),
      options
    );
useUserInviteCount.getKey = (variables: UserInviteCountVariables) => ['UserInviteCount', variables];
