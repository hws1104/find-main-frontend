import * as Types from '../types-server.generated';

import { useMutation, UseMutationOptions } from 'react-query';
import { useServerFetcher } from 'lib/clients/graphql';
export type CreateSocialVerificationInstagramVariables = Types.Exact<{
  code: Types.Scalars['String'];
  redirectURI: Types.Scalars['String'];
}>;


export type CreateSocialVerificationInstagram = Pick<Types.Mutation, 'createSocialVerificationInstagram'>;


export const CreateSocialVerificationInstagramDocument = /*#__PURE__*/ `
    mutation CreateSocialVerificationInstagram($code: String!, $redirectURI: String!) {
  createSocialVerificationInstagram(code: $code, redirectURI: $redirectURI)
}
    `;
export const useCreateSocialVerificationInstagram = <
      TError = Error,
      TContext = unknown
    >(options?: UseMutationOptions<CreateSocialVerificationInstagram, TError, CreateSocialVerificationInstagramVariables, TContext>) => 
    useMutation<CreateSocialVerificationInstagram, TError, CreateSocialVerificationInstagramVariables, TContext>(
      useServerFetcher<CreateSocialVerificationInstagram, CreateSocialVerificationInstagramVariables>(CreateSocialVerificationInstagramDocument),
      options
    );