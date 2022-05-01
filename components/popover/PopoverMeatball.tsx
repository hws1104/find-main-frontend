import { ReactElement } from 'react';
import { TippyProps } from '@tippyjs/react';

import EllipsisIcon from 'assets/icons/ellipsis-icon.svg';
import Popover from 'components/popover/Popover';
import PopoverButton, {
  PopoverVariants,
} from 'components/popover/PopoverButton';
import Icon from 'components/Icon';

import { CSS } from 'stitches.config';

interface PopoverMeatballProps extends TippyProps {
  children: ReactElement;
  css?: CSS;
  appearance?: PopoverVariants['appearance'];
  size?: PopoverVariants['size'];
}

export default function PopoverMeatball(
  props: PopoverMeatballProps
): JSX.Element {
  const {
    children,
    css,
    appearance = 'normal',
    size = 'regular',
    ...tippyProps
  } = props;

  return (
    <Popover
      {...tippyProps}
      button={
        <PopoverButton
          size={size}
          appearance={appearance}
          css={{ ...(css as any) }}
        >
          <Icon icon={EllipsisIcon} width={22} height={4} />
        </PopoverButton>
      }
    >
      {children}
    </Popover>
  );
}
