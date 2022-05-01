import Heading from 'components/base/Heading';
import Paragraph from 'components/base/Paragraph';
import Flex from 'components/base/Flex';
import DropzoneResetButton from 'components/forms/DropzoneResetButton';

import { CustomFileUpload } from 'components/forms/fields/DropzoneMediaField';

export interface DropzoneGenericWarningProps {
  title: string;
  description: string;
  onReset: () => void;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function DropzoneGenericWarning(
  props: DropzoneGenericWarningProps
) {
  const { title, description, onReset } = props;

  return (
    <CustomFileUpload center expandVertical>
      <DropzoneResetButton onClick={onReset} />
      <Flex
        css={{
          color: '$black100',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Heading size={4} css={{ marginBottom: '$4' }}>
          {title}
        </Heading>
        <Paragraph>{description}</Paragraph>
      </Flex>
    </CustomFileUpload>
  );
}
