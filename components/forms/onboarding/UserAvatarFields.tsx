import Box from 'components/base/Box';
import Paragraph from 'components/base/Paragraph';

import FormBlock from 'components/forms/FormBlock';
import { FileUploadField } from '../FileUpload';

interface UserBioFieldsProps {
  token: string;
}

export default function UserBioFields(props: UserBioFieldsProps): JSX.Element {
  const { token } = props;
  return (
    <FormBlock
      title="Upload a profile image."
      hintText={
        <Paragraph css={{ marginBottom: '$4' }}>
          Recommended size:
          <br /> 1000x1000px.
          <br />
          JPG, PNG, or GIF.
          <br /> 10MB max size.
        </Paragraph>
      }
    >
      <Box>
        <Box css={{ marginBottom: 10 }}>
          <FileUploadField<{ profileImageUrl: string }>
            name="profileImageUrl"
            token={token}
            // 10mb in bytes
            maxSize={10000000}
          />
        </Box>
      </Box>
    </FormBlock>
  );
}
