import Badge from 'components/base/Badge';
import Box from 'components/base/Box';
import TransactionProgressPane from 'components/transactions/generic/TransactionProgressPane';

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function ListTransactionAwaiting() {
  return (
    <TransactionProgressPane
      title="Waiting for confirmation…"
      description={
        <Box css={{ maxWidth: 350 }}>
          Confirm this transaction in your wallet to list your NFT.
        </Box>
      }
      status="pending"
      meta={<Badge color="gray">Confirm via your wallet…</Badge>}
    />
  );
}
