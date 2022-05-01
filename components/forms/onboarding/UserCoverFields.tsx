import Box from 'components/base/Box';
import Paragraph from 'components/base/Paragraph';

import { FileUploadField } from '../FileUpload';
import FormBlock from 'components/forms/FormBlock';
interface CreatorCoverFieldsProps {
  token: string;
}

export default function CreatorCoverFields(
  props: CreatorCoverFieldsProps
): JSX.Element {
  const { token } = props;
  return (
    <FormBlock
      title="Upload a cover image"
      hintText={
        <Paragraph css={{ marginBottom: '$4' }}>
          Recommended size:
          <br /> 1500x500px.
          <br />
          JPG, PNG, or GIF.
          <br /> 10MB max size.
        </Paragraph>
      }
    >
      <Box>
        <Box css={{ marginBottom: '$2' }}>
          <FileUploadField<{ coverImageUrl: string }>
            name="coverImageUrl"
            // 10mb in bytes
            maxSize={10000000}
            token={token}
          />
        </Box>
      </Box>
    </FormBlock>
  );
}
