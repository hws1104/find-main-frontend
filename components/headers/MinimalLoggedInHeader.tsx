import LogoLink from 'components/links/LogoLink';
import UserDropdown from 'components/headers/UserDropdown';
import HeaderContainer from 'components/headers/HeaderContainer';
import { SharedHeaderProps } from 'components/headers/types';
import InnerHeaderContainer from './InnerHeaderContainer';
import Box from 'components/base/Box';

interface MinimalLoggedInHeaderProps extends SharedHeaderProps {
  isApprovedCreator: boolean;
  isDark?: boolean;
}

export default function MinimalLoggedInHeader(
  props: MinimalLoggedInHeaderProps
): JSX.Element {
  const { color, absolute } = props;

  return (
    <Box css={{ position: 'relative' }}>
      <HeaderContainer absolute={absolute}>
        <InnerHeaderContainer className="header-inner">
          <LogoLink color={color} />
          <UserDropdown minLoggedIn />
        </InnerHeaderContainer>
      </HeaderContainer>
    </Box>
  );
}
