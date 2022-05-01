import { styled } from 'stitches.config';
import { ReactNode, useEffect, useState } from 'react';
import { useCopyToClipboard } from 'react-use';

import Box from 'components/base/Box';
import Flex from 'components/base/Flex';

import ClipboardIcon from 'assets/icons/clipboard-icon.svg';
import ClipboardCheck from 'assets/icons/clipboard-check.svg';

interface PrivateSaleCopyToClipboardProps {
  textToCopy: string;
  children: ReactNode;
  className?: string;
}

const IconWrapper = styled(Flex, {
  transition: 'color 0.3s $ease',
  color: '$black50',
  alignItems: 'center',
  marginLeft: '$4',
  borderLeft: 'solid 2px $black5',
  paddingLeft: '$5',
  paddingY: '$5',
  '@hover': {
    '&:hover': {
      color: '$black100',
    },
  },
});

const Wrapper = styled(Box, {
  display: 'flex',
  paddingX: '$5',
  alignItems: 'center',
  cursor: 'pointer',
  borderRadius: '$2',
  boxShadow: '$0',

  border: 'solid 2px $black5',
  transition: 'color $1 $ease',
  '@hover': {
    '&:hover': {
      color: '$black100',
    },
    [`&:hover ${IconWrapper}`]: {
      color: '$black100',
    },
  },
});

export default function PrivateSaleCopyToClipboard(
  props: PrivateSaleCopyToClipboardProps
): JSX.Element {
  const { textToCopy, children, className } = props;
  const [clipboardState, copyToClipboard] = useCopyToClipboard();
  const [noticationKey, setNotificationKey] = useState(null);
  const [hasCopied, setHasCopied] = useState(null);

  function handleCopy() {
    setHasCopied(true);
    setNotificationKey(Date.now());
    copyToClipboard(textToCopy);
  }

  useEffect(() => {
    setTimeout(() => {
      setHasCopied(false);
    }, 3000);
  }, [noticationKey]);

  const hasValue = clipboardState.value && hasCopied;

  return (
    <Wrapper
      {...getToolTipProps(hasCopied)}
      onClick={handleCopy}
      className={className}
    >
      {children}
      <IconWrapper>
        <Flex css={{ minHeight: 16, alignItems: 'center' }}>
          {hasValue ? (
            <ClipboardCheck width={16} height={12} />
          ) : (
            <ClipboardIcon width={16} height={16} />
          )}
        </Flex>
      </IconWrapper>
    </Wrapper>
  );
}

const getToolTipProps = (value) => ({
  'aria-label': value ? 'Copied URL' : 'Copy URL',
  'data-balloon-pos': 'up-right',
});
