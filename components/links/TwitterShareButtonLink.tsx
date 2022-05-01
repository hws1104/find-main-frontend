import { css } from 'stitches.config';

import Text from 'components/base/Text';
import Flex from 'components/base/Flex';
import Button from 'components/base/Button';
import Link from 'components/base/Link';

import TwitterIcon from 'assets/icons/twitter-icon.svg';

interface TwitterShareButtonLinkProps {
  twitterShareText: string;
  text?: string;
}

const iconStyles = css({
  width: 24,
  height: 24,
  display: 'block',
});

export default function TwitterShareButtonLink(
  props: TwitterShareButtonLinkProps
): JSX.Element {
  const { twitterShareText, text = 'Tweet it' } = props;
  return (
    <Link
      href={`https://twitter.com/intent/tweet?text=${encodeURI(
        twitterShareText
      )}`}
      target="_blank"
      rel="noopener noreferrer"
      css={{ display: 'block' }}
    >
      <Button
        size="large"
        color="black"
        shape="regular"
        type="button"
        css={{ width: '100%', paddingRight: '$7' }}
      >
        <Flex css={{ justifyContent: 'center', alignItems: 'center' }}>
          <TwitterIcon className={iconStyles()} />
          <Text css={{ marginLeft: '$4', position: 'relative', top: -2 }}>
            {text}
          </Text>
        </Flex>
      </Button>
    </Link>
  );
}
