import { CollectionFragment } from 'graphql/hasura/hasura-fragments.generated';
import { getNFT721Address } from 'lib/addresses';
import { areKeysEqual } from './users';

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export function buildCollectionPath(
  collection: Pick<CollectionFragment, 'slug' | 'contractAddress'>
) {
  return `/collection/${collection?.slug ?? collection?.contractAddress}`;
}

export const isFNDContractAddress = (contractAddress: string) =>
  areKeysEqual([contractAddress, getNFT721Address()]);
