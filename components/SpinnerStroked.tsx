import { keyframes } from 'stitches.config';
import Box from 'components/base/Box';

import SpinnerStrokedIcon from 'assets/icons/spinner-stroke.svg';
import Icon from './Icon';

const rotate = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
});

interface SpinnerStrokedProps {
  size?: number;
}

export default function SpinnerStroked(
  props: SpinnerStrokedProps
): JSX.Element {
  const { size = 70 } = props;

  const isSmall = size <= 24;

  return (
    <Box
      css={{
        animation: `${rotate} 900ms linear infinite`,
        width: size,
        animateFillMode: 'forwards',
      }}
    >
      <Icon
        // TODO: replace with small variant when ready
        icon={isSmall ? SpinnerStrokedIcon : SpinnerStrokedIcon}
        width={size}
        height={size}
      />
    </Box>
  );
}
