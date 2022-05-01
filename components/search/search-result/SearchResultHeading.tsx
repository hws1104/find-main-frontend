import Heading from 'components/base/Heading';

import { styled } from 'stitches.config';

const SearchResultHeading = styled(Heading, {
  fontSize: '$2',
  display: 'flex',
  color: '$black100',
  variants: {
    color: {
      isDark: {
        color: '$white100',
      },
    },
  },
});

export default SearchResultHeading;
