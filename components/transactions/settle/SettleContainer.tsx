/* eslint-disable max-lines */
/* eslint-disable react/jsx-max-depth */
import { useCallback } from 'react';
import { anyPass, cond, T } from 'ramda';
import { useRouter } from 'next/router';
import { Form, Formik } from 'formik';

import TransactionAwaitingConfirmation from 'components/transactions/TransactionAwaitingConfirmation';
import TransactionContent from 'components/transactions/TransactionContent';
import Paragraph from 'components/base/Paragraph';
import Button from 'components/base/Button';
import Link from 'components/links/Link';
import TransactionSubmitButton from '../generic/TransactionSubmitButton';

import {
  AuctionFragment,
  ArtworkFragmentExtended,
} from 'graphql/hasura/hasura-fragments.generated';

import {
  isArtworkAuctionWinner,
  isArtworkAuctionCreator,
  isArtworkAuctionOwner,
  isAuctionStatusFinalized,
} from 'utils/auctions/auctions';

import useFinalizeReserveAuction from 'hooks/web3/transactions/use-finalize-reserve-auction';
import useNextRoute from 'hooks/use-next-route';
import useSegmentEvent, { SegmentAuctionEvent } from 'hooks/use-segment-event';

import { styled } from 'stitches.config';

const SubmitButton = styled(Button, {
  width: '100%',
  '@bp1': {
    maxWidth: 280,
  },
});

interface SettleFormValues {
  auctionId: number;
}

interface SettleContainerProps {
  auction: AuctionFragment;
  artwork: ArtworkFragmentExtended;
  publicAddress: string;
}

type SegmentSettleEvent = SegmentAuctionEvent & {
  buyer: string;
  seller: string;
  settler: string;
};

export default function SettleContainer(
  props: SettleContainerProps
): JSX.Element {
  const { publicAddress, auction, artwork } = props;

  const router = useRouter();

  const [sendSegmentEvent] = useSegmentEvent<SegmentSettleEvent>();

  const isAuctionWinner = isArtworkAuctionWinner(publicAddress, auction);
  const isAuctionCreator = isArtworkAuctionCreator(publicAddress, artwork);
  const isAuctionOwner = isArtworkAuctionOwner(publicAddress, auction);

  const isAuctionFinalized = anyPass([isAuctionStatusFinalized])(auction);

  const submittedRoute = useNextRoute('/settle/submitted');

  const {
    mutateAsync: finalizeReserveAuction,
    isSuccess,
    isLoading,
  } = useFinalizeReserveAuction({
    onSuccess: async (res) => {
      sendSegmentEvent({
        eventName: 'auction_settled',
        payload: {
          auctionId: auction.auctionId,
          tokenId: artwork.tokenId,
          contractAddress: artwork.contractAddress,
          seller: auction.seller,
          buyer: auction.highestBidder,
          settler: publicAddress,
        },
      });

      await router.push({
        pathname: submittedRoute,
        query: { txHash: res.hash },
      });
    },
  });

  const handleSubmit = useCallback(
    async (values: SettleFormValues) => {
      return await finalizeReserveAuction({
        auctionId: values.auctionId,
      });
    },
    [finalizeReserveAuction]
  );

  return (
    <Formik<SettleFormValues>
      enableReinitialize
      onSubmit={handleSubmit}
      initialValues={{ auctionId: auction.auctionId }}
    >
      <Form>
        {cond([
          [
            () => isAuctionFinalized,
            () => (
              <TransactionContent
                title="Auction settled"
                description="The auction for this NFT has already been settled."
              >
                <Link href="/">
                  <a style={{ display: 'block', textDecoration: 'none' }}>
                    <SubmitButton
                      type="button"
                      color="black"
                      shape="regular"
                      size="large"
                      hoverable
                    >
                      Back home
                    </SubmitButton>
                  </a>
                </Link>
              </TransactionContent>
            ),
          ],
          [
            () => isLoading || isSuccess,
            () => <TransactionAwaitingConfirmation />,
          ],
          [
            () => isAuctionWinner,
            () => (
              <TransactionContent
                title="Settle auction"
                description="Congratulations, you won the auction for this NFT. Settle the auction to add it to your collection."
              >
                <TransactionSubmitButton
                  label="Settle"
                  submittingLabel="Settled…"
                  submittedLabel="Settled"
                />
                <Paragraph css={{ color: '$black50' }}>
                  Settling the auction will release funds from escrow to the
                  original owner.
                </Paragraph>
              </TransactionContent>
            ),
          ],
          [
            () => isAuctionCreator || isAuctionOwner,
            () => (
              <TransactionContent
                title="Settle auction"
                description="The auction for your NFT has ended, and you can now claim the ETH from the sale."
              >
                <TransactionSubmitButton
                  label="Settle"
                  submittingLabel="Settled…"
                  submittedLabel="Settled"
                />
                <Paragraph css={{ color: '$black50' }}>
                  Settling the auction will release the NFT from escrow,
                  transferring it to the collector.
                </Paragraph>
              </TransactionContent>
            ),
          ],
          [T, () => null],
        ])()}
      </Form>
    </Formik>
  );
}
