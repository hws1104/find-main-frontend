import * as Types from '../types-hasura.generated';

import { ArtworkFragmentExtended } from '../hasura-fragments.generated';
import { useQuery, UseQueryOptions } from 'react-query';
import { hasuraFetcher } from 'lib/clients/graphql';
export type ArtworksByContractTokenIdsVariables = Types.Exact<{
  tokenIds: Array<Types.Scalars['Int']> | Types.Scalars['Int'];
  contractSlug: Types.Scalars['citext'];
}>;


export type ArtworksByContractTokenIds = { artworks: Array<ArtworkFragmentExtended> };


export const ArtworksByContractTokenIdsDocument = /*#__PURE__*/ `
    query ArtworksByContractTokenIds($tokenIds: [Int!]!, $contractSlug: citext!) @cached(ttl: 300) {
  artworks: artwork(
    where: {collection: {slug: {_eq: $contractSlug}}, tokenId: {_in: $tokenIds}, isIndexed: {_eq: true}}
  ) {
    ...ArtworkFragmentExtended
  }
}
    ${ArtworkFragmentExtended}`;
export const useArtworksByContractTokenIds = <
      TData = ArtworksByContractTokenIds,
      TError = Error
    >(
      variables: ArtworksByContractTokenIdsVariables, 
      options?: UseQueryOptions<ArtworksByContractTokenIds, TError, TData>
    ) => 
    useQuery<ArtworksByContractTokenIds, TError, TData>(
      ['ArtworksByContractTokenIds', variables],
      hasuraFetcher<ArtworksByContractTokenIds, ArtworksByContractTokenIdsVariables>(ArtworksByContractTokenIdsDocument, variables),
      options
    );
useArtworksByContractTokenIds.getKey = (variables: ArtworksByContractTokenIdsVariables) => ['ArtworksByContractTokenIds', variables];
