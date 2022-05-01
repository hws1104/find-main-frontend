import { useToggle, useClickAway } from 'react-use';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

import { buildAvatarUrl } from 'utils/assets';
import useWalletSession from 'hooks/web3/wallet/use-wallet-session';
import useBalance from 'hooks/queries/use-balance';
import useUserByPublicKey from 'hooks/queries/use-user-by-public-key';

import Box from 'components/base/Box';
import UserDropdownButton from './UserDropdownButton';
import UserDropdownDetails from './UserDropdownDetails';
import { useUserInviteCount } from 'graphql/hasura/queries/user-invite-count.generated';
import { isAllTrue, isAnyTrue } from 'utils/helpers';

interface UserDropdownProps {
  activityCount?: number;
  minLoggedIn?: boolean;
}

export default function UserDropdown(props: UserDropdownProps): JSX.Element {
  const { activityCount = 0, minLoggedIn = false } = props;

  const router = useRouter();
  const ref = useRef(null);
  const [isOpen, toggleNav] = useToggle(false);

  // close the nav on route change
  useEffect(() => {
    toggleNav(false);
  }, [toggleNav, router.asPath]);

  useClickAway(ref, () => {
    toggleNav(false);
  });

  const { data: initialUser, isLoading: isUserLoading } = useWalletSession();

  const publicAddress = initialUser?.publicAddress;

  const { data: userData, isLoading: isCurrentUserLoading } =
    useUserByPublicKey(
      { publicKey: publicAddress },
      { refetchOnWindowFocus: false }
    );

  const user = userData?.user;
  const publicKey = user?.publicKey;
  const profileImageUrl = userData?.user?.profileImageUrl;
  const avatarUrl = buildAvatarUrl(90, profileImageUrl);

  const { data: userInviteData } = useUserInviteCount(
    { publicKey: publicAddress },
    { enabled: isAllTrue([publicAddress, isOpen]) }
  );

  const inviteCount = userInviteData?.inviteCount?.aggregate?.count ?? 0;

  const { data: balance, isLoading: isBalanceLoading } = useBalance();

  const isLoading = isAnyTrue([
    isCurrentUserLoading,
    isUserLoading,
    isBalanceLoading,
  ]);

  return (
    <Box ref={ref} css={{ '@bp0': { position: 'relative' } }}>
      <UserDropdownButton
        onClick={toggleNav}
        isLoading={isLoading}
        avatarUrl={avatarUrl}
        publicKey={publicKey}
      />

      {isOpen && (
        <Box>
          <UserDropdownDetails
            user={user}
            avatarUrl={avatarUrl}
            activityCount={activityCount}
            canInviteCreators={inviteCount > 0}
            publicKey={publicKey}
            balance={balance}
            minLoggedIn={minLoggedIn}
          />
        </Box>
      )}
    </Box>
  );
}
