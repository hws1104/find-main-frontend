import Grid from 'components/base/Grid';
import Flex from 'components/base/Flex';

import SpinnerStroked from 'components/SpinnerStroked';
import TransactionHashLink from './TransactionHashLink';

interface TransactionPendingStateProps {
  txHash: string;
}

export default function TransactionPendingState(
  props: TransactionPendingStateProps
): JSX.Element {
  const { txHash } = props;
  return (
    <Grid css={{ gap: '$6', '@bp1': { gap: '$7' } }}>
      <Flex
        css={{
          justifyContent: 'center',
          '@bp1': {
            justifyContent: 'flex-start',
          },
        }}
      >
        <TransactionHashLink txHash={txHash} />
      </Flex>
      <Flex
        css={{
          justifyContent: 'center',
          '@bp1': {
            justifyContent: 'flex-start',
          },
        }}
      >
        <SpinnerStroked size={62} />
      </Flex>
    </Grid>
  );
}
