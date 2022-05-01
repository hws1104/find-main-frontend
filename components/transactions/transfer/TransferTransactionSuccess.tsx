import Box from 'components/base/Box';

import TransactionHashLink from 'components/transactions/TransactionHashLink';
import TransactionSuccessLink from 'components/transactions/TransactionSuccessLink';
import TransactionContent from 'components/transactions/TransactionContent';
import FlexContainer from '../TransactionFlexContainer';

import { TransferTransactionProps } from 'components/transactions/transfer/types';

interface TransferTransactionSuccessProps
  extends Pick<TransferTransactionProps, 'txHash'> {
  artworkPath: string;
  status: string;
}

export default function TransferTransactionSuccess(
  props: TransferTransactionSuccessProps
): JSX.Element {
  const { txHash, artworkPath } = props;

  return (
    <TransactionContent
      title="This NFT has been transferred."
      description="This NFT has been successfully transferred to the new owner."
    >
      <Box css={{ '@bp1': { maxWidth: 280 } }}>
        <TransactionSuccessLink href={artworkPath}>
          View artwork
        </TransactionSuccessLink>
      </Box>

      <FlexContainer>
        <TransactionHashLink txHash={txHash} />
      </FlexContainer>
    </TransactionContent>
  );
}
