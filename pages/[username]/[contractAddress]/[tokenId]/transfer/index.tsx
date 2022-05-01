import { useState } from 'react';

import useIsWrongNetwork from 'hooks/web3/use-is-wrong-network';
import useBalance from 'hooks/queries/use-balance';
import useWalletSession from 'hooks/web3/wallet/use-wallet-session';
import useAddUsernamePrefix from 'hooks/use-add-username-prefix';
import { useArtworkByContractTokenIdFromRouter } from 'hooks/queries/hasura/artworks/use-artwork-by-contract-token-id';

import { isAnyTrue } from 'utils/helpers';

import { WrappedTransactionLayoutWithCard } from 'components/layouts/TransactionLayoutWithCard';

import TransferContainer from 'components/transactions/transfer/TransferContainer';
import SpinnerStroked from 'components/SpinnerStroked';
import WalletAuthBlock from 'components/auth/WalletAuthBlock';

Transfer.getLayout = WrappedTransactionLayoutWithCard({
  title: 'Transfer',
});

export default function Transfer(): JSX.Element {
  // If the username is missing the @ prefix add it into the url
  useAddUsernamePrefix();

  const { data: user, isLoading: isUserLoading } = useWalletSession();

  const publicAddress = user?.publicAddress;

  const [resetKey, setResetKey] = useState(Date.now());

  const { data: artworkData, isLoading: isArtworkLoading } =
    useArtworkByContractTokenIdFromRouter();

  const { data: balance, isLoading: isBalanceLoading } = useBalance();

  const isWrongNetwork = useIsWrongNetwork();

  const isLoading = isAnyTrue([
    isUserLoading,
    isBalanceLoading,
    isArtworkLoading,
  ]);

  if (isLoading) {
    return <SpinnerStroked size={44} />;
  }

  if (!user) {
    return <WalletAuthBlock />;
  }

  return (
    <TransferContainer
      artwork={artworkData}
      balance={balance}
      authToken={user?.token}
      key={resetKey}
      resetTransaction={() => setResetKey(Date.now())}
      isWrongNetwork={isWrongNetwork}
      publicAddress={publicAddress}
    />
  );
}
