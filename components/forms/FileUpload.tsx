import { useFileUpload, FileUploadProps } from 'hooks/use-file-upload';

import Flex from 'components/base/Flex';
import Box from 'components/base/Box';
import Text from 'components/base/Text';

import { notEmptyOrNil } from 'utils/helpers';
import { getFileName } from 'utils/urls';

import ErrorField from './fields/ErrorField';
import { FileName, PreviewBox, UploadPreviewImage } from './UploadPreview';

interface FileUploadFieldProps {
  maxSize: number;
  name: string;
  token: string;
}

export function FileUploadField<T>(props: FileUploadFieldProps): JSX.Element {
  const { maxSize = 2000000, name, token } = props;

  const fileUploadProps: FileUploadProps = {
    accept: 'image/jpeg, image/jpg, image/png, image/gif, image/svg+xml',
    maxSize,
    name,
    token,
  };

  const uploadProps = useFileUpload<T>(fileUploadProps);

  const { getRootProps, getInputProps, preview, field, meta, isDragActive } =
    uploadProps;

  const hasPreview = notEmptyOrNil(preview);
  const hasValue = notEmptyOrNil(field.value);

  if (hasPreview || hasValue) {
    return <PreviewImage {...uploadProps} />;
  }

  return (
    <Box>
      <Flex
        {...getRootProps()}
        css={{
          border: 'dashed 1px $black10',
          borderRadius: '$2',
          minHeight: 115,
          alignItems: 'center',
          cursor: 'pointer',
          outline: 'none',
        }}
      >
        <input {...getInputProps()} />
        <Text
          css={{
            maxWidth: 180,
            marginX: 'auto',
            lineHeight: 1.4,
            textAlign: 'center',
          }}
        >
          {isDragActive
            ? `Drop image to upload.`
            : `Drag and drop an image here, or click to browse.`}
        </Text>
      </Flex>
      <ErrorField meta={meta} forceError />
    </Box>
  );
}

function PreviewImage(props) {
  const { preview, field, meta, isLoading, helpers } = props;

  return (
    <Box>
      <PreviewBox>
        <UploadPreviewImage
          image={preview?.preview ?? field.value}
          isLoading={isLoading}
          css={{ marginRight: '$6' }}
        />
        <FileName isLoading={isLoading} onDelete={() => helpers.setValue('')}>
          {preview?.filename ??
            getFileName(preview?.filename ?? field.value ?? '')}
        </FileName>
      </PreviewBox>
      <ErrorField meta={meta} forceError />
    </Box>
  );
}
