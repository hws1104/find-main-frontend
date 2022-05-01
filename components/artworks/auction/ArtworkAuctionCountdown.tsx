import { length, cond, T } from 'ramda';

import { whenMinsLessThan } from 'utils/dates/dates';
import useCountdown from 'hooks/use-countdown';

import { ArtworkAuctionBidActionProps } from './types';

import ArtworkAuctionInfoHeading from './ArtworkAuctionInfoHeading';
import { ArtworkInfoHeading } from '../ArtworkInfo';
import Grid from 'components/base/Grid';
import Text from 'components/base/Text';
import Box from 'components/base/Box';
import Flex from 'components/base/Flex';

export const renderArtworkAuctionCountdown = cond<any, JSX.Element>([
  [
    (auction: ArtworkAuctionBidActionProps) => whenMinsLessThan(2, auction),
    ArtworkAuctionFinalTwoMins,
  ],
  [
    (auction: ArtworkAuctionBidActionProps) => whenMinsLessThan(15, auction),
    ArtworkAuctionFinalFifteenMins,
  ],
  [T, ArtworkAuctionCountdown],
]);

function ArtworkAuctionFinalFifteenMins(props: ArtworkAuctionBidActionProps) {
  const { endDate } = props;
  return (
    <Flex css={{ justifyContent: 'space-between', flexDirection: 'column' }}>
      <Text size={0} weight={600} css={{ marginBottom: '$1' }}>
        This auction is ending soon!
      </Text>
      <Box>
        <ArtworkAuctionCountdownTimer timestamp={endDate} />
      </Box>
    </Flex>
  );
}

function ArtworkAuctionFinalTwoMins() {
  return (
    <Grid>
      <Text size={1} weight={600} css={{ marginBottom: '$1' }}>
        This auction is ending very soon!
      </Text>
      <Text size={0} css={{ color: '$black60', alignSelf: 'center' }}>
        If you were to place a bid at this time there is a high chance that it
        would result in an error.
      </Text>
    </Grid>
  );
}

export default function ArtworkAuctionCountdown(
  props: Pick<ArtworkAuctionBidActionProps, 'endDate'>
): JSX.Element {
  const { endDate } = props;

  return (
    <Box>
      <ArtworkInfoHeading spacing="regular">Auction ends in</ArtworkInfoHeading>
      <ArtworkAuctionCountdownTimer timestamp={endDate} />
    </Box>
  );
}

interface ArtworkAuctionCountdownTimerProps {
  timestamp: number;
  className?: string;
}

function ArtworkAuctionCountdownTimer(
  props: ArtworkAuctionCountdownTimerProps
): JSX.Element {
  const { timestamp, className } = props;

  const { countdownParts, hasEnded } = useCountdown(timestamp);

  if (hasEnded) {
    return (
      <Box className={className}>
        <ArtworkAuctionInfoHeading>—</ArtworkAuctionInfoHeading>
        <Text size={1} weight={600} css={{ marginBottom: '$1' }}>
          Auction has ended
        </Text>
      </Box>
    );
  }

  return (
    <Grid
      css={{
        gridGap: '$4',
        gridTemplateColumns: `repeat(${length(countdownParts)}, 65px)`,
      }}
      className={className}
    >
      {countdownParts.map((part, key) => (
        <Box key={key}>
          <ArtworkAuctionInfoHeading>{part.value}</ArtworkAuctionInfoHeading>
          <Text size={1} weight={600} css={{ color: '$black60' }}>
            {part.label}
          </Text>
        </Box>
      ))}
    </Grid>
  );
}
