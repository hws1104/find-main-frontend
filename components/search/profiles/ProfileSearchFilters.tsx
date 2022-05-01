import Box from 'components/base/Box';
import Grid from 'components/base/Grid';

import RefinementFilters from 'components/search/algolia/RefinementFilters';
import { AlgoliaUserSocialVerification, AlgoliaUserType } from 'types/Algolia';

export default function ProfileSearchFilters(): JSX.Element {
  return (
    <Box>
      <Grid>
        <RefinementFilters
          attribute="userTypeFacet"
          title="Type"
          sortOrder={[
            AlgoliaUserType.CREATOR,
            AlgoliaUserType.COLLECTOR,
            AlgoliaUserType.OTHER,
          ]}
          defaultRefinement={[AlgoliaUserType.CREATOR]}
          collapsed={false}
        />
        <RefinementFilters
          attribute="socialVerificationFacet"
          title="Social Verification"
          sortOrder={[
            AlgoliaUserSocialVerification.TWITTER,
            AlgoliaUserSocialVerification.INSTAGRAM,
            AlgoliaUserSocialVerification.NOT_VERIFIED,
          ]}
          defaultRefinement={[
            AlgoliaUserSocialVerification.TWITTER,
            AlgoliaUserSocialVerification.INSTAGRAM,
          ]}
          collapsed={false}
        />
      </Grid>
    </Box>
  );
}
