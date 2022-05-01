import { useRouter } from 'next/router';

import Flex from 'components/base/Flex';
import Text from 'components/base/Text';
import Button from 'components/base/Button';
import Link from 'components/base/Link';

import InstagramIcon from 'assets/icons/instagram-icon.svg';

import { getFirstValue } from 'utils/helpers';
import { css } from 'stitches.config';

const appId = process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID;

interface InstagramConnectLinkProps {
  text?: string;
  width?: number;
}

const iconStyles = css({
  display: 'block',
  width: 24,
  height: 24,
});

export default function InstagramConnectLink(
  props: InstagramConnectLinkProps
): JSX.Element {
  const router = useRouter();
  const { text = 'Connect to Instagram', width = '100%' } = props;

  const redirectPath = getFirstValue(router.query['redirect-path']);

  const windowLocationHref = window.location.href;

  const partsOfURL = windowLocationHref.split('?');
  const redirectURI = encodeURI(partsOfURL[0]);
  const redirectPathEncoded = encodeURI(redirectPath);

  // Note: InstagramShareButton within InstagramView
  // uses the redirect-path query param to pass through as
  // state following the Instagram API docs
  // https://developers.facebook.com/docs/instagram-basic-display-api/guides/getting-access-tokens-and-permissions/

  return (
    <Link
      href={`https://api.instagram.com/oauth/authorize?client_id=${appId}&redirect_uri=${redirectURI}&scope=user_profile&response_type=code&state=${redirectPathEncoded}`}
      css={{ display: 'block' }}
    >
      <Button
        shape="round"
        size="large"
        color="black"
        type="button"
        css={{ width: width, paddingRight: '36px' }}
      >
        <Flex css={{ justifyContent: 'center', alignItems: 'center' }}>
          <InstagramIcon className={iconStyles()} />
          <Text css={{ marginLeft: '$4', position: 'relative', top: -2 }}>
            {text}
          </Text>
        </Flex>
      </Button>
    </Link>
  );
}
