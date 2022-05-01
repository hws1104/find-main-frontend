import { useEffect, useState } from 'react';
import { useCopyToClipboard } from 'react-use';

import UserNumber, { TagWrapper } from 'components/UserNumber';
import Flex from 'components/base/Flex';
import Mono from 'components/base/Mono';

import { truncateStringCenter } from 'utils/helpers';

import ClipboardIcon from 'assets/icons/clipboard-icon.svg';
import ClipboardCheck from 'assets/icons/clipboard-check.svg';

interface ProfileCopyAddressProps {
  publicKey: string;
  userIndex?: number;
}

export default function ProfileCopyAddress(
  props: ProfileCopyAddressProps
): JSX.Element {
  const { userIndex, publicKey } = props;
  return (
    <TagWrapper>
      <Flex
        css={{
          boxShadow: '$0',
          borderRadius: '$round',
          alignItems: 'center',
          minHeight: 28,
          '@bp0': {
            minHeight: 35,
          },
        }}
      >
        {userIndex && <UserNumber userNumber={userIndex} />}
        <Mono
          css={{
            letterSpacing: 0.6,
            paddingLeft: '$3',
            fontSize: 12,
            '@bp0': { fontSize: '$0' },
          }}
        >
          {truncateStringCenter(4, publicKey)}
        </Mono>
        <CopyToClipboardLink textToCopy={publicKey} />
      </Flex>
    </TagWrapper>
  );
}

interface CopyToClipboardLinkProps {
  textToCopy: string;
}

function CopyToClipboardLink(props: CopyToClipboardLinkProps): JSX.Element {
  const { textToCopy } = props;
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
    }, 2500);
  }, [noticationKey]);

  const hasValue = clipboardState.value && hasCopied;

  return (
    <Flex
      {...getToolTipProps(hasValue)}
      onClick={handleCopy}
      css={{
        paddingX: 10,
        minHeight: 29,
        alignItems: 'center',
        cursor: 'pointer',
        color: '$black20',
        transition: 'color $1 $ease',
        '@hover': {
          '&:hover': {
            color: '$black100',
          },
        },
        '@bp0': { minHeight: 35 },
      }}
    >
      {hasValue ? (
        <ClipboardCheck sx={{ display: 'block' }} width={16} height={12} />
      ) : (
        <ClipboardIcon sx={{ display: 'block' }} width={16} height={16} />
      )}
    </Flex>
  );
}

const getToolTipProps = (value) =>
  !value && { 'aria-label': 'Copy Address', 'data-balloon-pos': 'up' };
