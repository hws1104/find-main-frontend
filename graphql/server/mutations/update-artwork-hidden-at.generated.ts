import * as Types from '../types-server.generated';

import { ArtworkFragment } from '../server-fragments.generated';
import { useMutation, UseMutationOptions } from 'react-query';
import { useServerFetcher } from 'lib/clients/graphql';
export type UpdateArtworkHiddenAtVariables = Types.Exact<{
  hidden: Types.Scalars['Boolean'];
  id: Types.Scalars['String'];
}>;


export type UpdateArtworkHiddenAt = { updateArtworkHiddenAt: ArtworkFragment };


export const UpdateArtworkHiddenAtDocument = /*#__PURE__*/ `
    mutation UpdateArtworkHiddenAt($hidden: Boolean!, $id: String!) {
  updateArtworkHiddenAt(hidden: $hidden, id: $id) {
    ...ArtworkFragment
  }
}
    ${ArtworkFragment}`;
export const useUpdateArtworkHiddenAt = <
      TError = Error,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateArtworkHiddenAt, TError, UpdateArtworkHiddenAtVariables, TContext>) => 
    useMutation<UpdateArtworkHiddenAt, TError, UpdateArtworkHiddenAtVariables, TContext>(
      useServerFetcher<UpdateArtworkHiddenAt, UpdateArtworkHiddenAtVariables>(UpdateArtworkHiddenAtDocument),
      options
    );