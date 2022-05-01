import { styled } from 'stitches.config';

import Box from 'components/base/Box';
import Flex from 'components/base/Flex';
import Text from 'components/base/Text';
import Heading from 'components/base/Heading';

const Container = styled(Flex, {
  backgroundColor: '$white100',
  borderRadius: '$2',
  boxShadow: '$0',
  justifyContent: 'center',
  textAlign: 'center',
  paddingY: '$8',
  paddingX: '$4',
  '@bp0': {
    paddingY: '$10',
  },
});
interface ActivityEmptyStateProps {
  title: string;
  description: string;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function ActivityEmptyState(props: ActivityEmptyStateProps) {
  const { title, description } = props;

  return (
    <Container
      css={{
        marginBottom: '$7',
        '@bp2': {
          marginBottom: '$10',
        },
      }}
    >
      <Box>
        <Heading
          css={{ marginBottom: '$4' }}
          size={{ '@initial': 3, '@bp0': 4 }}
        >
          {title}
        </Heading>
        <Text
          weight={600}
          size={{ '@initial': 0, '@bp0': 2 }}
          css={{ color: '$black30', maxWidth: 320, marginX: 'auto' }}
        >
          {description}
        </Text>
      </Box>
    </Container>
  );
}
