import { useEffect } from 'react';
import { BigNumber } from '@ethersproject/bignumber';

import { WrappedTransactionLayoutWithCard } from 'components/layouts/TransactionLayoutWithCard';
import ChangePriceTransactionSuccess from 'components/transactions/changePrice/ChangePriceTransactionSuccess';
import ChangePriceTransactionChangingPrice from 'components/transactions/changePrice/ChangePriceTransactionChangingPrice';

import useReadOnlyProvider from 'hooks/web3/use-read-only-provider';
import useWalletSession from 'hooks/web3/wallet/use-wallet-session';
import useUserByPublicKey from 'hooks/queries/use-user-by-public-key';
import useAddUsernamePrefix from 'hooks/use-add-username-prefix';
import useContractEventHandler from 'hooks/web3/transactions/use-contract-event-handler';
import useTransactionParams from 'hooks/use-transaction-params';
import { useArtworkByContractTokenIdFromRouter } from 'hooks/queries/hasura/artworks/use-artwork-by-contract-token-id';
import useEventByTransactionHash from 'hooks/queries/hasura/events/use-event-by-transaction-hash';

import { isAnyTrue } from 'utils/helpers';
import { buildArtworkPath, buildUserProfilePath } from 'utils/artwork/artwork';
import { getMostRecentAuction } from 'utils/auctions/auctions';

import { getNFTMarketContractToRead } from 'lib/contracts';

ChangePriceSubmitted.getLayout = WrappedTransactionLayoutWithCard({
  title: 'Change Price',
});

export default function ChangePriceSubmitted(): JSX.Element {
  // If the username is missing the @ prefix add it into the url
  useAddUsernamePrefix();

  const { txHash } = useTransactionParams();

  const [isEventEmitted, setIsEventEmitted] = useContractEventHandler();

  const { data: artworkData, isLoading: isServerArtworkLoading } =
    useArtworkByContractTokenIdFromRouter();

  const mostRecentActiveAuction = getMostRecentAuction(artworkData);
  const auctionId = mostRecentActiveAuction?.auctionId;

  const { provider } = useReadOnlyProvider();

  const nftMarket = getNFTMarketContractToRead(provider);

  useEventByTransactionHash(
    { transactionHash: txHash },
    { onSuccess: (res) => setIsEventEmitted(Boolean(res)) }
  );

  useEffect(() => {
    if (auctionId && nftMarket) {
      nftMarket.once(
        nftMarket.filters.ReserveAuctionUpdated(
          BigNumber.from(auctionId),
          null
        ),
        () => {
          // setIsEventEmitted(true)
        }
      );
    }
  }, [auctionId, nftMarket, setIsEventEmitted]);

  const artwork = artworkData;

  const artworkPath = buildArtworkPath({ artwork, user: artwork?.creator });

  const { data: userAuthToken } = useWalletSession();

  const { data: bidderData } = useUserByPublicKey({
    publicKey: userAuthToken?.publicAddress,
  });

  const user = bidderData?.user;

  const userProfilePath = buildUserProfilePath({ user });

  const isLoading = isAnyTrue([!isEventEmitted, isServerArtworkLoading]);

  if (isLoading) {
    return <ChangePriceTransactionChangingPrice txHash={txHash} />;
  }

  return (
    <ChangePriceTransactionSuccess
      txHash={txHash}
      artworkPath={artworkPath}
      profilePath={userProfilePath}
      isEventEmitted={isEventEmitted}
    />
  );
}
