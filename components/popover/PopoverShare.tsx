import { useLocation } from 'react-use';
import { TippyProps } from '@tippyjs/react';

import UploadIcon from 'assets/icons/upload-icon.svg';
import TwitterIcon from 'assets/icons/twitter-icon.svg';
import CopyIcon from 'assets/icons/copy-icon.svg';
import SuccessIcon from 'assets/icons/success-icon.svg';

import Popover from './Popover';
import PopoverButton from './PopoverButton';
import PopoverMenu from './PopoverMenu';
import Icon from 'components/Icon';
import Text from 'components/base/Text';

import { PopoverMenuOption } from './types';

import useCopyText from 'hooks/use-copy-text';

import { styled } from 'stitches.config';

interface PopoverShareProps extends TippyProps {
  className?: string;
  shareText: string;
}

export default function PopoverShare(props: PopoverShareProps): JSX.Element {
  const {
    className,
    shareText,
    placement = 'top-end',
    ...tippyOptions
  } = props;

  const { href } = useLocation();
  const { hasCopied, handleCopy } = useCopyText(href);

  const popoverOptions: PopoverMenuOption[] = [
    {
      icon: <Icon icon={TwitterIcon} width={24} height={24} />,
      children: 'Tweet',
      externalHref: `https://twitter.com/intent/tweet?text=${encodeURI(
        shareText
      )}`,
    },
    {
      icon: hasCopied ? (
        <Icon icon={SuccessIcon} width={20} height={20} />
      ) : (
        <Icon icon={CopyIcon} width={20} height={20} />
      ),
      children: 'Copy Link',
      onClick: () => {
        handleCopy();
      },
    },
  ];

  return (
    <Popover
      {...tippyOptions}
      button={
        <PopoverButton
          appearance="normal"
          css={{
            paddingX: '$5',
            height: 40,
            '@bp0': {
              height: 56,
            },
            '@bp1': {
              paddingX: '$6',
            },
          }}
        >
          <Icon icon={UploadIcon} width={24} height={24} />
          <PopoverLabel>Share</PopoverLabel>
        </PopoverButton>
      }
      className={className}
      placement={placement}
    >
      <PopoverMenu options={popoverOptions} />
    </Popover>
  );
}

const PopoverLabel = styled(Text, {
  marginLeft: '$3',
  position: 'relative',
  top: -2,
  fontWeight: 600,
  display: 'none',
  '@bp1': {
    display: 'block',
  },
});
