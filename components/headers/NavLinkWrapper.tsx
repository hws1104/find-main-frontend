import { styled } from 'stitches.config';
import Flex from 'components/base/Flex';

const NavLinkWrapper = styled(Flex, {
  display: 'none',
  '@bp2': {
    display: 'flex',
    justifyContent: 'center',
  },
});

export default NavLinkWrapper;
