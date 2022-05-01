import { useField, useFormikContext } from 'formik';
import { useEffect } from 'react';

import Grid from 'components/base/Grid';
import Card from 'components/base/Card';
import Box from 'components/base/Box';
import Button from 'components/base/Button';
import Heading from 'components/base/Heading';
import Paragraph from 'components/base/Paragraph';
import TextField from 'components/forms/fields/TextField';
import TextLink from 'components/base/TextLink';

import { SYMBOL_CHARACTER_LIMIT_ERROR } from 'schemas/collection';

export default function CreateCollectionForm(): JSX.Element {
  const { isValid, dirty } = useFormikContext();

  const isFormDisabled = !isValid && dirty;

  return (
    <Card css={{ paddingY: '$8' }}>
      <Box
        css={{
          paddingX: '$8',
          borderBottom: '1px solid $black5',
          paddingBottom: '$8',
          marginBottom: '$8',
        }}
      >
        <Heading size={4} css={{ marginBottom: '$4' }}>
          Create a Collection
        </Heading>
        <Paragraph css={{ maxWidth: 360 }}>
          Deploy a smart contract to showcase NFTs.
        </Paragraph>
      </Box>

      {/* TODO: generalise this into a form block component */}
      <Box
        css={{
          paddingX: '$8',
          marginBottom: '$8',
        }}
      >
        <Heading size={3} css={{ marginBottom: '$3' }}>
          Set up your smart contract
        </Heading>
        <Paragraph size="sub" css={{ maxWidth: 360, marginBottom: '$4' }}>
          The following details are used to create your own smart contract. They
          will be added to the blockchain and cannot be edited.
        </Paragraph>
        <Paragraph>
          <TextLink
            target="_blank"
            rel="noreferrer"
            href="https://help.foundation.app/en/collections/3154781-collections"
          >
            Learn more about smart contracts
          </TextLink>
        </Paragraph>
      </Box>

      {/* TODO: generalise this into a form block component */}
      <Box
        css={{
          paddingX: '$8',
        }}
      >
        <Grid css={{ gap: '$7' }}>
          <TextField name="name" label="Collection Name" />

          <SymbolInputField name="symbol" label="Collection Symbol" />

          {/* TODO: can we use FormikSubmitButton here? */}
          <Button
            hoverable={!isFormDisabled}
            disabled={isFormDisabled}
            type="submit"
            size="large"
            shape="regular"
            color={isFormDisabled ? 'gray' : 'black'}
            css={{ width: '100%' }}
          >
            Continue
          </Button>
        </Grid>
      </Box>
    </Card>
  );
}

interface SymbolInputFieldProps {
  label: string;
  name: string;
}

function SymbolInputField(props: SymbolInputFieldProps): JSX.Element {
  const { label, name } = props;

  const [, meta, helpers] = useField(name);

  const hasCharacterLimitError = meta?.error === SYMBOL_CHARACTER_LIMIT_ERROR;
  const hasTouched = meta.touched;
  const setTouched = helpers.setTouched;

  useEffect(() => {
    if (hasCharacterLimitError && !hasTouched) {
      setTouched(true);
    }
  }, [hasCharacterLimitError, hasTouched, setTouched]);

  return (
    <TextField
      name={name}
      label={label}
      css={{
        '& input': {
          textTransform: 'uppercase',
          fontFamily: '$mono',
          letterSpacing: '$mono',
        },
      }}
    />
  );
}
