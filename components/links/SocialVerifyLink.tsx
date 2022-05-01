import NextLink from 'next/link';

import Flex from 'components/base/Flex';
import Text from 'components/base/Text';
import Button from 'components/base/Button';
import Link from 'components/base/Link';

import TwitterIcon from 'assets/icons/twitter-icon.svg';

import { BUTTON_WIDTH } from 'utils/buttons';
import { css } from 'stitches.config';
interface SocialVerifyLinkProps {
  text?: string;
  redirectPath: string;
}

const twitterIconStyles = css({
  display: 'block',
  width: 24,
  height: 24,
});

export default function SocialVerifyLink(
  props: SocialVerifyLinkProps
): JSX.Element {
  const { text, redirectPath } = props;

  return (
    <NextLink
      href={{
        pathname: `/profile/verify/twitter`,
        query: { 'redirect-path': redirectPath },
      }}
      passHref
      prefetch={false}
    >
      <Link css={{ display: 'block', textDecoration: 'none' }}>
        <Button
          hoverable
          size="regular"
          shape="round"
          color="white"
          appearance="ghost"
          type="button"
          css={{
            width: BUTTON_WIDTH,
          }}
        >
          <Flex css={{ justifyContent: 'center', alignItems: 'center' }}>
            <TwitterIcon className={twitterIconStyles()} />

            <Text
              css={{
                marginLeft: '$4',
                position: 'relative',
                top: -2,
              }}
            >
              {text}
            </Text>
          </Flex>
        </Button>
      </Link>
    </NextLink>
  );
}
