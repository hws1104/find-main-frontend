import { theme } from 'stitches.config';
import { any } from 'ramda';
import { useState } from 'react';

import useWalletSession from 'hooks/web3/wallet/use-wallet-session';
import useBodyColor from 'hooks/use-body-color';

import TwitterContainer from 'components/verify/twitter/TwitterContainer';
import WalletAuthBlock from 'components/auth/WalletAuthBlock';
import LoadingPage from 'components/LoadingPage';
import Page from 'components/Page';

import { PageColorMode } from 'types/page';

export default function Twitter(): JSX.Element {
  const { data: user, isLoading: isUserLoading } = useWalletSession();

  useBodyColor(theme.colors.black5.value);

  const [resetKey, setResetKey] = useState<number>(Date.now());

  const loadingStates = [isUserLoading];

  const isLoading = any(Boolean, loadingStates);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!user) {
    return <WalletAuthBlock />;
  }

  return (
    <Page
      title="Verify Twitter"
      mode={PageColorMode.light}
      footerStyle={{ display: 'none' }}
    >
      <TwitterContainer key={resetKey} reset={setResetKey} />
    </Page>
  );
}
