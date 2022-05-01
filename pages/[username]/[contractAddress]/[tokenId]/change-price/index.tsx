import { useState } from 'react';

import useIsWrongNetwork from 'hooks/web3/use-is-wrong-network';
import useBalance from 'hooks/queries/use-balance';
import useWalletSession from 'hooks/web3/wallet/use-wallet-session';
import useUserModerationState from 'hooks/queries/hasura/use-user-moderation-state';
import { useArtworkByContractTokenIdFromRouter } from 'hooks/queries/hasura/artworks/use-artwork-by-contract-token-id';

import { isAnyTrue } from 'utils/helpers';

import { WrappedTransactionLayoutWithCard } from 'components/layouts/TransactionLayoutWithCard';
import ChangePriceContainer from 'components/transactions/changePrice/ChangePriceContainer';
import SpinnerStroked from 'components/SpinnerStroked';
import useAddUsernamePrefix from 'hooks/use-add-username-prefix';
import WalletAuthBlock from 'components/auth/WalletAuthBlock';
import TransactionWarningBlock from 'components/trust-safety/TransactionWarningBlock';

ChangePrice.getLayout = WrappedTransactionLayoutWithCard({
  title: 'Change Price',
});

export default function ChangePrice(): JSX.Element {
  // If the username is missing the @ prefix add it into the url
  useAddUsernamePrefix();

  const { data: user, isLoading: isUserLoading } = useWalletSession();

  const publicAddress = user?.publicAddress;

  const [resetKey, setResetKey] = useState(Date.now());

  const { data: balance, isLoading: balanceLoading } = useBalance();

  const isWrongNetwork = useIsWrongNetwork();

  const { data: artworkData, isLoading: serverArtworkLoading } =
    useArtworkByContractTokenIdFromRouter();

  const {
    isUserModerated,
    isLoading: isModerationStateLoading,
    moderationStatus,
  } = useUserModerationState(publicAddress);

  const isLoading = isAnyTrue([
    serverArtworkLoading,
    isUserLoading,
    balanceLoading,
    isModerationStateLoading,
  ]);

  if (isLoading) {
    return <SpinnerStroked size={44} />;
  }

  if (!user) {
    return <WalletAuthBlock />;
  }

  if (isUserModerated) {
    return <TransactionWarningBlock moderationStatus={moderationStatus} />;
  }

  return (
    <ChangePriceContainer
      artwork={artworkData}
      balance={balance}
      authToken={user?.token}
      key={resetKey}
      resetTransaction={() => setResetKey(Date.now())}
      isWrongNetwork={isWrongNetwork}
    />
  );
}
