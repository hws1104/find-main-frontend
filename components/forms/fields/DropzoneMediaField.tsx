import { useDropzone } from 'react-dropzone';
import { useField } from 'formik';

import Heading from 'components/base/Heading';
import Flex from 'components/base/Flex';
import Paragraph from 'components/base/Paragraph';
import TextLink from 'components/base/TextLink';

import MediaIcons from 'assets/images/media.svg';

import { styled } from 'stitches.config';

import { mimeTypeExtensions } from 'utils/assets';
import { getFileExtension } from 'utils/urls';
import DropzoneContainer from '../DropzoneContainer';

interface DropzoneMediaFieldProps {
  name: string;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function DropzoneMediaField(props: DropzoneMediaFieldProps) {
  const { name } = props;

  const [, , helpers] = useField<File>(name);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: ([file]) => {
      const extensionFallback = getFileExtension(file.name);
      const extension = mimeTypeExtensions[file.type] ?? extensionFallback;

      const renamedFile = new File([file], `nft.${extension}`, {
        type: file.type,
      });

      helpers.setValue(renamedFile);
    },
  });

  return (
    <FlexColumnFullHeight>
      <CustomFileUpload
        {...getRootProps()}
        css={{ width: '100%' }}
        isInteractive
      >
        <Flex
          css={{
            maxWidth: 600,
            textAlign: 'center',
            color: '$black100',
          }}
          expandVertical
          center
        >
          <MediaIcons />
          <Heading size={3} css={{ marginTop: '$7', marginBottom: '$3' }}>
            Upload a media file
          </Heading>
          <Paragraph css={{ maxWidth: 360 }}>
            Drag and drop, or click to upload a JPG, PNG, GIF, SVG, GLTF, GLB,
            MOV, or MP4 file.
          </Paragraph>
          <TextLink
            href="https://help.foundation.app/en/articles/4784859-what-are-the-technical-specs"
            target="_blank"
            rel="noreferrer"
            css={{ marginTop: '$7' }}
          >
            View our recommended file specifications.
          </TextLink>
        </Flex>
        <input {...getInputProps()} />
      </CustomFileUpload>
    </FlexColumnFullHeight>
  );
}

const FlexColumnFullHeight = styled(Flex, {
  position: 'relative',
  flexDirection: 'column',
  alignItems: 'center',
  flexGrow: 1,
  width: '100%',
});

export const CustomFileUpload = styled(DropzoneContainer, {
  paddingY: '$8',
  height: '100%',
});
