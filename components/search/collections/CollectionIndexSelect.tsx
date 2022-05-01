import Box from 'components/base/Box';
import Flex from 'components/base/Flex';
import Text from 'components/base/Text';
import SelectField from 'components/forms/fields/SelectField';
import { defaultSearchIndexes } from 'hooks/queries/algolia/shared';

import {
  useAlgoliaCollectionsVariables,
  useUpdateAlgoliaCollectionsVariables,
} from 'hooks/queries/algolia/use-algolia-collections';
import { styled } from 'stitches.config';

import { AlgoliaSearchIndex } from 'types/Algolia';

type CollectionIndex = {
  indexName: string;
  indexValue: AlgoliaSearchIndex;
};

type CollectionIndexSelectValue = {
  label: string;
  value: string;
  id: string;
};

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function CollectionIndexSelect() {
  const { data: algoliaCollectionsVariables } = useAlgoliaCollectionsVariables({
    initialData: {
      searchIndex: defaultSearchIndexes.collections,
      searchTerm: '',
    },
  });

  const updateAlgoliaCollectionsVariables =
    useUpdateAlgoliaCollectionsVariables();

  const collectionIndexes: CollectionIndex[] = [
    {
      indexName: 'Date Minted to: Newest',
      indexValue: 'collections_sort_date_last_minted_to_desc',
    },
    {
      indexName: 'Date Minted to: Oldest',
      indexValue: 'collections_sort_date_last_minted_to_asc',
    },
    {
      indexName: 'Date Created: Newest',
      indexValue: 'collections_sort_date_created_desc',
    },
    {
      indexName: 'Date Created: Oldest',
      indexValue: 'collections_sort_date_created_asc',
    },
  ];

  const mappedIndexes = collectionIndexes.map((index) => ({
    id: index.indexName,
    label: index.indexName,
    value: index.indexValue as string,
  }));

  return (
    <SelectFieldContainer>
      <Box
        css={{
          flex: 1,
          '@bp1-max': {
            maxWidth: 280,
            marginX: 'auto',
          },
        }}
      >
        <SelectField<CollectionIndexSelectValue>
          items={mappedIndexes}
          defaultSelectedItem={mappedIndexes.find(
            (index) => index.value === algoliaCollectionsVariables.searchIndex
          )}
          onSelectedItemChange={(item) => {
            const searchIndex = item.value as AlgoliaSearchIndex;
            updateAlgoliaCollectionsVariables({ searchIndex });
          }}
        />
      </Box>
    </SelectFieldContainer>
  );
}

const SelectFieldContainer = styled(Flex, {
  '@bp1-max': {
    position: 'relative',
    zIndex: 1,
    paddingTop: '$6',
    boxShadow: 'inset 0 1px 0 0 #E6E6E6',
    marginTop: -1,
  },
});
