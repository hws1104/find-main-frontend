import { useRouter } from 'next/router';

import HeaderComposed from 'components/headers/HeaderComposed';

import useWalletSession from 'hooks/web3/wallet/use-wallet-session';
import useUserByPublicKey from 'hooks/queries/use-user-by-public-key';
import useUserActivityCount from 'hooks/queries/hasura/use-user-activity-count';

import { isAnyTrue } from 'utils/helpers';

import { PageColorMode, PageType } from 'types/page';
import MinimalLoggedInHeader from './MinimalLoggedInHeader';

interface HeaderProps {
  mode: PageColorMode;
  headerMode: PageColorMode;
  absolute: boolean;
  type: PageType;
}

export default function Header(props: HeaderProps): JSX.Element {
  const {
    mode = PageColorMode.light,
    headerMode = PageColorMode.light,
    absolute = false,
    type,
  } = props;

  const isDark = [mode, headerMode].includes(PageColorMode.dark);

  const color = isDark ? '#fff' : '#000';

  const { data: user, isLoading: isUserLoading } = useWalletSession();

  const router = useRouter();

  const publicAddress = user?.publicAddress;

  const { data: serverUserData } = useUserByPublicKey(
    { publicKey: publicAddress },
    { refetchOnWindowFocus: false }
  );

  const { data: activityCount, isLoading: isActivityCountLoading } =
    useUserActivityCount(
      { publicKey: publicAddress },
      { enabled: Boolean(publicAddress) }
    );

  const isApprovedCreator = serverUserData?.user?.isApprovedCreator;

  const sharedHeaderProps = {
    absolute,
    color,
    mode: headerMode,
    isDark,
  };

  const isLoading = isAnyTrue([
    isActivityCountLoading,
    isUserLoading,
    !router.isReady,
  ]);

  // TODO: glue this into HeaderComposed
  if (type === PageType.minimalLoggedIn) {
    return (
      <MinimalLoggedInHeader
        isApprovedCreator={isApprovedCreator}
        {...sharedHeaderProps}
      />
    );
  }

  return (
    <HeaderComposed
      {...sharedHeaderProps}
      isLoading={isLoading}
      isConnected={Boolean(publicAddress)}
      isApprovedCreator={isApprovedCreator}
      activityCount={activityCount}
    />
  );
}
