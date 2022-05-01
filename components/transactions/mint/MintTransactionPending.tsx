import Box from 'components/base/Box';
import TransactionProgressPane from 'components/transactions/generic/TransactionProgressPane';
import TransactionHashLink from 'components/transactions/TransactionHashLink';

interface MintTransactionPendingProps {
  txHash: string;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function MintTransactionPending(
  props: MintTransactionPendingProps
) {
  const { txHash } = props;

  return (
    <TransactionProgressPane
      title="Your NFT is being minted…"
      description={
        <Box css={{ maxWidth: 350 }}>
          Your artwork is being minted as an NFT on the Ethereum blockchain.
          You’re free to leave this page if you like.
        </Box>
      }
      status="pending"
      meta={<TransactionHashLink txHash={txHash} />}
    />
  );
}
