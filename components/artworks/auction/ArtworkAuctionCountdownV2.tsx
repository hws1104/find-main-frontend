import { length } from 'ramda';

import useCountdown from 'hooks/use-countdown';

import Box from 'components/base/Box';
import Grid from 'components/base/Grid';
import {
  ActivityMetaLabel,
  ActivityMetaValue,
} from 'components/activity/ActivityMetaPrimary';

interface ArtworkAuctionCountdownTimerProps {
  timestamp: number;
  className?: string;
}

export default function ArtworkAuctionCountdownTimerV2(
  props: ArtworkAuctionCountdownTimerProps
): JSX.Element {
  const { timestamp, className } = props;

  const { countdownParts, hasEnded } = useCountdown(timestamp);

  if (hasEnded) {
    return (
      <Box className={className}>
        <ActivityMetaValue>—</ActivityMetaValue>
        <ActivityMetaLabel css={{ color: '$black60' }}>
          Auction has ended
        </ActivityMetaLabel>
      </Box>
    );
  }

  return (
    <Grid
      css={{
        gap: '$2',
        gridTemplateColumns: `repeat(${length(countdownParts)}, 70px)`,
      }}
    >
      {countdownParts.map((part, key) => (
        <Box key={key}>
          <ActivityMetaValue>{part.value}</ActivityMetaValue>
          <ActivityMetaLabel>{part.label}</ActivityMetaLabel>
        </Box>
      ))}
    </Grid>
  );
}
