import { UseQueryOptions } from 'react-query';
import {
  useCollectionByContractSlug as useCollectionByContractSlugBaseHook,
  CollectionByContractSlug,
  CollectionByContractSlugVariables,
} from 'graphql/hasura/queries/collection-by-contract-slug.generated';

import { getFirstValue, isAllTrue } from 'utils/helpers';

type Collection = CollectionByContractSlug['collections'][0];

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function useCollectionByContractSlug(
  variables: CollectionByContractSlugVariables,
  options?: UseQueryOptions<CollectionByContractSlug, Error, Collection>
) {
  const { enabled = true } = options;

  return useCollectionByContractSlugBaseHook(variables, {
    ...options,
    select: (res) => getFirstValue(res.collections),
    enabled: isAllTrue([variables.contractSlug, enabled]),
  });
}

useCollectionByContractSlug.getKey = useCollectionByContractSlugBaseHook.getKey;
