import { SquareAvatar } from 'components/base/Avatar';
import Card from 'components/base/Card';
import Text from 'components/base/Text';
import TextLink from 'components/base/TextLink';

import { styled } from 'stitches.config';

interface DropzonePreviewProps {
  previewImage: string;
  fileName: string;
  onDelete: () => void;
}
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function DropzonePreview(props: DropzonePreviewProps) {
  const { previewImage, fileName, onDelete } = props;
  return (
    <PreviewFileUpload>
      <SquareAvatar imageUrl={previewImage} size={60} shape={1} />
      <Text
        css={{ marginX: '$5', wordBreak: 'break-word' }}
        size={1}
        weight={600}
      >
        {fileName}
      </Text>
      <TextLink as="div" css={{ marginLeft: 'auto' }} onClick={onDelete}>
        Delete
      </TextLink>
    </PreviewFileUpload>
  );
}

const PreviewFileUpload = styled(Card, {
  display: 'flex',
  borderRadius: '$2',
  height: 100,
  alignItems: 'center',
  marginTop: '$3',
  padding: '$5',
});
