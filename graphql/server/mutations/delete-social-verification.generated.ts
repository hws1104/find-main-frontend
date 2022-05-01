import * as Types from '../types-server.generated';

import { useMutation, UseMutationOptions } from 'react-query';
import { useServerFetcher } from 'lib/clients/graphql';
export type DeleteSocialVerificationVariables = Types.Exact<{
  id: Types.Scalars['String'];
}>;


export type DeleteSocialVerification = Pick<Types.Mutation, 'deleteSocialVerification'>;


export const DeleteSocialVerificationDocument = /*#__PURE__*/ `
    mutation DeleteSocialVerification($id: String!) {
  deleteSocialVerification(id: $id)
}
    `;
export const useDeleteSocialVerification = <
      TError = Error,
      TContext = unknown
    >(options?: UseMutationOptions<DeleteSocialVerification, TError, DeleteSocialVerificationVariables, TContext>) => 
    useMutation<DeleteSocialVerification, TError, DeleteSocialVerificationVariables, TContext>(
      useServerFetcher<DeleteSocialVerification, DeleteSocialVerificationVariables>(DeleteSocialVerificationDocument),
      options
    );