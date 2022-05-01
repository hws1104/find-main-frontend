import Grid from 'components/base/Grid';
import Text from 'components/base/Text';
import TextField from 'components/forms/fields/TextField';
import FormBlock from 'components/forms/FormBlock';
import Link from 'components/links/Link';

export default function UserEmailFields(): JSX.Element {
  return (
    <FormBlock
      title="Receive email notifications"
      hintText={
        <Text
          css={{
            fontFamily: '$body',
            lineHeight: 1.7,
            marginBottom: '$6',
            '@bp1': {
              marginBottom: 0,
            },
          }}
        >
          Add your email address to receive notifications about your activity on
          Foundation. This will not be shown on your profile.
        </Text>
      }
    >
      <Grid>
        <TextField
          name="email"
          placeholder="Email"
          label="Email"
          required={false}
        />
        <Link href="/settings">
          <Text
            as="a"
            css={{
              color: '$black60',
              fontFamily: '$body',
              textDecoration: 'none',
              fontWeight: 600,
              marginTop: '$3',
              textAlign: 'right',
              transition: 'color $0 $ease',
              '@hover': {
                '&:hover': {
                  color: '$black100',
                },
              },
            }}
          >
            Update email preferences
          </Text>
        </Link>
      </Grid>
    </FormBlock>
  );
}
