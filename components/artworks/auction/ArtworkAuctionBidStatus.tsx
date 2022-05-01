import NextLink from 'next/link';
import { cond, always, T } from 'ramda';

import { whenMinsLessThan } from 'utils/dates/dates';

import SuccessIcon from 'assets/icons/tx-success.svg';
import ErrorIcon from 'assets/icons/error-icon.svg';

import { BidFragment } from 'graphql/hasura/hasura-fragments.generated';

import Flex from 'components/base/Flex';
import Button from 'components/base/Button';
import Link from 'components/base/Link';
import Grid from 'components/base/Grid';
import Heading from 'components/base/Heading';

interface BidStatusProps {
  minutesRemaining: number;
  bidPath: string;
  isCurrentUserHighestBidder: boolean;
  currentUserBid: BidFragment;
}

// conditionally render outbid status when <2 minutes remaining
const renderOutbidBidStatus = cond<BidStatusProps, JSX.Element>([
  [
    (bid: BidStatusProps) => whenMinsLessThan(2, bid),
    OutbidBidStatusWithWarning,
  ],
  [T, OutbidBidStatus],
]);

// conditionally render bid info based on status
export const renderBidStatus = cond<BidStatusProps, JSX.Element>([
  [(bid: BidStatusProps) => bid.isCurrentUserHighestBidder, HighestBidStatus],
  [(bid: BidStatusProps) => Boolean(bid.currentUserBid), renderOutbidBidStatus],
  [T, always(null)],
]);

function HighestBidStatus() {
  return (
    <Flex css={{ alignItems: 'center', color: '$green100' }}>
      <Heading
        size={{ '@initial': 2, '@bp4': 3 }}
        css={{ marginRight: '$3', maxWidth: 180, textAlign: 'right' }}
      >
        You’re the highest bidder!
      </Heading>
      <SuccessIcon width={42} height={42} style={{ display: 'block' }} />
    </Flex>
  );
}

function OutbidBidStatusWithWarning(props: BidStatusProps) {
  const { bidPath } = props;
  return (
    <Grid css={{ gridGap: '$4' }}>
      <NextLink href={bidPath} passHref>
        <Link
          css={{
            display: 'block',
            textDecoration: 'none',
            backgroundColor: 'inherit',
          }}
        >
          <Button
            hoverable
            size="medium"
            appearance="outline"
            shape="regular"
            color="black"
          >
            I understand, let me bid again
          </Button>
        </Link>
      </NextLink>
    </Grid>
  );
}

function OutbidBidStatus(props: BidStatusProps) {
  const { bidPath } = props;
  return (
    <Grid css={{ gridGap: '$4', justifyContent: 'flex-end' }}>
      <OutbidIconLabel />
      <NextLink href={bidPath} passHref>
        <Link style={{ display: 'block', textDecoration: 'none' }}>
          <Button
            hoverable
            size="medium"
            shape="regular"
            color="black"
            css={{
              '@bp2': {
                minWidth: 240,
              },
            }}
          >
            Bid again
          </Button>
        </Link>
      </NextLink>
    </Grid>
  );
}

function OutbidIconLabel() {
  return (
    <Flex
      css={{
        alignItems: 'center',
        justifyContent: 'flex-end',
        color: '$red100',
      }}
    >
      <Heading size={2} css={{ marginRight: '$4' }}>
        Outbid
      </Heading>
      <ErrorIcon width={26} height={26} style={{ display: 'block' }} />
    </Flex>
  );
}
