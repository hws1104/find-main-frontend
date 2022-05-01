import Box from 'components/base/Box';
import Button from 'components/base/Button';
import TransactionContent from '../TransactionContent';

interface UnlistViewProps {
  onSubmit: () => void;
}

export default function UnlistView(props: UnlistViewProps): JSX.Element {
  const { onSubmit } = props;

  return (
    <TransactionContent
      title="Unlist this NFT"
      description={`Unlisting an NFT will remove the NFT from escrow and return it to your wallet. Please note—even when unlisted, this artwork will still remain on your profile. If you'd like to remove it, you will need to burn it.`}
    >
      <Box css={{ '@bp1': { maxWidth: 280 } }}>
        <Button
          color="black"
          shape="regular"
          size="large"
          css={{ width: '100%' }}
          hoverable
          onClick={onSubmit}
        >
          Continue
        </Button>
      </Box>
    </TransactionContent>
  );
}
