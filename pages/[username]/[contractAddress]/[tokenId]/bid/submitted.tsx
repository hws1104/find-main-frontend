import { useRouter } from 'next/router';
import { path } from 'ramda';
import { useEffect } from 'react';
import { BigNumber } from '@ethersproject/bignumber';

import useIsWrongNetwork from 'hooks/web3/use-is-wrong-network';
import useReadOnlyProvider from 'hooks/web3/use-read-only-provider';
import useWalletSession from 'hooks/web3/wallet/use-wallet-session';
import useContractEventHandler from 'hooks/web3/transactions/use-contract-event-handler';
import useAddUsernamePrefix from 'hooks/use-add-username-prefix';
import { useArtworkByContractTokenIdFromRouter } from 'hooks/queries/hasura/artworks/use-artwork-by-contract-token-id';
import useTransactionParams from 'hooks/use-transaction-params';
import useEventByTransactionHash from 'hooks/queries/hasura/events/use-event-by-transaction-hash';

import TransactionContent from 'components/transactions/TransactionContent';
import TransactionPendingState from 'components/transactions/TransactionPendingState';
import MetaMaskError from 'components/auth/MetaMaskError';
import BidSubmittedActions from 'components/transactions/bid/BidSubmittedActions';
import { WrappedTransactionLayoutWithCard } from 'components/layouts/TransactionLayoutWithCard';

import { isAllTrue, isAnyTrue } from 'utils/helpers';

import { getNFTMarketContractToRead } from 'lib/contracts';

import { AuctionFragment } from 'graphql/hasura/hasura-fragments.generated';

BidSubmitted.getLayout = WrappedTransactionLayoutWithCard({
  title: 'Bid Submitted',
});

export default function BidSubmitted(): JSX.Element {
  // If the username is missing the @ prefix add it into the url
  useAddUsernamePrefix();

  const { data: user, isLoading: isUserLoading } = useWalletSession();

  const [isEventEmitted, setIsEventEmitted] = useContractEventHandler();

  const router = useRouter();

  const { tokenId, txHash } = useTransactionParams();

  const { data: artworkData, isLoading: isArtworkLoading } =
    useArtworkByContractTokenIdFromRouter();

  const mostRecentAuction = path<AuctionFragment>(['auctions', 0], artworkData);

  const auctionId = mostRecentAuction?.auctionId;

  useEventByTransactionHash(
    { transactionHash: txHash },
    { onSuccess: (res) => setIsEventEmitted(Boolean(res)) }
  );

  const loadingStates = [isUserLoading, !user, isArtworkLoading];

  const isWrongNetwork = useIsWrongNetwork();

  const { provider } = useReadOnlyProvider();

  const nftMarket = getNFTMarketContractToRead(provider);

  const canFireContractEvent = isAllTrue([router.isReady, nftMarket, tokenId]);

  useEffect(
    () => {
      if (nftMarket && auctionId) {
        nftMarket.once(
          nftMarket.filters.ReserveAuctionBidPlaced(
            BigNumber.from(auctionId),
            null,
            null,
            null
          ),
          () => {
            // TODO: decide if we want to two-phase success
            // setIsEventEmitted(true);
          }
        );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [canFireContractEvent, setIsEventEmitted]
  );

  if (isWrongNetwork) {
    return <MetaMaskError />;
  }

  const isLoading = isAnyTrue(loadingStates);

  if (!isEventEmitted || isLoading) {
    return (
      <TransactionContent
        title="Your bid has been submitted."
        description="Your bid is being confirmed on the Ethereum blockchain. You’re free to leave this page if you like."
      >
        <TransactionPendingState txHash={txHash} />
      </TransactionContent>
    );
  }

  return (
    <TransactionContent
      title="Your bid was placed successfully."
      description="Your bid was confirmed on the Ethereum network. Please keep an eye on this auction in case someone outbids you before it’s over."
    >
      <BidSubmittedActions artwork={artworkData} />
    </TransactionContent>
  );
}
