import Box from 'components/base/Box';
import Flex from 'components/base/Flex';
import SpinnerStroked from 'components/SpinnerStroked';
import TransactionContent from './TransactionContent';

export default function TransactionAwaitingConfirmation(): JSX.Element {
  return (
    <TransactionContent
      title="Waiting for confirmation…"
      description={
        <Box css={{ maxWidth: 260 }}>
          Confirm this transaction in your wallet to continue.
        </Box>
      }
    >
      <Flex
        css={{
          marginX: 'auto',
          '@bp1': {
            marginX: 0,
          },
        }}
      >
        <SpinnerStroked size={62} />
      </Flex>
    </TransactionContent>
  );
}
