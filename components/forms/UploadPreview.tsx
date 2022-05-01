import { memo, ReactNode } from 'react';
import isImage from 'is-image';

import Flex from 'components/base/Flex';
import Box from 'components/base/Box';
import Text from 'components/base/Text';

import SuccessIcon from 'assets/icons/success-icon.svg';
import SpinnerStroked from 'components/SpinnerStroked';

import { notEmpty } from 'utils/helpers';
import { isVideo } from 'utils/assets';
import { CSS } from 'stitches.config';

interface UploadPreviewImageProps {
  image: string;
  css?: CSS;
  size?: number;
  isLoading: boolean;
}

export function UploadPreviewImage(
  props: UploadPreviewImageProps
): JSX.Element {
  const { image, css, size = 72, isLoading } = props;

  return (
    <Flex
      css={{
        position: 'relative',
        minWidth: size,
        minHeight: size,
        maxWidth: size,
        maxHeight: size,
        ...(css as any),
      }}
    >
      <RenderImage image={image} isLoading={isLoading} />
      <Box
        css={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        {isLoading ? (
          <Box css={{ minWidth: 28, minHeight: 28 }}>
            <SpinnerStroked size={28} />
          </Box>
        ) : (
          <SuccessIcon
            style={{ display: 'block', width: '32px', height: '32px' }}
          />
        )}
      </Box>
    </Flex>
  );
}

interface PreviewBoxProps {
  children: ReactNode;
}

export function PreviewBox(props: PreviewBoxProps): JSX.Element {
  const { children } = props;
  return (
    <Flex
      css={{
        boxShadow: '$1',
        borderRadius: '$2',
        alignItems: 'center',
        background: '$white100',
        padding: 20,
        minHeight: 115,
        minWidth: 0,
      }}
    >
      {children}
    </Flex>
  );
}

interface FileNameProps {
  children: ReactNode;
  isLoading: boolean;
  onDelete: () => void;
}

export function FileName(props: FileNameProps): JSX.Element {
  const { children, isLoading, onDelete } = props;
  return (
    <Box css={{ minWidth: 0 }}>
      <Text
        weight={600}
        css={{
          minWidth: 0,
          marginBottom: '$2',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {children}
      </Text>
      {isLoading ? (
        <Text>Uploading…</Text>
      ) : (
        <Text css={{ color: '$black50', cursor: 'pointer' }} onClick={onDelete}>
          Delete
        </Text>
      )}
    </Box>
  );
}

interface RenderImageProps {
  isLoading: boolean;
  image: string;
}

const RenderImage = memo((props: RenderImageProps) => {
  const { isLoading, image } = props;

  if (isVideo(image)) {
    return (
      <Box
        as="video"
        src={image}
        autoPlay
        muted
        playsInline
        loop
        css={{
          borderRadius: '$2',
          objectFit: 'cover',
          position: 'relative',
          zIndex: 1,
        }}
      />
    );
  }

  if (isImage(image) || notEmpty(image)) {
    return (
      <Box
        style={{ backgroundImage: `url(${image})` }}
        css={{
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: isLoading ? 0.4 : 1,
          borderRadius: 8,
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1,
        }}
      />
    );
  }

  return (
    <Box
      css={{
        background: '$black5',
        borderRadius: '$2',
        width: '100%',
        height: '100%',
      }}
    />
  );
});
