import * as Types from '../types-hasura.generated';

import { ArtworkFragmentExtended } from '../hasura-fragments.generated';
import { useQuery, UseQueryOptions } from 'react-query';
import { hasuraFetcher } from 'lib/clients/graphql';
export type ArtworksByTokenIdsVariables = Types.Exact<{
  tokenIds: Array<Types.Scalars['Int']> | Types.Scalars['Int'];
  contractAddress: Types.Scalars['String'];
}>;


export type ArtworksByTokenIds = { artworks: Array<ArtworkFragmentExtended> };


export const ArtworksByTokenIdsDocument = /*#__PURE__*/ `
    query ArtworksByTokenIds($tokenIds: [Int!]!, $contractAddress: String!) {
  artworks: artwork(
    where: {contractAddress: {_eq: $contractAddress}, tokenId: {_in: $tokenIds}, isIndexed: {_eq: true}}
  ) {
    ...ArtworkFragmentExtended
  }
}
    ${ArtworkFragmentExtended}`;
export const useArtworksByTokenIds = <
      TData = ArtworksByTokenIds,
      TError = Error
    >(
      variables: ArtworksByTokenIdsVariables, 
      options?: UseQueryOptions<ArtworksByTokenIds, TError, TData>
    ) => 
    useQuery<ArtworksByTokenIds, TError, TData>(
      ['ArtworksByTokenIds', variables],
      hasuraFetcher<ArtworksByTokenIds, ArtworksByTokenIdsVariables>(ArtworksByTokenIdsDocument, variables),
      options
    );
useArtworksByTokenIds.getKey = (variables: ArtworksByTokenIdsVariables) => ['ArtworksByTokenIds', variables];
