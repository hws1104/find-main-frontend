import { useField } from 'formik';
import { ReactNode } from 'react';
import { useMeasure } from 'react-use';

import Grid from 'components/base/Grid';
import Flex from 'components/base/Flex';
import Box from 'components/base/Box';
import Text from 'components/base/Text';
import Input from 'components/base/InputV2';
import ErrorField from 'components/forms/fields/ErrorField';

interface SocialFieldProps {
  icon: ReactNode;
  title: string;
  urlPrefix?: string;
  name: string;
}

export default function SocialField(props: SocialFieldProps): JSX.Element {
  const { icon, title, urlPrefix } = props;

  const [field, meta] = useField(props);
  const [widthRef, { width }] = useMeasure();

  const isNarrow = width < 540;

  return (
    <Box>
      <Box ref={widthRef} />
      <Grid
        css={{
          gridTemplateColumns: isNarrow ? 'repeat(1, 1fr)' : 'repeat(2, 1fr)',
          gap: 0,
          alignItems: 'center',
          background: '$black5',
          borderRadius: '$2',
          border: 'solid 1px $black10',
        }}
      >
        <Flex css={{ alignItems: 'center', padding: '$4' }}>
          <Flex css={{ alignItems: 'center' }}>
            {icon && <Box css={{ marginRight: '$2' }}>{icon}</Box>}
            {title && (
              <Text weight={600} size={2}>
                {title}
              </Text>
            )}
          </Flex>
          {urlPrefix && (
            <Text size={0} css={{ color: '$black50', marginLeft: 'auto' }}>
              {urlPrefix}
            </Text>
          )}
        </Flex>

        <Box css={{ margin: -1 }}>
          <Input {...field} {...props} />
        </Box>
      </Grid>
      <ErrorField meta={meta} />
    </Box>
  );
}
