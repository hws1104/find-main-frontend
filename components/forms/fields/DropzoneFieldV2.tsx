import { DropzoneOptions, useDropzone } from 'react-dropzone';
import { useField } from 'formik';
import { useState } from 'react';

import Box from 'components/base/Box';
import Text from 'components/base/Text';
import SpinnerStroked from 'components/SpinnerStroked';
import DropzoneContainer from '../DropzoneContainer';
import DropzoneInstructions from '../DropzoneInstructions';
import DropzonePreview from '../DropzonePreview';
import TextLink from 'components/base/TextLink';

import useFileUploadS3 from 'hooks/mutations/server/use-file-upload-s3';

import { getFirstValue } from 'utils/helpers';
import { buildAvatarUrl } from 'utils/assets';

import { S3AssetBucket } from 'types/Assets';

import { styled } from 'stitches.config';

const FILE_TOO_LARGE = 'file-too-large';

interface DropzoneFieldV2Props extends DropzoneOptions {
  label: string;
  name: string;
  bucket: S3AssetBucket;
}

export default function DropzoneFieldV2(
  props: DropzoneFieldV2Props
): JSX.Element {
  const {
    label,
    name,
    accept = 'image/jpeg, image/jpg, image/png, image/gif',
    maxSize = 2000000,
    bucket,
  } = props;

  const [field, fieldMeta, helpers] = useField<string>(name);
  const [filename, setFilename] = useState(null);

  const { mutateAsync, isLoading } = useFileUploadS3({
    onSuccess: (res) => {
      helpers.setValue(res.url);
    },
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    maxSize,
    onDropAccepted: ([file]) => {
      setFilename(file.name);
      mutateAsync({ file, bucket });
    },
    onDropRejected: ([err]) => {
      const error = getFirstValue(err.errors);
      if (error.code === FILE_TOO_LARGE) {
        helpers.setError(error.code);
      }
    },
  });

  const previewImage = buildAvatarUrl(60, field.value);

  if (fieldMeta.error === FILE_TOO_LARGE) {
    return (
      <Box>
        <DropzoneFieldLabel name={name} label={label} />
        <CustomFileUpload css={{ flexDirection: 'column' }}>
          <Text css={{ color: '$red100', marginBottom: '$1' }}>
            File is too large.
          </Text>
          <TextLink
            as="div"
            css={{ fontWeight: 500 }}
            onClick={() => helpers.setError(null)}
          >
            Retry
          </TextLink>
        </CustomFileUpload>
      </Box>
    );
  }

  return (
    <Box css={{ cursor: isLoading ? 'wait' : 'unset' }}>
      <Box css={{ pointerEvents: isLoading ? 'none' : 'all' }}>
        <DropzoneFieldLabel name={name} label={label} />
        {previewImage ? (
          <DropzonePreview
            previewImage={previewImage}
            onDelete={() => helpers.setValue('')}
            fileName={filename}
          />
        ) : (
          <>
            <CustomFileUpload
              {...getRootProps()}
              isActive={isDragActive}
              isInteractive
            >
              {isLoading ? (
                <Box css={{ color: '$black100' }}>
                  <SpinnerStroked size={24} />
                </Box>
              ) : (
                <DropzoneInstructions isDragActive={isDragActive} />
              )}
            </CustomFileUpload>
            <input {...getInputProps()} />
          </>
        )}
      </Box>
    </Box>
  );
}

interface DropzoneFieldLabelProps {
  name: string;
  label: string;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
function DropzoneFieldLabel(props: DropzoneFieldLabelProps) {
  const { name, label } = props;
  return (
    <Box css={{ marginBottom: '$3' }}>
      <Text htmlFor={name} weight={600} as="label" css={{ color: '$black100' }}>
        {label}
      </Text>
    </Box>
  );
}

const CustomFileUpload = styled(DropzoneContainer, {
  height: 100,
  marginTop: '$3',
});
