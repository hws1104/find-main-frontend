import Heading from 'components/base/Heading';
import Paragraph from 'components/base/Paragraph';
import Flex from 'components/base/Flex';
import Button from 'components/base/Button';

interface DropzoneDuplicateUploadProps {
  onReset: () => void;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function DropzoneDuplicateUpload(
  props: DropzoneDuplicateUploadProps
) {
  const { onReset } = props;

  return (
    <Flex css={{ flexDirection: 'column' }} center expandVertical>
      <Flex
        css={{
          color: '$black100',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: 420,
          textAlign: 'center',
        }}
      >
        <Heading size={4} css={{ marginBottom: '$4' }}>
          You’ve already minted this artwork as an NFT.
        </Heading>
        <Paragraph css={{ marginBottom: '$7' }}>
          On Foundation, each NFT is a unique 1/1 — we do not support an artwork
          being uploaded multiple times.
        </Paragraph>
        <Button
          hoverable
          color="black"
          size="large"
          shape="regular"
          css={{ width: 180 }}
          onClick={onReset}
        >
          Back
        </Button>
      </Flex>
    </Flex>
  );
}
