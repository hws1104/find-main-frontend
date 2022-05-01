import * as Types from '../types-hasura.generated';

import { useQuery, UseQueryOptions } from 'react-query';
import { hasuraFetcher } from 'lib/clients/graphql';
export type ArtworksByAssetPathAndCreatorVariables = Types.Exact<{
  assetPath: Types.Scalars['String'];
  publicKey: Types.Scalars['String'];
}>;


export type ArtworksByAssetPathAndCreator = { artworks: Array<Pick<Types.Artwork, 'id' | 'deletedAt'>> };


export const ArtworksByAssetPathAndCreatorDocument = /*#__PURE__*/ `
    query ArtworksByAssetPathAndCreator($assetPath: String!, $publicKey: String!) {
  artworks: artwork(
    where: {publicKey: {_eq: $publicKey}, assetPath: {_eq: $assetPath}, status: {_in: ["MINTED"]}}
  ) {
    id
    deletedAt
  }
}
    `;
export const useArtworksByAssetPathAndCreator = <
      TData = ArtworksByAssetPathAndCreator,
      TError = Error
    >(
      variables: ArtworksByAssetPathAndCreatorVariables, 
      options?: UseQueryOptions<ArtworksByAssetPathAndCreator, TError, TData>
    ) => 
    useQuery<ArtworksByAssetPathAndCreator, TError, TData>(
      ['ArtworksByAssetPathAndCreator', variables],
      hasuraFetcher<ArtworksByAssetPathAndCreator, ArtworksByAssetPathAndCreatorVariables>(ArtworksByAssetPathAndCreatorDocument, variables),
      options
    );
useArtworksByAssetPathAndCreator.getKey = (variables: ArtworksByAssetPathAndCreatorVariables) => ['ArtworksByAssetPathAndCreator', variables];
