import Grid from 'components/base/Grid';
import SplitsBreakdownRow from './SplitsBreakdownRow';

import { ArtworkPageSplitRecipient } from 'queries/server/artwork-page';

interface SplitsBreakdownProps {
  splits: ArtworkPageSplitRecipient[];
}

export default function SplitsBreakdown(
  props: SplitsBreakdownProps
): JSX.Element {
  const { splits } = props;
  return (
    <Grid css={{ gap: '$7' }}>
      {splits.map((split, index) => (
        <SplitsBreakdownRow
          key={split.user.publicKey}
          split={split}
          index={index}
        />
      ))}
    </Grid>
  );
}
