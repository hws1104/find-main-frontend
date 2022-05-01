import { length } from 'ramda';

import Grid from 'components/base/Grid';

import BidActivityCard from 'components/bids/BidActivityCard';
import PrivateSaleActivityCard from 'components/transactions/privateSale/PrivateSaleActivityCard';
import BidActivityCardReceived from './BidActivityCardReceived';
import ActivityEmptyState from 'components/activity/ActivityEmptyState';

import { PrivateSaleFragment } from 'graphql/hasura/hasura-fragments.generated';

import { UserBids } from 'graphql/hasura/queries/user-bids.generated';

interface PrimaryBidsTableProps {
  bids: UserBids['bidsReceived'];
}

export function PrimaryBidsTable(props: PrimaryBidsTableProps): JSX.Element {
  const { bids } = props;

  if (length(bids) === 0) {
    return (
      <ActivityEmptyState
        title="Bids you’ve placed will be shown here"
        description="When you place a bid on an artwork, it will show up here."
      />
    );
  }

  return (
    <Grid css={{ gap: '$7', marginBottom: '$10' }}>
      {bids.map((bid, key) => {
        return (
          <BidActivityCard
            key={key}
            bid={bid}
            auction={bid.auction}
            artwork={bid.artwork}
          />
        );
      })}
    </Grid>
  );
}

interface SecondaryBidsTableProps {
  bids: UserBids['bidsReceived'];
}

export function SecondaryBidsTable(
  props: SecondaryBidsTableProps
): JSX.Element {
  const { bids } = props;

  if (length(bids) === 0) {
    return (
      <ActivityEmptyState
        title="Bids you’ve received will be shown here"
        description="When you receive a bid on an artwork, it will show up here."
      />
    );
  }

  return (
    <Grid css={{ gap: '$7', marginBottom: '$10' }}>
      {bids.map((bid, key) => (
        <BidActivityCardReceived
          key={key}
          bid={bid}
          auction={bid.auction}
          artwork={bid.artwork}
        />
      ))}
    </Grid>
  );
}

interface PrivateSalesTableProps {
  privateSales: PrivateSaleFragment[];
  type: 'sent' | 'received';
}

export function PrivateSalesTable(props: PrivateSalesTableProps): JSX.Element {
  const { privateSales, type } = props;

  const noPrivateSales = length(privateSales) === 0;

  if (noPrivateSales) {
    return (
      <ActivityEmptyState
        title="Private sales will be shown here"
        description={
          type === 'received'
            ? `When you receive a private sale for an artwork, it will show up
            here.`
            : `When you send a private sale for an artwork, it will show up
            here.`
        }
      />
    );
  }

  return (
    <Grid css={{ gap: '$7', marginBottom: '$10' }}>
      {privateSales.map((privateSale) => (
        <PrivateSaleActivityCard
          key={privateSale.artwork.tokenId}
          privateSale={privateSale}
          artwork={privateSale.artwork}
          type={type}
        />
      ))}
    </Grid>
  );
}
