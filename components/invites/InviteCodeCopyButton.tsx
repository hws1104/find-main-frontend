import { useCallback, useEffect, useState } from 'react';
import { useCopyToClipboard, useLocation } from 'react-use';

import Button from 'components/base/Button';

interface InviteCodeCopyButtonProps {
  inviteCode: string;
  isDisabled: boolean;
}

export default function InviteCodeCopyButton(
  props: InviteCodeCopyButtonProps
): JSX.Element {
  const { inviteCode, isDisabled } = props;

  const [, copyToClipboard] = useCopyToClipboard();
  const [noticationKey, setNotificationKey] = useState<number>(null);
  const [hasCopied, setHasCopied] = useState<boolean>(false);

  const { origin } = useLocation();
  const urlToCopy = `${origin}/join?code=${inviteCode}`;

  const handleCopy = useCallback(() => {
    setHasCopied(true);
    setNotificationKey(Date.now());
    copyToClipboard(urlToCopy);
  }, [urlToCopy, setHasCopied, setNotificationKey, copyToClipboard]);

  useEffect(() => {
    setTimeout(() => {
      setHasCopied(false);
    }, 3000);
  }, [noticationKey]);

  return (
    <Button
      onClick={handleCopy}
      color="black"
      shape="regular"
      size="large"
      appearance="outline"
      css={{
        pointerEvents: hasCopied || isDisabled ? 'none' : 'all',
        opacity: hasCopied ? 0.3 : 1,
        width: '100%',
        '@bp1': {
          width: 'auto',
        },
      }}
    >
      {hasCopied ? `Invite URL Copied!` : `Copy Invite URL`}
    </Button>
  );
}
