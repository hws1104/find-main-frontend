import Box from 'components/base/Box';
import Button from 'components/base/Button';
import TransactionProgressPane from 'components/transactions/generic/TransactionProgressPane';

interface ListTransactionErrorProps {
  error: Error;
  onReset: () => void;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function ListTransactionError(props: ListTransactionErrorProps) {
  const { onReset } = props;

  // TODO: handle rendering of errors in here (using a getter fn)

  return (
    <TransactionProgressPane
      title="An error occurred"
      description={
        <Box css={{ maxWidth: 350 }}>
          Unfortunately there was an error while trying to list your NFT.
        </Box>
      }
      status="error"
      meta={
        <Button
          type="button"
          hoverable
          color="black"
          size="large"
          shape="regular"
          onClick={onReset}
          css={{ width: '100%' }}
        >
          Try again
        </Button>
      }
    />
  );
}
