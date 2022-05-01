import Grid from 'components/base/Grid';
import Box from 'components/base/Box';

import SymbolField from 'components/forms/fields/SymbolField';
import TextField from 'components/forms/fields/TextField';
import UsernameAvailable from 'components/forms/fields/UsernameAvailable';
import FormBlock from 'components/forms/FormBlock';

export default function UserInfoFields(): JSX.Element {
  return (
    <FormBlock title="Enter your details.">
      <Grid css={{ gap: '$6', marginBottom: '$2' }}>
        <TextField
          name="name"
          placeholder="Name"
          label="Name"
          required={false}
        />
        <Box>
          <SymbolField name="username" label="Username" />
          <UsernameAvailable name="username" />
        </Box>
      </Grid>
    </FormBlock>
  );
}
