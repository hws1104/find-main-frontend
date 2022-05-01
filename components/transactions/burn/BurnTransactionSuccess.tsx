import Flex from 'components/base/Flex';
import Box from 'components/base/Box';

import TransactionHashLink from 'components/transactions/TransactionHashLink';
import TransactionSuccessLink from 'components/transactions/TransactionSuccessLink';
import TransactionContent from '../TransactionContent';

import { BurnTransactionProps } from 'components/transactions/burn/types';

interface BurnTransactionSuccessProps extends BurnTransactionProps {
  isBurned: boolean;
  profilePath: string;
}

export default function BurnTransactionSuccess(
  props: Omit<BurnTransactionSuccessProps, 'artwork'>
): JSX.Element {
  const { txHash, isBurned, profilePath } = props;

  return (
    <TransactionContent
      title="This NFT has been burned."
      description="This NFT has been successfully burned, and it will no longer be displayed on Foundation."
    >
      <Box css={{ width: '100%', '@bp1': { maxWidth: 280 } }}>
        <TransactionSuccessLink href={profilePath} isLoading={!isBurned}>
          Back to profile
        </TransactionSuccessLink>
      </Box>

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
    </TransactionContent>
  );
}
