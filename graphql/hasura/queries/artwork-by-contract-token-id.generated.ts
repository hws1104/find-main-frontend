import * as Types from '../types-hasura.generated';

import { ArtworkFragmentExtended } from '../hasura-fragments.generated';
import { useQuery, UseQueryOptions } from 'react-query';
import { hasuraFetcher } from 'lib/clients/graphql';
export type ArtworkByContractTokenIdVariables = Types.Exact<{
  contractSlug: Types.Scalars['citext'];
  tokenId: Types.Scalars['Int'];
}>;


export type ArtworkByContractTokenId = { artworks: Array<ArtworkFragmentExtended> };


export const ArtworkByContractTokenIdDocument = /*#__PURE__*/ `
    query ArtworkByContractTokenId($contractSlug: citext!, $tokenId: Int!) {
  artworks: artwork(
    where: {tokenId: {_eq: $tokenId}, collection: {slug: {_eq: $contractSlug}}}
  ) {
    ...ArtworkFragmentExtended
  }
}
    ${ArtworkFragmentExtended}`;
export const useArtworkByContractTokenId = <
      TData = ArtworkByContractTokenId,
      TError = Error
    >(
      variables: ArtworkByContractTokenIdVariables, 
      options?: UseQueryOptions<ArtworkByContractTokenId, TError, TData>
    ) => 
    useQuery<ArtworkByContractTokenId, TError, TData>(
      ['ArtworkByContractTokenId', variables],
      hasuraFetcher<ArtworkByContractTokenId, ArtworkByContractTokenIdVariables>(ArtworkByContractTokenIdDocument, variables),
      options
    );
useArtworkByContractTokenId.getKey = (variables: ArtworkByContractTokenIdVariables) => ['ArtworkByContractTokenId', variables];
