import Box from 'components/base/Box';
import TransactionProgressPane from 'components/transactions/generic/TransactionProgressPane';
import TransactionHashLink from 'components/transactions/TransactionHashLink';

interface ListTransactionPendingProps {
  txHash: string;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function ListTransactionPending(
  props: ListTransactionPendingProps
) {
  const { txHash } = props;

  return (
    <TransactionProgressPane
      title="Your NFT is being listed…"
      description={
        <Box css={{ maxWidth: 350 }}>
          Your NFT has been submitted to our marketplace and will be live as
          soon as the transaction is processed. You’re free to leave this page
          if you like.
        </Box>
      }
      status="pending"
      meta={<TransactionHashLink txHash={txHash} />}
    />
  );
}
