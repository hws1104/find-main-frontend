import { styled } from 'stitches.config';
import { ReactNode } from 'react';
import { all, length, pick } from 'ramda';

import SearchHitArtwork from './SearchHitArtwork';
import SearchHitUser from './SearchHitUser';
import SearchResultsGrid from 'components/search/SearchResultsGrid';
import SearchResultsV2 from './search-result/SearchResultsV2';
import SearchTags from './SearchTags';
import Box from 'components/base/Box';
import Flex from 'components/base/Flex';
import SpinnerStroked from 'components/SpinnerStroked';
import SearchEmptyState, { EmptyStateContainer } from './SearchEmptyState';

import { isAllTrue, notEmptyOrNil } from 'utils/helpers';

import { AlgoliaArtwork, AlgoliaCollection, AlgoliaUser } from 'types/Algolia';

import { AlgoliaSearch } from 'hooks/queries/algolia/use-algolia-search';

import useSegmentEvent from 'hooks/use-segment-event';
import SearchHitCollection from './SearchHitCollection';

export const SearchPane = styled(Box, {
  position: 'absolute',
  left: 0,
  top: '$4',
  width: 'calc(100vw - 48px)',
  zIndex: 1000,
  '@bp1': {
    width: '100%',
  },
});

type SearchEvent = {
  numTotalResults: number;
  numSearchResults: number;
  searchInput: string;
  selectedResultType: 'collection' | 'user' | 'artwork';
  selectedResult: Record<string, unknown>;
};

interface SearchBarResultsProps {
  currentValue: string;
  tags: string[];
  searchData: AlgoliaSearch;
  isLoading: boolean;
}

export default function SearchBarResults(
  props: SearchBarResultsProps
): JSX.Element {
  const { currentValue, tags, searchData, isLoading } = props;

  const tagResults = tags.filter((tag: string) =>
    tag.includes(currentValue.toLowerCase())
  );

  const [sendSegmentEvent] = useSegmentEvent<SearchEvent>();

  const hasTagsResults = notEmptyOrNil(tagResults);

  const shouldShowTags = isAllTrue([
    hasTagsResults,
    notEmptyOrNil(currentValue),
  ]);

  const hasResults = notEmptyOrNil(searchData?.results);

  if (isLoading) {
    return (
      <SearchBoxContainer>
        <Flex css={{ minHeight: 360 }} center>
          <SpinnerStroked size={32} />
        </Flex>
      </SearchBoxContainer>
    );
  }

  const noResultsFound = all(
    (result) => result.nbHits === 0,
    searchData.results
  );

  if (noResultsFound) {
    return (
      <SearchBoxContainer>
        <EmptyStateContainer>
          <SearchEmptyState
            heading="No search results"
            description={`There are no search results for ‘${currentValue}’`}
            headingSize="$4"
          />
        </EmptyStateContainer>
      </SearchBoxContainer>
    );
  }

  const results = {
    collections: searchData.results[0],
    users: searchData.results[1],
    artworks: searchData.results[2],
  };

  return (
    <SearchBoxContainer>
      {hasResults && (
        <>
          <SearchResultsV2<AlgoliaCollection>
            title="Collections"
            results={results.collections}
            currentValue={currentValue}
            component={SearchHitCollection}
            onClick={(collection) =>
              sendSegmentEvent({
                eventName: 'global_search',
                payload: {
                  numTotalResults: results.collections.nbHits,
                  numSearchResults: length(results.collections.hits),
                  searchInput: currentValue,
                  selectedResultType: 'collection',
                  selectedResult: pick(
                    ['symbol', 'contractAddress', 'name'],
                    collection
                  ),
                },
              })
            }
          />
          <SearchResultsV2<AlgoliaUser>
            title="Profiles"
            results={results.users}
            currentValue={currentValue}
            component={SearchHitUser}
            onClick={(user) =>
              sendSegmentEvent({
                eventName: 'global_search',
                payload: {
                  numTotalResults: results.users.nbHits,
                  numSearchResults: length(results.users.hits),
                  searchInput: currentValue,
                  selectedResultType: 'user',
                  selectedResult: pick(['publicKey', 'username', 'name'], user),
                },
              })
            }
          />
          <SearchResultsV2<AlgoliaArtwork>
            title="Artworks"
            results={results.artworks}
            currentValue={currentValue}
            component={SearchHitArtwork}
            onClick={(artwork) =>
              sendSegmentEvent({
                eventName: 'global_search',
                payload: {
                  numTotalResults: results.artworks.nbHits,
                  numSearchResults: length(results.artworks.hits),
                  searchInput: currentValue,
                  selectedResultType: 'artwork',
                  selectedResult: pick(
                    ['name', 'tokenId', 'contractAddress'],
                    artwork
                  ),
                },
              })
            }
          />
        </>
      )}

      {shouldShowTags && <SearchTags tags={tagResults} />}
    </SearchBoxContainer>
  );
}

interface SearchBoxContainerProps {
  children: ReactNode;
}

export function SearchBoxContainer(props: SearchBoxContainerProps) {
  const { children } = props;
  return (
    <SearchPane>
      <SearchResultsGrid>{children}</SearchResultsGrid>
    </SearchPane>
  );
}
