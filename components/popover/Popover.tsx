import { ReactNode, useCallback, useState } from 'react';
import Tippy, { TippyProps } from '@tippyjs/react';
import 'tippy.js/animations/scale.css';

import Box from 'components/base/Box';

interface PopoverProps extends TippyProps {
  button: ReactNode;
  className?: string;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function Popover(props: PopoverProps) {
  const {
    children,
    button,
    className,
    placement = 'top-end',
    ...tippyProps
  } = props;

  const [visible, setVisible] = useState<boolean>(false);

  // here we have a button nested inside of a link
  // so when clicked we want to call preventDefault
  const handlePopper = useCallback(
    (state: boolean) => (ev) => {
      ev?.preventDefault?.();
      setVisible(state);
    },
    [setVisible]
  );

  const showPopper = handlePopper(true);
  const hidePopper = handlePopper(false);

  return (
    <Tippy
      {...tippyProps}
      content={children}
      visible={visible}
      onClickOutside={hidePopper}
      interactive={true}
      animation="scale"
      duration={100}
      delay={0}
      placement={placement}
      arrow={false}
    >
      <Box onClick={visible ? hidePopper : showPopper} className={className}>
        {button}
      </Box>
    </Tippy>
  );
}
