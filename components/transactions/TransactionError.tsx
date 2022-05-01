import Grid from 'components/base/Grid';
import Button from 'components/base/Button';
import Box from 'components/base/Box';
import TransactionContent from './TransactionContent';
import Mono from 'components/base/Mono';

interface TransactionError {
  message: string;
  operation?: string;
}

interface TransactionErrorProps {
  error: TransactionError;
  resetTransaction: () => void;
}

export function TransactionError(props: TransactionErrorProps): JSX.Element {
  const { error, resetTransaction } = props;

  // TODO: DRY this up with the component above
  let errorMsg: string;
  if (error?.operation === 'getAddress') {
    errorMsg = 'You need to enter your password in MetaMask first.';
  }

  return (
    <TransactionContent
      title="There was an error with your transaction."
      description="There was an error with your transaction."
    >
      <Grid css={{ gap: '$6' }}>
        <Box css={{ overflow: 'scroll', maxHeight: 220 }}>
          <Mono size={0} css={{ color: '$red100', lineHeight: '$body' }}>
            {errorMsg ?? error.message.toString()}
          </Mono>
        </Box>

        <Box css={{ maxWidth: 300 }}>
          <Button
            size="large"
            color="black"
            shape="regular"
            onClick={resetTransaction}
            css={{ width: '100%' }}
          >
            Retry
          </Button>
        </Box>
      </Grid>
    </TransactionContent>
  );
}
