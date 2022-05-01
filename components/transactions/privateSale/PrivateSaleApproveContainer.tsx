import Box from 'components/base/Box';
import Button from 'components/base/Button';

import TransactionContent from '../TransactionContent';

interface PrivateSaleApproveContainerProps {
  onSubmit: () => void;
}

export default function PrivateSaleApproveContainer(
  props: PrivateSaleApproveContainerProps
): JSX.Element {
  const { onSubmit } = props;

  return (
    <TransactionContent
      title="Approve the auction contract."
      description="Approval is required each time you interact with a new NFT contract."
    >
      <Box css={{ maxWidth: 260 }}>
        <Button
          size="large"
          color="black"
          shape="regular"
          css={{ width: '100%' }}
          onClick={onSubmit}
        >
          Approve
        </Button>
      </Box>
    </TransactionContent>
  );
}
