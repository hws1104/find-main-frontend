import { styled } from 'stitches.config';

import Link from 'components/base/Link';

const ExternalLink = styled(Link, {
  color: '$black60',
  fontWeight: 600,
  textDecoration: 'none',
  transition: 'color $1 $ease',
  '@hover': {
    '&:hover': {
      color: '$black100',
    },
  },
});

export default ExternalLink;
