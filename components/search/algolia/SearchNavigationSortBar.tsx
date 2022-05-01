import { connectStats, Index } from 'react-instantsearch-dom';
import { StatsProvided } from 'react-instantsearch-core';

import NextLink from 'next/link';

import { css, styled } from 'stitches.config';

import { AlgoliaIndexName } from 'types/Algolia';

import Flex from 'components/base/Flex';
import Text from 'components/base/Text';
import SearchNavigationSortOptions from './SearchNavigationSortOptions';

import { formatInteger } from 'utils/formatters';

interface IndexTabProps {
  isActive: boolean;
  label: string;
  hitsCount: number;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export function IndexTab(props: IndexTabProps) {
  const { isActive, hitsCount, label } = props;
  return (
    <IndexTabContainer isActive={isActive}>
      <IndexTabLabel
        css={{
          marginRight: '$3',
          '@bp2': {
            marginRight: '$4',
          },
        }}
        isActive={isActive}
      >
        {label}
      </IndexTabLabel>
      <IndexTabLabel css={{ color: '$black60' }} isActive={isActive}>
        {formatInteger(hitsCount)}
      </IndexTabLabel>
    </IndexTabContainer>
  );
}

type IndexCount = StatsProvided & {
  label: string;
  isActive: boolean;
};

const IndexCount = connectStats<IndexCount>((props) => {
  return <IndexTab {...props} hitsCount={props.nbHits} />;
});

interface IndexTabLinkProps {
  href: string;
  indexName: string;
  label: string;
  pathname: string;
}

export function IndexTabLink(props: IndexTabLinkProps): JSX.Element {
  const { indexName, href, label, pathname } = props;
  return (
    <Index indexName={indexName}>
      <NextLink href={href} passHref>
        <a style={{ textDecoration: 'none', display: 'block' }}>
          <IndexCount label={label} isActive={href === pathname} />
        </a>
      </NextLink>
    </Index>
  );
}

interface SearchNavigationSortBarProps {
  algoliaIndexes: AlgoliaIndexName[];
  defaultRefinement: string;
  tabsVisible?: boolean;
}

const headerStyles = css({
  display: 'none',
  '@bp0': {
    display: 'flex',
  },
})();

const TabsContainer = styled(Flex, {
  marginBottom: 'auto',
});

export default function SearchNavigationSortBar(
  props: SearchNavigationSortBarProps
): JSX.Element {
  const { algoliaIndexes, defaultRefinement, tabsVisible = true } = props;

  if (!tabsVisible) {
    return (
      <TabsContainer
        css={{
          paddingBottom: '$4',
          justifyContent: 'flex-end',
          display: 'none',
          '@bp1': {
            display: 'flex',
          },
        }}
      >
        <SearchNavigationSortOptions
          algoliaIndexes={algoliaIndexes}
          className={headerStyles}
          orientation="horizontal"
          defaultRefinement={defaultRefinement}
        />
      </TabsContainer>
    );
  }

  return (
    <TabsContainer
      css={{
        justifyContent: 'space-between',
        display: 'none',
        '@bp1': {
          display: 'flex',
        },
      }}
    >
      <SearchNavigationSortOptions
        algoliaIndexes={algoliaIndexes}
        className={headerStyles}
        orientation="horizontal"
        defaultRefinement={defaultRefinement}
      />
    </TabsContainer>
  );
}

const IndexTabContainer = styled(Flex, {
  paddingBottom: '$6',
  borderBottom: 'solid 2px transparent',
  textDecoration: 'none',
  variants: {
    isActive: {
      true: {
        borderBottom: 'solid 2px $black100',
      },
    },
  },
});

const IndexTabLabel = styled(Text, {
  fontSize: '$2',
  fontWeight: 600,
  fontFamily: '$body',
  color: '$black100',
  variants: {
    isActive: {
      true: {
        color: '$black100 !important',
      },
    },
  },
});
