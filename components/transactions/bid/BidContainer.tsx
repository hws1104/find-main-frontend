/* eslint-disable react/jsx-max-depth */
/* eslint-disable max-lines */
import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';

import Box from 'components/base/Box';
import Flex from 'components/base/Flex';
import Grid from 'components/base/Grid';
import Heading from 'components/base/Heading';
import TransactionForm, {
  BidFormValues,
} from 'components/forms/transactions/TransactionForm';
import BidSubmitButton from 'components/transactions/bid/BidSubmitButton';
import BidAmountInUSD from 'components/transactions/bid/BidAmountInUSD';
import ETHField from 'components/forms/fields/ETHField';
import ETHBalance from 'components/ETHBalance';
import BidStartNotice from './BidStartNotice';
import DisabledButton from 'components/forms/transactions/DisabledButton';
import BidNotice from './BidNotice';
import TransactionAwaitingConfirmation from 'components/transactions/TransactionAwaitingConfirmation';
import TransactionNoVerification from '../TransactionNoVerification';
import MinBidAmount from '../artwork/MinBidAmount';
import { TransactionError } from '../TransactionError';

import usePlaceBid from 'hooks/web3/transactions/use-place-bid';
import useNextRoute from 'hooks/use-next-route';
import useModal from 'hooks/use-modal';
import useSegmentEvent from 'hooks/use-segment-event';

import {
  getAuctionMinBidPrice,
  isAuctionOpenForBids,
} from 'utils/auctions/auctions';
import { formatETHWithSuffix } from 'utils/formatters';
import { isNonUserRejectedError } from 'utils/transactions';
import { areKeysEqual } from 'utils/users';
import { isAllTrue } from 'utils/helpers';

import { createBidAmountSchema } from 'schemas/transaction';

import WalletUser from 'types/WalletUser';
import { ModalKey } from 'types/modal';
import {
  AuctionFragment,
  ArtworkFragmentExtended,
} from 'graphql/hasura/hasura-fragments.generated';
import TransactionSubmitButton from '../generic/TransactionSubmitButton';

interface BidContainerProps {
  artwork: ArtworkFragmentExtended;
  mostRecentAuction: AuctionFragment;
  balance: number;
  hasSocialVerification: boolean;
  auctionId: number;
  user: WalletUser;
}

export default function BidContainer(props: BidContainerProps): JSX.Element {
  const {
    artwork,
    balance,
    auctionId,
    user,
    hasSocialVerification,
    mostRecentAuction,
  } = props;

  const router = useRouter();

  const { setCurrentModal } = useModal();

  const [sendSegmentEvent] = useSegmentEvent();

  const publicAddress = user?.publicAddress;

  const hasBids = Boolean(mostRecentAuction?.highestBidder);
  const minBidAmount = getAuctionMinBidPrice(mostRecentAuction);
  const isOpenForBids = isAuctionOpenForBids(mostRecentAuction);

  const isOwnedByCurrentUser = areKeysEqual([
    publicAddress,
    // owner’s address
    artwork?.ownerPublicKey,
  ]);

  const isHighestBidder = areKeysEqual([
    publicAddress,
    // highest bidder’s address (which may not exist)
    mostRecentAuction?.highestBidder,
  ]);

  // TODO: can we remove this and use the regular helper?
  const submittedRoute = useNextRoute('/bid/submitted');

  const canFireEvent = isAllTrue([
    auctionId,
    artwork.tokenId,
    artwork.contractAddress,
  ]);

  useEffect(
    () => {
      sendSegmentEvent({
        eventName: 'bid_viewed',
        payload: {
          auctionId: auctionId,
          tokenId: Number(artwork.tokenId),
          contractAddress: artwork.contractAddress,
        },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [canFireEvent]
  );

  const {
    mutateAsync: placeBid,
    reset: resetTransaction,
    isLoading,
    isError,
    error,
    data,
  } = usePlaceBid({
    onMutate: (data) => {
      console.log('onMutate', data);
      sendSegmentEvent({
        eventName: 'bid_placed',
        payload: {
          auctionId: data.auctionId,
          tokenId: Number(artwork.tokenId),
          contractAddress: artwork.contractAddress,
          bidAmount: data.price,
        },
      });
    },
  });

  console.log({ data });

  const handleSubmit = useCallback(
    async (values: BidFormValues) => {
      return await placeBid(
        {
          price: values.amount,
          auctionId,
        },
        {
          onSuccess: async (res) => {
            sendSegmentEvent({
              eventName: 'bid_approved',
              payload: {
                auctionId: auctionId,
                tokenId: Number(artwork.tokenId),
                contractAddress: artwork.contractAddress,
                bidAmount: values.amount,
              },
            });
            await router.push({
              pathname: submittedRoute,
              query: { txHash: res.hash },
            });
          },
          onError: (err) => {
            const isTxRejectionError = !isNonUserRejectedError(err);

            if (err.message === 'No Provider Error') {
              setCurrentModal(ModalKey.AUTH_MAIN);
            }

            if (isTxRejectionError) {
              sendSegmentEvent({
                eventName: 'bid_rejected',
                payload: {
                  auctionId: auctionId,
                  tokenId: Number(artwork.tokenId),
                  contractAddress: artwork.contractAddress,
                  bidAmount: values.amount,
                },
              });
            }
          },
        }
      );
    },
    [
      placeBid,
      setCurrentModal,
      sendSegmentEvent,
      router,
      submittedRoute,
      auctionId,
      artwork,
    ]
  );

  if (!hasSocialVerification) {
    return <TransactionNoVerification />;
  }

  // Keep showing loading state up until we redirect
  if (isLoading || data) {
    return <TransactionAwaitingConfirmation />;
  }

  if (isError && isNonUserRejectedError(error)) {
    return (
      <TransactionError error={error} resetTransaction={resetTransaction} />
    );
  }

  return (
    <Grid css={{ gap: '$4' }}>
      <Heading
        size={5}
        css={{
          justifyContent: 'center',
          textAlign: 'center',
          '@bp1': { justifyContent: 'flex-start', textAlign: 'left' },
        }}
      >
        Place a bid
      </Heading>

      <TransactionForm
        amount=""
        onSubmit={handleSubmit}
        schema={createBidAmountSchema({
          min: minBidAmount,
          max: balance,
        })}
      >
        <Grid css={{ gap: '$6' }}>
          <Grid css={{ gap: '$2' }}>
            <Grid css={{ gap: '$6' }}>
              <MinBidAmount minBidAmount={minBidAmount} />
              <ETHField name="amount" placeholder="0" autoFocus />
            </Grid>

            <Flex>
              <BidAmountInUSD name="amount" />
            </Flex>
          </Grid>

          <Grid css={{ gap: '$6', '@bp1': { gap: '$7' } }}>
            <ETHBalance balance={balance} formatter={formatETHWithSuffix} />

            <Box
              css={{
                maxWidth: 320,
                marginX: 'auto',
                textAlign: 'center',
                '@bp1': { marginX: 0, textAlign: 'left' },
              }}
            >
              {hasBids ? <BidNotice /> : <BidStartNotice />}
            </Box>

            <Box>
              {isOwnedByCurrentUser ? (
                <DisabledButton>
                  You’re the owner of this artwork
                </DisabledButton>
              ) : isHighestBidder ? (
                <DisabledButton>You’re the highest bidder</DisabledButton>
              ) : isOpenForBids ? (
                <TransactionSubmitButton
                  label="Place bid"
                  submittingLabel="Placing bid…"
                  submittedLabel="Bid placed"
                />
              ) : (
                <DisabledButton>This artwork isn’t listed yet</DisabledButton>
              )}
            </Box>
          </Grid>
        </Grid>
      </TransactionForm>
    </Grid>
  );
}
