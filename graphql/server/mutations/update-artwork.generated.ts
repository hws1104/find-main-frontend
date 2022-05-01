import * as Types from '../types-server.generated';

import { ArtworkFragment } from '../server-fragments.generated';
import { useMutation, UseMutationOptions } from 'react-query';
import { useServerFetcher } from 'lib/clients/graphql';
export type UpdateDraftArtworkVariables = Types.Exact<{
  data: Types.UpdateDraftArtworkInput;
}>;


export type UpdateDraftArtwork = { updateDraftArtwork: ArtworkFragment };


export const UpdateDraftArtworkDocument = /*#__PURE__*/ `
    mutation UpdateDraftArtwork($data: UpdateDraftArtworkInput!) {
  updateDraftArtwork(data: $data) {
    ...ArtworkFragment
  }
}
    ${ArtworkFragment}`;
export const useUpdateDraftArtwork = <
      TError = Error,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateDraftArtwork, TError, UpdateDraftArtworkVariables, TContext>) => 
    useMutation<UpdateDraftArtwork, TError, UpdateDraftArtworkVariables, TContext>(
      useServerFetcher<UpdateDraftArtwork, UpdateDraftArtworkVariables>(UpdateDraftArtworkDocument),
      options
    );