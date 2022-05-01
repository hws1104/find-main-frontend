import { fndHasuraClient } from 'lib/clients/graphql';

import { getFirstValue } from 'utils/helpers';

import {
  ArtworkByContractTokenIdDocument,
  ArtworkByContractTokenIdVariables,
  ArtworkByContractTokenId,
} from 'graphql/hasura/queries/artwork-by-contract-token-id.generated';

import {
  ArtworksByTokenIdsDocument,
  ArtworksByTokenIdsVariables,
  ArtworksByTokenIds,
} from 'graphql/hasura/queries/artworks-by-token-ids.generated';

import {
  ArtworksByAssetPathAndCreatorVariables,
  ArtworksByAssetPathAndCreatorDocument,
  ArtworksByAssetPathAndCreator,
} from 'graphql/hasura/queries/artworks-by-asset-path-and-creator.generated';
import {
  ArtworksByContractTokenIds,
  ArtworksByContractTokenIdsVariables,
  ArtworksByContractTokenIdsDocument,
} from 'graphql/hasura/queries/artworks-by-contract-token-ids.generated';

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export async function getArtworkByContractTokenId(
  variables: ArtworkByContractTokenIdVariables
) {
  const client = fndHasuraClient();
  const query = await client.request<
    ArtworkByContractTokenId,
    ArtworkByContractTokenIdVariables
  >(ArtworkByContractTokenIdDocument, variables);
  return getFirstValue(query.artworks);
}

export async function getArtworksByTokenIds(
  variables: ArtworksByTokenIdsVariables
) {
  const client = fndHasuraClient();
  const query = await client.request<
    ArtworksByTokenIds,
    ArtworksByTokenIdsVariables
  >(ArtworksByTokenIdsDocument, variables);
  return query.artworks;
}

export async function getArtworksByContractTokenIds(
  variables: ArtworksByContractTokenIdsVariables
) {
  const client = fndHasuraClient();
  const query = await client.request<
    ArtworksByContractTokenIds,
    ArtworksByContractTokenIdsVariables
  >(ArtworksByContractTokenIdsDocument, variables);
  return query.artworks;
}

export async function getArtworkByAssetPathAndCreator(
  variables: ArtworksByAssetPathAndCreatorVariables
) {
  const client = fndHasuraClient();
  const query = await client.request<
    ArtworksByAssetPathAndCreator,
    ArtworksByAssetPathAndCreatorVariables
  >(ArtworksByAssetPathAndCreatorDocument, variables);

  // filter out the delete artworks (burned)
  const nonDeletedArtworks = query.artworks.filter(
    (artwork) => !artwork.deletedAt
  );

  return getFirstValue(nonDeletedArtworks);
}
