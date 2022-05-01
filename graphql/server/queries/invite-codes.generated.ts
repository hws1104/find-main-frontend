import * as Types from '../types-server.generated';

import { InviteCodeFragment } from '../server-fragments.generated';
import { useQuery, UseQueryOptions } from 'react-query';
import { useServerFetcher } from 'lib/clients/graphql';
export type InviteCodesVariables = Types.Exact<{ [key: string]: never; }>;


export type InviteCodes = { myInviteCodes: Array<InviteCodeFragment> };


export const InviteCodesDocument = /*#__PURE__*/ `
    query InviteCodes {
  myInviteCodes {
    ...InviteCodeFragment
  }
}
    ${InviteCodeFragment}`;
export const useInviteCodes = <
      TData = InviteCodes,
      TError = Error
    >(
      variables?: InviteCodesVariables, 
      options?: UseQueryOptions<InviteCodes, TError, TData>
    ) => 
    useQuery<InviteCodes, TError, TData>(
      ['InviteCodes', variables],
      useServerFetcher<InviteCodes, InviteCodesVariables>(InviteCodesDocument).bind(null, variables),
      options
    );
useInviteCodes.getKey = (variables?: InviteCodesVariables) => ['InviteCodes', variables];
