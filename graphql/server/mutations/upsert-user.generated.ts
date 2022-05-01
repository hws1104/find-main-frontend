import * as Types from '../types-server.generated';

import { UserFragment } from '../server-fragments.generated';
import { useMutation, UseMutationOptions } from 'react-query';
import { useServerFetcher } from 'lib/clients/graphql';
export type UpsertUserVariables = Types.Exact<{
  data: Types.UserInput;
}>;


export type UpsertUser = { upsertUser: (
    Pick<Types.User, 'email'>
    & UserFragment
  ) };


export const UpsertUserDocument = /*#__PURE__*/ `
    mutation UpsertUser($data: UserInput!) {
  upsertUser(data: $data) {
    ...UserFragment
    email
  }
}
    ${UserFragment}`;
export const useUpsertUser = <
      TError = Error,
      TContext = unknown
    >(options?: UseMutationOptions<UpsertUser, TError, UpsertUserVariables, TContext>) => 
    useMutation<UpsertUser, TError, UpsertUserVariables, TContext>(
      useServerFetcher<UpsertUser, UpsertUserVariables>(UpsertUserDocument),
      options
    );