import Grid from 'components/base/Grid';

import { styled } from 'stitches.config';

const FilterSection = styled(Grid, {
  borderBottom: 'solid 1px $black10',
  paddingBottom: '$7',
  variants: {
    isCollapsed: {
      true: {
        paddingBottom: 0,
      },
    },
  },
});

export default FilterSection;
