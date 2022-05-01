import * as Types from '../types-server.generated';

import { ArtworkFragmentPrivate } from '../server-fragments.generated';
import { useMutation, UseMutationOptions } from 'react-query';
import { useServerFetcher } from 'lib/clients/graphql';
export type SetDraftArtworkToMintingVariables = Types.Exact<{
  id: Types.Scalars['String'];
  mintTxHash: Types.Scalars['String'];
}>;


export type SetDraftArtworkToMinting = { setDraftArtworkToMinting: ArtworkFragmentPrivate };


export const SetDraftArtworkToMintingDocument = /*#__PURE__*/ `
    mutation SetDraftArtworkToMinting($id: String!, $mintTxHash: String!) {
  setDraftArtworkToMinting(id: $id, mintTxHash: $mintTxHash) {
    ...ArtworkFragmentPrivate
  }
}
    ${ArtworkFragmentPrivate}`;
export const useSetDraftArtworkToMinting = <
      TError = Error,
      TContext = unknown
    >(options?: UseMutationOptions<SetDraftArtworkToMinting, TError, SetDraftArtworkToMintingVariables, TContext>) => 
    useMutation<SetDraftArtworkToMinting, TError, SetDraftArtworkToMintingVariables, TContext>(
      useServerFetcher<SetDraftArtworkToMinting, SetDraftArtworkToMintingVariables>(SetDraftArtworkToMintingDocument),
      options
    );