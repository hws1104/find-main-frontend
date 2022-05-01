import { useState } from 'react';

import { isAnyTrue } from 'utils/helpers';

import useIsWrongNetwork from 'hooks/web3/use-is-wrong-network';
import useBalance from 'hooks/queries/use-balance';
import useWalletSession from 'hooks/web3/wallet/use-wallet-session';
import { useArtworkByContractTokenIdFromRouter } from 'hooks/queries/hasura/artworks/use-artwork-by-contract-token-id';

import { WrappedTransactionLayoutWithCard } from 'components/layouts/TransactionLayoutWithCard';
import BurnContainer from 'components/transactions/burn/BurnContainer';
import SpinnerStroked from 'components/SpinnerStroked';
import WalletAuthBlock from 'components/auth/WalletAuthBlock';

Burn.getLayout = WrappedTransactionLayoutWithCard({
  title: 'Burn',
});

export default function Burn(): JSX.Element {
  const { data: user, isLoading: isUserLoading } = useWalletSession();

  const [resetKey, setResetKey] = useState(Date.now());

  const { data: balance, isLoading: isBalanceLoading } = useBalance();

  const isWrongNetwork = useIsWrongNetwork();

  const { data: artworkData, isLoading: isServerArtworkLoading } =
    useArtworkByContractTokenIdFromRouter();

  const isLoading = isAnyTrue([
    isServerArtworkLoading,
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
    <BurnContainer
      artwork={artworkData}
      balance={balance}
      authToken={user?.token}
      key={resetKey}
      resetTransaction={() => setResetKey(Date.now())}
      isWrongNetwork={isWrongNetwork}
    />
  );
}
