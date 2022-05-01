import Text from 'components/base/Text';
import Box from 'components/base/Box';
import Pulse from 'components/Pulse';
import Flex from 'components/base/Flex';
import ETHinUSD from 'components/ETHinUSD';
import ArtworkAuctionInfoHeading from './ArtworkAuctionInfoHeading';
import UserTagInline from 'components/users/UserTagInline';

import {
  SOLD_FOR_LABEL,
  CURRENT_BID_LABEL,
  RESERVE_PRICE_LABEL,
} from 'lib/constants';

import { formatETHWithSuffix } from 'utils/formatters';

import { AuctionWithBids } from 'types/Auction';

import { ArtworkFragmentExtended } from 'graphql/hasura/hasura-fragments.generated';

interface ArtworkAuctionPriceProps {
  label: string;
  amountInETH: number | string;
  artwork: ArtworkFragmentExtended;
  auction?: AuctionWithBids;
}

export default function ArtworkAuctionPrice(
  props: ArtworkAuctionPriceProps
): JSX.Element {
  const { artwork, label, amountInETH, auction } = props;

  return (
    <Flex css={{ flexDirection: 'column', minWidth: 0 }}>
      <Text
        size={1}
        weight={600}
        css={{ marginBottom: '$1', color: '$black60', whiteSpace: 'nowrap' }}
      >
        {label === CURRENT_BID_LABEL && (
          <Box css={{ display: 'inline-block', marginRight: '$3' }}>
            <Pulse size={12} />
          </Box>
        )}
        {label}
      </Text>
      <ArtworkAuctionInfoHeading>
        {formatETHWithSuffix(Number(amountInETH))}
      </ArtworkAuctionInfoHeading>
      {label === SOLD_FOR_LABEL && (
        <Text
          size={1}
          weight={600}
          css={{ marginBottom: '$1', color: '$black60' }}
        >
          <ETHinUSD amount={amountInETH} />
        </Text>
      )}
      {label === CURRENT_BID_LABEL && (
        <Box css={{ minWidth: 0, overflow: 'hidden', zIndex: 2 }}>
          <UserTagInline user={auction?.highestBidderUser} avatarSize={22} />
        </Box>
      )}
      {label === RESERVE_PRICE_LABEL && (
        <Flex css={{ marginTop: '$3', alignItems: 'center' }}>
          <Text
            size={1}
            weight={600}
            css={{ marginRight: '$2', color: '$black60' }}
          >
            Listed by
          </Text>

          <UserTagInline user={artwork?.owner} avatarSize={22} />
        </Flex>
      )}
    </Flex>
  );
}
