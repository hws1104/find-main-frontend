import { ReactNode } from 'react';

import Grid from 'components/base/Grid';
import Text from 'components/base/Text';
import HistoryEventDate from './HistoryEventDate';

interface HistoryEventDetailsProps {
  date: string;
  children: ReactNode;
}

export default function HistoryEventDetails(
  props: HistoryEventDetailsProps
): JSX.Element {
  const { children, date } = props;

  return (
    <Grid
      css={{
        lineHeight: 1.4,
        gridGap: '$1',
        marginRight: '$7',
        '@bp1': {
          marginRight: 0,
          gridGap: '2px',
        },
      }}
    >
      <Text
        weight={600}
        size={{ '@initial': 0, '@bp0': 1 }}
        // TO DO: update PopoverCard to stitches
        css={{ ' > div': { display: 'inline-block' } }}
      >
        {children}
      </Text>
      <HistoryEventDate date={date} />
    </Grid>
  );
}
