import NextLink from 'next/link';
import { cond, T, always } from 'ramda';

import { whenMinsLessThan } from 'utils/dates/dates';

import ArtworkAuctionPrice from './ArtworkAuctionPrice';
import { renderBidStatus } from './ArtworkAuctionBidStatus';

import { ArtworkAuctionBidActionProps } from './types';
import Box from 'components/base/Box';
import Button from 'components/base/Button';
import Link from 'components/base/Link';
import Grid from 'components/base/Grid';

// conditionally render outbid status when <2 minutes remaining
export const renderAuctionBidButton = cond<
  ArtworkAuctionBidActionProps,
  JSX.Element
>([
  [
    (bid: ArtworkAuctionBidActionProps) => whenMinsLessThan(2, bid),
    always(
      <Button
        appearance="outline"
        color="black"
        shape="regular"
        size="large"
        css={{ width: '100%', whiteSpace: 'nowrap' }}
      >
        I understand, let me bid anyway
      </Button>
    ),
  ],

  [
    T,
    always(
      <Button
        hoverable
        color="black"
        size="large"
        shape="regular"
        css={{ width: '100%', whiteSpace: 'nowrap' }}
      >
        Place a bid
      </Button>
    ),
  ],
]);

function ArtworkAuctionBidButton(
  props: ArtworkAuctionBidActionProps
): JSX.Element {
  const { bidPath } = props;

  return (
    <Box css={{ marginTop: 'auto' }}>
      <NextLink href={bidPath} passHref prefetch={false}>
        <Link css={{ display: 'block', textDecoration: 'none' }}>
          {renderAuctionBidButton(props)}
        </Link>
      </NextLink>
    </Box>
  );
}

export default function ArtworkAuctionBidAction(
  props: ArtworkAuctionBidActionProps
): JSX.Element {
  const {
    artwork,
    currentUserBid,
    minutesRemaining,
    bidPath,
    isCurrentUserHighestBidder,
  } = props;

  if (currentUserBid) {
    return (
      <Box>
        <Grid
          css={{
            paddingTop: '$6',
            borderTop: '1px solid $black10',
            gridTemplateColumns: '1fr 1fr',
            gridGap: '$5',
          }}
        >
          <ArtworkAuctionPrice
            label="Your Bid"
            artwork={artwork}
            amountInETH={currentUserBid.bidAmount}
          />
          {renderBidStatus({
            minutesRemaining,
            currentUserBid,
            isCurrentUserHighestBidder,
            bidPath,
          })}
        </Grid>
      </Box>
    );
  }

  return <ArtworkAuctionBidButton {...props} />;
}
