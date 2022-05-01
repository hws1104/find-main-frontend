import { length } from 'ramda';
import format from 'date-fns/format';

import Box from 'components/base/Box';
import Grid from 'components/base/Grid';

import {
  ActivityMetaLabel,
  ActivityMetaValue,
} from 'components/activity/ActivityMetaPrimary';

import useCountdown from 'hooks/use-countdown';
import { parseDateToUnix } from 'utils/dates/dates';

interface PrivateSaleCountdownProps {
  timestamp: string;
}

// This can probably be generalised into a component for other uses

export default function PrivateSaleCountdown(
  props: PrivateSaleCountdownProps
): JSX.Element {
  const { timestamp } = props;

  const convertedTimestamp = parseDateToUnix(timestamp);

  const { countdownParts, hasEnded } = useCountdown(convertedTimestamp);

  if (!convertedTimestamp) {
    return null;
  }

  const date = new Date(`${timestamp}Z`);

  const formattedDate = format(date, 'LLL d y');
  const formattedTime = format(date, 'h:mm aaa');

  if (hasEnded) {
    return (
      <Box>
        <ActivityMetaValue>{formattedDate}</ActivityMetaValue>
        <ActivityMetaLabel>at {formattedTime}</ActivityMetaLabel>
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
