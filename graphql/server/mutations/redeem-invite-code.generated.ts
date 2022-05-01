import * as Types from '../types-server.generated';

import { useMutation, UseMutationOptions } from 'react-query';
import { useServerFetcher } from 'lib/clients/graphql';
export type RedeemInviteCodeVariables = Types.Exact<{
  inviteCode: Types.Scalars['String'];
}>;


export type RedeemInviteCode = { redeemInviteCode: Pick<Types.InviteCode, 'redeemedAt' | 'inviteCode'> };


export const RedeemInviteCodeDocument = /*#__PURE__*/ `
    mutation RedeemInviteCode($inviteCode: String!) {
  redeemInviteCode(inviteCode: $inviteCode) {
    redeemedAt
    inviteCode
  }
}
    `;
export const useRedeemInviteCode = <
      TError = Error,
      TContext = unknown
    >(options?: UseMutationOptions<RedeemInviteCode, TError, RedeemInviteCodeVariables, TContext>) => 
    useMutation<RedeemInviteCode, TError, RedeemInviteCodeVariables, TContext>(
      useServerFetcher<RedeemInviteCode, RedeemInviteCodeVariables>(RedeemInviteCodeDocument),
      options
    );