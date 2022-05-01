import Box from 'components/base/Box';

import FormBlock from 'components/forms/FormBlock';
import CharacterCounter from '../CharacterCounter';
import TextAreaField from '../fields/TextAreaField';

export default function UserBioFields(): JSX.Element {
  return (
    <FormBlock title="Add a short bio.">
      <Box>
        <Box css={{ marginBottom: '$2' }}>
          <TextAreaField
            label="Enter a short bio"
            name="bio"
            placeholder="Enter a short bio"
            rows={10}
          />
          <CharacterCounter name="bio" maxLength={200} />
        </Box>
      </Box>
    </FormBlock>
  );
}
