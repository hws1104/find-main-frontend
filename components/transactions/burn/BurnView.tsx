import Box from 'components/base/Box';
import Button from 'components/base/Button';

import TransactionContent from '../TransactionContent';

interface BurnViewProps {
  onSubmit: () => void;
}

export default function BurnView(props: BurnViewProps): JSX.Element {
  const { onSubmit } = props;

  return (
    <TransactionContent
      title="Burn this NFT"
      description="Burning an NFT destroys the NFT and removes it from your creator profile. Please note, this action cannot be reversed."
    >
      <Box css={{ '@bp1': { maxWidth: 280 } }}>
        <Button
          color="black"
          size="large"
          shape="regular"
          css={{ width: '100%' }}
          onClick={onSubmit}
        >
          Burn NFT
        </Button>
      </Box>
    </TransactionContent>
  );
}
