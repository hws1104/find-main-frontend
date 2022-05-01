import format from 'date-fns/fp/format';

import { BidFragment } from 'graphql/hasura/hasura-fragments.generated';

import { formatETHWithSuffix } from 'utils/formatters';
import { parseUnixTimestamp } from 'utils/dates/dates';

import SuccessIcon from 'assets/icons/tx-success.svg';
import ErrorIcon from 'assets/icons/error-icon.svg';

import ETHinUSD from 'components/ETHinUSD';
import BidActionTitle from './BidActionTitle';
import Icon from 'components/Icon';
import Box from 'components/base/Box';
import Flex from 'components/base/Flex';
import ActivityButtonLink from 'components/activity/ActivityButtonLink';
import { ActivityMetaPrimary } from 'components/activity/ActivityMetaPrimary';

interface BidAuctionStatusProps {
  bid: BidFragment;
  artworkPath: string;
  isHighestBid: boolean;
}

export function BidAuctionStatus(props: BidAuctionStatusProps): JSX.Element {
  const { bid, artworkPath, isHighestBid } = props;

  return (
    <Box>
      <Box css={{ marginBottom: '$4' }}>
        <Flex
          expandVertical
          css={{
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '$4',
          }}
        >
          {isHighestBid ? <BidStatusHighest /> : <BidStatusOutbid />}
          <ActivityMetaPrimary
            title="Your bid"
            label={<ETHinUSD amount={bid.bidAmount} />}
            value={formatETHWithSuffix(bid.bidAmount)}
          />
        </Flex>
      </Box>

      <ActivityButtonLink color="white" href={artworkPath}>
        View NFT
      </ActivityButtonLink>
    </Box>
  );
}

function BidStatusHighest(): JSX.Element {
  return (
    <Flex css={{ alignItems: 'center', color: '$green100' }}>
      <Icon icon={SuccessIcon} width={20} height={20} />
      <BidActionTitle alignment="right">You’re winning!</BidActionTitle>
    </Flex>
  );
}

function BidStatusOutbid(): JSX.Element {
  return (
    <Flex css={{ alignItems: 'center', color: '$red100' }}>
      <Icon icon={ErrorIcon} width={20} height={20} />
      <BidActionTitle alignment="right">Outbid</BidActionTitle>
    </Flex>
  );
}

interface BidAuctionEndedInfoProps {
  dateEnding: number;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export function BidAuctionEndedInfo(props: BidAuctionEndedInfoProps) {
  const { dateEnding } = props;

  const parsedDate = parseUnixTimestamp(dateEnding);

  return (
    <ActivityMetaPrimary
      title="Auction ended"
      value={format('MMM dd', parsedDate)}
      label={format('yyyy', parsedDate)}
    />
  );
}
