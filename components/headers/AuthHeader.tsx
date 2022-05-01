import Flex from 'components/base/Flex';
import UserDropdown from 'components/headers/UserDropdown';
import HeaderActivityLink from './HeaderActivityLink';
import HeaderCreatorUploadLink from 'components/headers/HeaderCreatorUploadLink';
import MobileHeaderSearchButton from './MobileHeaderSearchButton';
import MobileHeaderOpenButton from './MobileHeaderOpenButton';
import NotificationsLink from 'components/notifications/NotificationsLink';
import NavLinks from './NavLinks';

import { HeaderProps } from 'components/headers/types';

interface AuthHeaderProps extends HeaderProps {
  isDark: boolean;
  activityCount: number;
}

export default function AuthHeader(props: AuthHeaderProps): JSX.Element {
  const {
    isDark,
    activityCount,
    isNavOpen,
    setNavOpen,
    searchOpen,
    setSearchOpen,
  } = props;

  return (
    <Flex css={{ alignItems: 'center' }}>
      <Flex
        css={{
          alignItems: 'center',
          display: 'none',
          '@bp2': {
            display: 'flex',
          },
        }}
      >
        <NavLinks isDark={isDark} isLoggedIn />
        <HeaderActivityLink isDark={isDark} activityCount={activityCount} />
        <NotificationsLink />
      </Flex>

      <Flex>
        {!searchOpen && <UserDropdown activityCount={activityCount} />}

        <MobileHeaderSearchButton isOpen={searchOpen} setOpen={setSearchOpen} />
        {!searchOpen && (
          <MobileHeaderOpenButton isOpen={isNavOpen} setOpen={setNavOpen} />
        )}

        <HeaderCreatorUploadLink />
      </Flex>
    </Flex>
  );
}
