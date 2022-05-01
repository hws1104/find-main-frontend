import Badge from 'components/base/Badge';
import Box from 'components/base/Box';
import TransactionProgressPane from 'components/transactions/generic/TransactionProgressPane';

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function MintTransactionAwaiting() {
  return (
    <TransactionProgressPane
      title="Mint your NFT"
      description={
        <Box css={{ maxWidth: 350 }}>
          Confirm this transaction in your wallet to continue, doing this will
          sign your wallet as the original creator of the NFT.
        </Box>
      }
      status="pending"
      meta={<Badge color="gray">Confirm via your wallet…</Badge>}
    />
  );
}
