import * as Types from '../types-server.generated';

import { useMutation, UseMutationOptions } from 'react-query';
import { useServerFetcher } from 'lib/clients/graphql';
export type CreateSocialVerificationViaUrlVariables = Types.Exact<{
  socialVerificationURL: Types.Scalars['String'];
}>;


export type CreateSocialVerificationViaUrl = { createSocialVerificationViaURL: Pick<Types.SocialVerification, 'socialVerificationURL' | 'createdAt'> };


export const CreateSocialVerificationViaUrlDocument = /*#__PURE__*/ `
    mutation CreateSocialVerificationViaURL($socialVerificationURL: String!) {
  createSocialVerificationViaURL(socialVerificationURL: $socialVerificationURL) {
    socialVerificationURL
    createdAt
  }
}
    `;
export const useCreateSocialVerificationViaUrl = <
      TError = Error,
      TContext = unknown
    >(options?: UseMutationOptions<CreateSocialVerificationViaUrl, TError, CreateSocialVerificationViaUrlVariables, TContext>) => 
    useMutation<CreateSocialVerificationViaUrl, TError, CreateSocialVerificationViaUrlVariables, TContext>(
      useServerFetcher<CreateSocialVerificationViaUrl, CreateSocialVerificationViaUrlVariables>(CreateSocialVerificationViaUrlDocument),
      options
    );