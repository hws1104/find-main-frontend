/* eslint-disable react/jsx-max-depth */
import { NextRouter, useRouter } from 'next/router';
import qs from 'qs';
import { css, styled } from 'stitches.config';

import Box from 'components/base/Box';
import Grid from 'components/base/Grid';
import RefinementFilters from 'components/search/algolia/RefinementFilters';
import GroupedRefinementFilters from 'components/search/algolia/GroupedRefinementFilters';
import AlgoliaRangeInput from 'components/forms/fields/algolia/AlgoliaRangeInput';
import CollapsibleFilterSection from 'components/search/CollapsibleFilterSection';
import { SelectIcon } from 'components/forms/fields/SelectField';

import CloseIcon from 'assets/icons/close-icon-bold.svg';

import { AlgoliaArtworkAvailability } from 'types/Algolia';

export const FilterHeading = styled('div', {
  fontSize: '$2',
  fontWeight: 600,
  fontFamily: '$body',
  color: '$black100',
  display: 'flex',
  cursor: 'pointer',
  background: '$white100',
  border: 'none',
  paddingX: '0',
  variants: {
    isCollapsible: {
      true: {
        paddingTop: '$7',
        paddingBottom: '$7',
      },
    },
    isCollapsed: {
      true: {},
    },
  },
});

function searchParams(router: NextRouter) {
  const searchIndex = router.asPath.indexOf('?');
  // If url has no search param default to empty state
  if (searchIndex === -1) {
    return {};
  }
  const search = router.asPath.substring(searchIndex + 1);
  const searchParams = qs.parse(search);
  return searchParams;
}

const getMarketLabel = (isPrimary: string): string =>
  isPrimary === 'true' ? 'Primary' : 'Secondary';

interface SelectDownIconProps {
  isCollapsed: boolean;
}

export function SelectDownIcon(props: SelectDownIconProps): JSX.Element {
  const { isCollapsed } = props;
  return (
    <SelectIcon
      css={{
        marginLeft: 'auto',
        transition: 'transform $1 $ease',
        transform: isCollapsed ? 'rotate(45deg)' : 'rotate(90deg)',
      }}
    >
      <CloseIcon width={10} />
    </SelectIcon>
  );
}

const paddingTopZero = css({
  paddingTop: '0 !important',
})();

export default function ArtworkSearchFilters(): JSX.Element {
  const router = useRouter();
  const hasPriceRangeFromUrl = Boolean(
    searchParams(router).range?.['auction.currentPrice']
  );

  return (
    <Box>
      <Grid>
        <CollapsibleFilterSection
          title="Price range"
          collapsed={false}
          className={paddingTopZero}
        >
          <AlgoliaRangeInput
            attribute="auction.currentPrice"
            hasSearchValue={hasPriceRangeFromUrl}
          />
        </CollapsibleFilterSection>
        <GroupedRefinementFilters
          attribute="availability"
          title="Availability"
          collapsed={false}
          defaultRefinement={[
            AlgoliaArtworkAvailability.UNLISTED,
            AlgoliaArtworkAvailability.RESERVE_NOT_MET,
            AlgoliaArtworkAvailability.LIVE_AUCTION,
            AlgoliaArtworkAvailability.SOLD,
          ]}
          groups={[
            {
              title: 'All',
              filters: [
                AlgoliaArtworkAvailability.UNLISTED,
                AlgoliaArtworkAvailability.RESERVE_NOT_MET,
                AlgoliaArtworkAvailability.LIVE_AUCTION,
                AlgoliaArtworkAvailability.SOLD,
              ],
              filtersVisible: false,
            },
            {
              title: 'Available',
              filters: [
                AlgoliaArtworkAvailability.RESERVE_NOT_MET,
                AlgoliaArtworkAvailability.LIVE_AUCTION,
              ],
              filtersVisible: true,
            },
            {
              title: 'Sold',
              filters: [AlgoliaArtworkAvailability.SOLD],
              filtersVisible: false,
            },
          ]}
        />
        <RefinementFilters
          attribute="auction.isPrimarySale"
          title="Market"
          defaultRefinement={['true', 'false']}
          transformItems={(items) =>
            items.map((item) => ({
              ...item,
              label: getMarketLabel(item.label),
            }))
          }
        />
        <RefinementFilters
          attribute="mimeTypeFacet"
          title="Type"
          sortOrder={['3D', 'IMAGE', 'VIDEO']}
          defaultRefinement={['IMAGE', 'VIDEO', '3D']}
        />
      </Grid>
    </Box>
  );
}
