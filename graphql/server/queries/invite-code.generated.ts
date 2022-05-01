import * as Types from '../types-server.generated';

import { InviteCodeFragment } from '../server-fragments.generated';
import { useQuery, UseQueryOptions } from 'react-query';
import { useServerFetcher } from 'lib/clients/graphql';
export type InviteCodeVariables = Types.Exact<{
  inviteCode: Types.Scalars['String'];
}>;


export type InviteCode = { inviteCode: InviteCodeFragment };


export const InviteCodeDocument = /*#__PURE__*/ `
    query InviteCode($inviteCode: String!) {
  inviteCode(inviteCode: $inviteCode) {
    ...InviteCodeFragment
  }
}
    ${InviteCodeFragment}`;
export const useInviteCode = <
      TData = InviteCode,
      TError = Error
    >(
      variables: InviteCodeVariables, 
      options?: UseQueryOptions<InviteCode, TError, TData>
    ) => 
    useQuery<InviteCode, TError, TData>(
      ['InviteCode', variables],
      useServerFetcher<InviteCode, InviteCodeVariables>(InviteCodeDocument).bind(null, variables),
      options
    );
useInviteCode.getKey = (variables: InviteCodeVariables) => ['InviteCode', variables];
