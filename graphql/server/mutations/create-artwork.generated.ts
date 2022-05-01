import * as Types from '../types-server.generated';

import { ArtworkFragment } from '../server-fragments.generated';
import { useMutation, UseMutationOptions } from 'react-query';
import { useServerFetcher } from 'lib/clients/graphql';
export type CreateArtworkVariables = Types.Exact<{
  data: Types.CreateArtworkInput;
}>;


export type CreateArtwork = { createArtwork: ArtworkFragment };


export const CreateArtworkDocument = /*#__PURE__*/ `
    mutation CreateArtwork($data: CreateArtworkInput!) {
  createArtwork(data: $data) {
    ...ArtworkFragment
  }
}
    ${ArtworkFragment}`;
export const useCreateArtwork = <
      TError = Error,
      TContext = unknown
    >(options?: UseMutationOptions<CreateArtwork, TError, CreateArtworkVariables, TContext>) => 
    useMutation<CreateArtwork, TError, CreateArtworkVariables, TContext>(
      useServerFetcher<CreateArtwork, CreateArtworkVariables>(CreateArtworkDocument),
      options
    );