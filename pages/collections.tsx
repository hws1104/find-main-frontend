import { InfiniteData } from 'react-query';
import { cond } from 'ramda';
import { GetStaticPropsResult } from 'next';
import { SearchOptions } from '@algolia/client-search';

import Page from 'components/Page';
import CardGrid from 'components/CardGrid';
import CollectionCard from 'components/cards/collections/CollectionCard';
import CollectionIndexSelect from 'components/search/collections/CollectionIndexSelect';
import InfiniteScrollButton from 'components/feed/InfiniteScrollButton';
import SearchPageBody from 'components/search/SearchPageBody';
import BrowseHeaderTabs, {
  BrowseHeaderContainer,
} from 'components/search/algolia/BrowseHeaderTabs';

import useAlgoliaCollections, {
  AlgoliaCollectionSearch,
  useAlgoliaCollectionsVariables,
} from 'hooks/queries/algolia/use-algolia-collections';
import {
  buildAlgoliaSearchQuery,
  AlgoliaSearch,
} from 'hooks/queries/algolia/use-algolia-search';
import {
  defaultSearchIndexes,
  getAlgoliaMultipleSearchResults,
  getAlgoliaSearchResults,
} from 'hooks/queries/algolia/shared';
import { AlgoliaCollection } from 'types/Algolia';

import { FND_CONTRACT_SLUG, PUBLIC_FEED_PER_PAGE_COUNT } from 'lib/constants';

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function Collections(props: PageProps) {
  const { collections, globalSearchData } = props;

  const { data: algoliaCollectionsVariables } = useAlgoliaCollectionsVariables({
    initialData: {
      searchIndex: defaultSearchIndexes.collections,
      searchTerm: '',
    },
  });

  const {
    data: collectionsData,
    hasNextPage,
    isFetching,
    fetchNextPage,
  } = useAlgoliaCollections(
    {
      searchIndex: algoliaCollectionsVariables.searchIndex,
      searchTerm: '',
      options: defaultQueryOptions,
    },
    { initialData: { pages: [collections], pageParams: [0] } }
  );

  return (
    <Page title="Collections">
      <SearchPageBody
        css={{
          paddingBottom: '$7',
          '@bp1': {
            paddingBottom: '$9',
          },
        }}
      >
        <BrowseHeaderContainer
          css={{
            '@bp1-max': {
              gap: 0,
              boxShadow: 'none',
            },
          }}
        >
          <BrowseHeaderTabs placeholderData={globalSearchData} />
          <CollectionIndexSelect />
        </BrowseHeaderContainer>

        {cond([
          [
            (data) => Boolean(data),
            () => <CollectionResults results={collectionsData} />,
          ],
        ])(collectionsData)}

        <InfiniteScrollButton
          handleNextPage={fetchNextPage}
          isFetching={isFetching}
          hasNextPage={hasNextPage}
        />
      </SearchPageBody>
    </Page>
  );
}

interface CollectionResultsProps {
  results: InfiniteData<AlgoliaCollectionSearch>;
}

function CollectionResults(props: CollectionResultsProps) {
  const { results } = props;

  const collections = results.pages.flatMap((page) => page.hits);

  return (
    <CardGrid>
      {collections.map((collection) => (
        <CollectionCard
          key={collection.objectID}
          creator={collection.creator}
          collection={{
            name: collection.name,
            symbol: collection.symbol,
            slug: collection.slug,
            contractAddress: collection.contractAddress,
            coverImageUrl: collection.coverImageUrl,
            collectionImageUrl: collection.collectionImageUrl,
          }}
          artworkCount={collection.artworkCount}
        />
      ))}
    </CardGrid>
  );
}

type PageProps = {
  collections: AlgoliaCollectionSearch;
  globalSearchData: AlgoliaSearch;
};

export async function getStaticProps(): Promise<
  GetStaticPropsResult<PageProps>
> {
  return {
    props: {
      globalSearchData: await getAlgoliaMultipleSearchResults(
        buildAlgoliaSearchQuery('')
      ),
      collections: await getAlgoliaSearchResults<AlgoliaCollection>({
        index: defaultSearchIndexes.collections,
        query: '',
        options: {
          ...defaultQueryOptions,
          page: 0,
          hitsPerPage: PUBLIC_FEED_PER_PAGE_COUNT,
        },
      }),
    },
    // revalidate every 2 mins
    revalidate: 120,
  };
}

const defaultQueryOptions: SearchOptions = {
  distinct: true,
  // ignore the FND contract from the query
  facetFilters: [
    `slug:-${FND_CONTRACT_SLUG}`,
    'isHidden:false',
    'collectionImageUrl:-false',
    'coverImageUrl:-false',
  ],
};
