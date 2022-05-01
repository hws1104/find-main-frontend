import { css } from 'stitches.config';

import Box from 'components/base/Box';
import Grid from 'components/base/Grid';

import RefinementFilters from 'components/search/algolia/RefinementFilters';
import GroupedRefinementFilters from 'components/search/algolia/GroupedRefinementFilters';
import CollapsibleFilterSection from '../CollapsibleFilterSection';
import AlgoliaRangeInput from 'components/forms/fields/algolia/AlgoliaRangeInput';

import { AlgoliaArtworkAvailability } from 'types/Algolia';

const paddingTopZero = css({
  paddingTop: '0 !important',
})();

export default function TagSearchFilters(): JSX.Element {
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
            hasSearchValue={false}
          />
        </CollapsibleFilterSection>

        <GroupedRefinementFilters
          attribute="availability"
          title="Availability"
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
          attribute="mimeTypeFacet"
          title="Type"
          sortOrder={['3D', 'IMAGE', 'VIDEO']}
          defaultRefinement={['IMAGE', 'VIDEO', '3D']}
        />
      </Grid>
    </Box>
  );
}
