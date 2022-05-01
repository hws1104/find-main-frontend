import * as Types from '../types-server.generated';

import { FollowFragment } from '../server-fragments.generated';
import { useMutation, UseMutationOptions } from 'react-query';
import { useServerFetcher } from 'lib/clients/graphql';
export type CreateFollowVariables = Types.Exact<{
  publicKey: Types.Scalars['String'];
}>;


export type CreateFollow = { createFollow: FollowFragment };


export const CreateFollowDocument = /*#__PURE__*/ `
    mutation CreateFollow($publicKey: String!) {
  createFollow(followingPublicKey: $publicKey) {
    ...FollowFragment
  }
}
    ${FollowFragment}`;
export const useCreateFollow = <
      TError = Error,
      TContext = unknown
    >(options?: UseMutationOptions<CreateFollow, TError, CreateFollowVariables, TContext>) => 
    useMutation<CreateFollow, TError, CreateFollowVariables, TContext>(
      useServerFetcher<CreateFollow, CreateFollowVariables>(CreateFollowDocument),
      options
    );