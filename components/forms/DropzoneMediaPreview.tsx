/* eslint-disable react/jsx-max-depth */
import { useField, useFormikContext } from 'formik';

import Flex from 'components/base/Flex';
import Button from 'components/base/Button';
import DropzoneResetButton from './DropzoneResetButton';
import { CustomFileUpload } from 'components/forms/fields/DropzoneMediaField';

import { renderFilePreview } from 'components/FilePreview';

import UploadIcon from 'assets/icons/upload-icon.svg';

interface UploadMediaFormValues {
  file: File;
}

interface DropzoneMediaPreviewProps {
  name: string;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function DropzoneMediaPreview(props: DropzoneMediaPreviewProps) {
  const { name } = props;

  const { resetForm } = useFormikContext<UploadMediaFormValues>();

  const [field] = useField<File>(name);

  return (
    <CustomFileUpload center expandVertical>
      <DropzoneResetButton onClick={resetForm} />
      <Flex
        expandVertical
        css={{
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '$8',
        }}
      >
        <Flex
          css={{
            flexGrow: 1,
            alignItems: 'center',
            height: '100$',
            width: '100%',
          }}
        >
          {renderFilePreview(field.value)}
        </Flex>

        <Button
          hoverable
          type="submit"
          color="black"
          shape="round"
          css={{ fontSize: '$3', paddingY: '$5', paddingX: '$8' }}
        >
          <UploadIcon width={24} height={24} style={{ marginRight: 15 }} />
          Upload
        </Button>
      </Flex>
    </CustomFileUpload>
  );
}
