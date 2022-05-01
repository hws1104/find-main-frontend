import { ReactNode } from 'react';

import Body from 'components/base/Body';
import Box from 'components/base/Box';
import Flex from 'components/base/Flex';

interface HeaderContainerProps {
  children: ReactNode;
  absolute: boolean;
}

export default function HeaderContainer(
  props: HeaderContainerProps
): JSX.Element {
  const { children, absolute } = props;
  return (
    <Box id="header">
      <Box
        css={{
          position: absolute ? 'absolute' : 'relative',
          left: 0,
          zIndex: 999,
          width: '100%',
        }}
      >
        <Body
          css={{
            paddingTop: '$6',
            '@bp1': { paddingTop: '$7' },
            '@bp2': { paddingBottom: '$8' },
          }}
        >
          <Flex
            css={{
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            {children}
          </Flex>
        </Body>
      </Box>
    </Box>
  );
}
