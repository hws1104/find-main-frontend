import { CSS } from 'stitches.config';

import Box from 'components/base/Box';
import Text from 'components/base/Text';
import Flex from 'components/base/Flex';

import UserTagContainer from './UserTagContainer';

interface UserTagRawSkeletonProps {
  css?: CSS;
}

export default function UserTagRawSkeleton(
  props: UserTagRawSkeletonProps
): JSX.Element {
  const { css } = props;
  return (
    <UserTagContainer css={css as any}>
      <Box
        css={{
          backgroundColor: '$black10',
          width: 24,
          height: 24,
          borderRadius: '$round',
          '@bp0': {
            width: 34,
            height: 34,
          },
        }}
      />
      <Flex>
        <Text
          size={{ '@initial': 0, '@bp0': 1 }}
          css={{
            textDecoration: 'none',
            color: '$black100',
            position: 'relative',
            top: -1,
            backgroundColor: '$black5',
            width: 120,
            height: 20,
            marginLeft: '$2',
          }}
        />
      </Flex>
    </UserTagContainer>
  );
}
