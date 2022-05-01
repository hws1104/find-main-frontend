import { styled } from 'stitches.config';
import Link from 'components/base/Link';

const NavLink = styled(Link, {
  fontSize: '$2',
  fontWeight: 600,
  color: '$black60',
  textDecoration: 'none',
  transition: 'color $0 $ease',
  '@hover': {
    '&:hover': {
      color: '$black100',
    },
  },
  variants: {
    isActive: { true: { color: '$black100' } },
    isDark: {
      true: {
        color: '$white100',
        '@hover': {
          '&:hover': {
            color: '$white100',
          },
        },
      },
    },
  },
});

export default NavLink;
