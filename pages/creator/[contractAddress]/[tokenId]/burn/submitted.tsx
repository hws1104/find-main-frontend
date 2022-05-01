import { WrappedTransactionLayoutWithCard } from 'components/layouts/TransactionLayoutWithCard';
import BurnTransactionSuccess from 'components/transactions/burn/BurnTransactionSuccess';
import BurnTransactionBurning from 'components/transactions/burn/BurnTransactionBurning';

import useWalletSession from 'hooks/web3/wallet/use-wallet-session';
import useTransactionParams from 'hooks/use-transaction-params';
import useUserByPublicKey from 'hooks/queries/use-user-by-public-key';
import { useArtworkByContractTokenIdFromRouter } from 'hooks/queries/hasura/artworks/use-artwork-by-contract-token-id';

import { isAnyTrue } from 'utils/helpers';
import { buildUserProfilePath } from 'utils/artwork/artwork';

BurnSubmitted.getLayout = WrappedTransactionLayoutWithCard({
  title: 'Burn',
});

export default function BurnSubmitted(): JSX.Element {
  const { data: user } = useWalletSession();

  const { txHash } = useTransactionParams();

  const { data: artwork, isLoading: isArtworkLoading } =
    useArtworkByContractTokenIdFromRouter({ refetchInterval: 5000 });

  const ownerPublicKey = artwork?.ownerPublicKey;

  const isBurned = ownerPublicKey === null;

  const { data: userData } = useUserByPublicKey(
    { publicKey: user?.publicAddress },
    { refetchOnWindowFocus: false }
  );

  const profilePath = buildUserProfilePath({ user: userData?.user });

  const isLoading = isAnyTrue([!isBurned, isArtworkLoading]);

  if (isLoading) {
    return <BurnTransactionBurning txHash={txHash} />;
  }

  return (
    <BurnTransactionSuccess
      txHash={txHash}
      profilePath={profilePath}
      isBurned={isBurned}
    />
  );
}
