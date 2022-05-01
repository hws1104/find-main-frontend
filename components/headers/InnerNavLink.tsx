import { styled } from 'stitches.config';
import NavLink from './NavLink';

const InnerNavLink = styled(NavLink, {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '$4',
  color: '$black100',
  cursor: 'pointer',
  transition: 'background $1 $ease',
  borderRadius: '$1',
  '@hover': {
    '&:hover': {
      background: '$black5',
    },
  },
});

export default InnerNavLink;
