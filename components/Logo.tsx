import Box from './base/Box';

import FNDLogo from 'assets/images/fnd-logo.svg';

import { CSS } from 'stitches.config';

interface LogoProps {
  css: CSS;
}

export default function Logo(props: LogoProps): JSX.Element {
  const { css } = props;

  return (
    <Box
      css={{
        ...(css as any),
        paddingBottom: '33.6734694%',
        height: 0,
      }}
    >
      <FNDLogo style={{ display: 'block' }} />
    </Box>
  );
}
