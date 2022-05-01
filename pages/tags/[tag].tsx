/* eslint-disable react/jsx-max-depth */
import { useState } from 'react';
import {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import { Configure, InstantSearch } from 'react-instantsearch-dom';

import { styled } from 'stitches.config';

import Page from 'components/Page';
import Grid from 'components/base/Grid';
import Text from 'components/base/Text';

import ArtworkSearchResults, {
  ArtworkSearchResultsContainer,
} from 'components/search/artworks/ArtworkSearchResults';

import SearchFiltersStacked from 'components/search/SearchFiltersStacked';
import SearchNavigationSortBar from 'components/search/algolia/SearchNavigationSortBar';
import SearchNavigationSortOptions from 'components/search/algolia/SearchNavigationSortOptions';
import SearchFiltersToggle from 'components/search/SearchFiltersToggle';
import SearchFiltersContainer from 'components/search/algolia/SearchFiltersContainer';
import SearchContainer from 'components/search/SearchContainer';
import SearchPageBody from 'components/search/SearchPageBody';
import Paragraph from 'components/base/Paragraph';
import Box from 'components/base/Box';
import SearchResultsCount from 'components/search/SearchResultsCount';
import TagSearchFilters from 'components/search/tags/TagSearchFilters';

import searchClient, { algoliaArtworksIndexes } from 'lib/clients/algolia';

import useSearchState from 'state/stores/search';

import { PUBLIC_FEED_PER_PAGE_COUNT } from 'lib/constants';

const TagsHeading = styled(Text, {
  fontSize: '$4',
  fontFamily: '$body',
  fontWeight: 600,
  lineHeight: 1.25,
  letterSpacing: '-0.02em',
  marginBottom: '$7',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  '@bp2': {
    fontSize: '$8',
    marginBottom: '$9',
  },
});

interface TagPageProps {
  tag: string;
}

export default function TagsPage(props: TagPageProps): JSX.Element {
  const { tag } = props;

  const artworkAvailability = useSearchState(
    (state) => state.artworkAvailabilities
  );

  const availableIndexes = algoliaArtworksIndexes.filter((index) =>
    index.enabledModes.some((mode) => artworkAvailability.includes(mode))
  );
  const defaultRefinement = availableIndexes[0].value;

  const [searchOpen, searchSearchOpen] = useState(false);

  const openSearch = () => searchSearchOpen(true);
  const closeSearch = () => searchSearchOpen(false);

  return (
    <Page title={tag} footerStyle={{ display: 'none' }}>
      <InstantSearch searchClient={searchClient} indexName="artworks">
        <Configure
          hitsPerPage={PUBLIC_FEED_PER_PAGE_COUNT}
          facetFilters={[
            'moderationStatus:ACTIVE',
            'isDeleted:false',
            'isHidden:false',
            `tags:${tag}`,
          ]}
        />

        <SearchFiltersStacked
          isOpen={searchOpen}
          closeSearch={closeSearch}
          filters={[
            <SearchNavigationSortOptions
              key="search"
              algoliaIndexes={availableIndexes}
              orientation="vertical"
              defaultRefinement={defaultRefinement}
            />,
            <TagSearchFilters key="filters" />,
          ]}
        />

        <SearchPageBody isLoading={false}>
          <Box
            css={{
              textAlign: 'center',
              '@bp0': {
                textAlign: 'left',
              },
            }}
          >
            <Paragraph
              css={{
                fontWeight: 600,
                color: '$black60',
                lineHeight: 1,
                '&:empty': {
                  height: '16px',
                },
              }}
            >
              <SearchResultsCount label="Artwork" />
            </Paragraph>
            <TagsHeading>{tag}</TagsHeading>
          </Box>

          <Grid css={{ gap: '$7', alignItems: 'flex-start' }}>
            <SearchNavigationSortBar
              algoliaIndexes={availableIndexes}
              defaultRefinement={defaultRefinement}
              tabsVisible={false}
            />
            <SearchContainer>
              <SearchFiltersContainer>
                <TagSearchFilters />
              </SearchFiltersContainer>
              <ArtworkSearchResultsContainer>
                <ArtworkSearchResults />
              </ArtworkSearchResultsContainer>

              <SearchFiltersToggle openSearch={openSearch} />
            </SearchContainer>
          </Grid>
        </SearchPageBody>
      </InstantSearch>
    </Page>
  );
}

type Params = { tag: string };

type PageProps = GetStaticPathsResult<Params>;

export async function getStaticPaths(): Promise<PageProps> {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export async function getStaticProps({
  params,
}: GetStaticPropsContext<Params>): Promise<GetStaticPropsResult<TagPageProps>> {
  return {
    props: {
      tag: params.tag,
    },
    revalidate: 60,
  };
}
