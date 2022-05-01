import { useState } from 'react';

import useIsWrongNetwork from 'hooks/web3/use-is-wrong-network';
import useBalance from 'hooks/queries/use-balance';
import useWalletSession from 'hooks/web3/wallet/use-wallet-session';

import { WrappedTransactionLayoutWithCard } from 'components/layouts/TransactionLayoutWithCard';

import UnlistContainer from 'components/transactions/unlist/UnlistContainer';
import SpinnerStroked from 'components/SpinnerStroked';
import useAddUsernamePrefix from 'hooks/use-add-username-prefix';
import WalletAuthBlock from 'components/auth/WalletAuthBlock';
import { isAnyTrue } from 'utils/helpers';
import { useArtworkByContractTokenIdFromRouter } from 'hooks/queries/hasura/artworks/use-artwork-by-contract-token-id';

Unlist.getLayout = WrappedTransactionLayoutWithCard({
  title: 'Unlist',
});

export default function Unlist(): JSX.Element {
  // If the username is missing the @ prefix add it into the url
  useAddUsernamePrefix();

  const { data: user, isLoading: isUserLoading } = useWalletSession();

  const [resetKey, setResetKey] = useState(Date.now());

  const { data: balance, isLoading: isBalanceLoading } = useBalance();

  const isWrongNetwork = useIsWrongNetwork();

  const { data: artworkData, isLoading: isArtworkLoading } =
    useArtworkByContractTokenIdFromRouter();

  const isLoading = isAnyTrue([
    isArtworkLoading,
    isUserLoading,
    isBalanceLoading,
  ]);

  if (isLoading) {
    return <SpinnerStroked size={44} />;
  }

  if (!user) {
    return <WalletAuthBlock />;
  }

  return (
    <UnlistContainer
      artwork={artworkData}
      balance={balance}
      authToken={user?.token}
      key={resetKey}
      resetTransaction={() => setResetKey(Date.now())}
      isWrongNetwork={isWrongNetwork}
    />
  );
}
