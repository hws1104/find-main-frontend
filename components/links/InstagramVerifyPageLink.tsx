import NextLink from 'next/link';

import Flex from 'components/base/Flex';
import Text from 'components/base/Text';
import Button from 'components/base/Button';
import Link from 'components/base/Link';

import InstagramIcon from 'assets/icons/instagram-icon.svg';

import { BUTTON_WIDTH } from 'utils/buttons';
import { css } from 'stitches.config';

interface InstagramVerifyPageLinkProps {
  text?: string;
  redirectPath: string;
}

const instagramIconStyles = css({
  display: 'block',
  width: 24,
  height: 24,
});

export default function InstagramVerifyPageLink(
  props: InstagramVerifyPageLinkProps
): JSX.Element {
  const { text, redirectPath } = props;
  return (
    <NextLink
      href={{
        pathname: '/profile/verify/instagram',
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
            <InstagramIcon className={instagramIconStyles()} />
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
