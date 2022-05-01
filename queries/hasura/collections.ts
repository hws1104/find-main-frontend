import {
  CollectionByContractAddress,
  CollectionByContractAddressDocument,
  CollectionByContractAddressVariables,
} from 'graphql/hasura/queries/collection-by-contract-address.generated';

import {
  CollectionByContractSlugDocument,
  CollectionByContractSlug,
  CollectionByContractSlugVariables,
} from 'graphql/hasura/queries/collection-by-contract-slug.generated';

import {
  CollectionStats,
  CollectionStatsDocument,
  CollectionStatsVariables,
} from 'graphql/hasura/queries/collection-stats.generated';
import {
  CollectionUniqueness,
  CollectionUniquenessDocument,
  CollectionUniquenessVariables,
} from 'graphql/hasura/queries/collection-uniqueness.generated';

import {
  CollectionsBySlugs,
  CollectionsBySlugsDocument,
  CollectionsBySlugsVariables,
} from 'graphql/hasura/queries/collections-by-slugs.generated';

import {
  CollectionsVariables,
  CollectionsDocument,
  Collections,
} from 'graphql/hasura/queries/collections.generated';

import { fndHasuraClient } from 'lib/clients/graphql';
import { getFirstValue } from 'utils/helpers';

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export async function getCollectionByContractSlug(
  variables: CollectionByContractSlugVariables
) {
  const client = fndHasuraClient();
  const query = await client.request<
    CollectionByContractSlug,
    CollectionByContractSlugVariables
  >(CollectionByContractSlugDocument, variables);
  return getFirstValue(query.collections);
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export async function getCollectionByContractAddress(
  variables: CollectionByContractAddressVariables
) {
  const client = fndHasuraClient();
  const query = await client.request<
    CollectionByContractAddress,
    CollectionByContractAddressVariables
  >(CollectionByContractAddressDocument, variables);
  return getFirstValue(query.collections);
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export async function getCollectionStats(variables: CollectionStatsVariables) {
  const client = fndHasuraClient();
  return await client.request<CollectionStats, CollectionStatsVariables>(
    CollectionStatsDocument,
    variables
  );
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export async function getCollections(
  variables: Omit<CollectionsVariables, 'excludeSlugs'>
) {
  const client = fndHasuraClient();
  const query = await client.request<Collections, CollectionsVariables>(
    CollectionsDocument,
    { ...variables, excludeSlugs: ['~'] }
  );
  return query.collections;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export async function getCollectionsBySlugs(
  variables: CollectionsBySlugsVariables
) {
  const client = fndHasuraClient();
  const query = await client.request<
    CollectionsBySlugs,
    CollectionsBySlugsVariables
  >(CollectionsBySlugsDocument, variables);
  return query.collections;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export async function getUniqueCollectionByContractSlug(
  variables: CollectionUniquenessVariables
) {
  const client = fndHasuraClient();
  const query = await client.request<
    CollectionUniqueness,
    CollectionUniquenessVariables
  >(CollectionUniquenessDocument, variables);
  return getFirstValue(query.collections);
}
