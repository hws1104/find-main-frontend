/* eslint-disable react/jsx-max-depth */
import { css } from 'stitches.config';

import Box from 'components/base/Box';
import Text from 'components/base/Text';
import Button from 'components/base/Button';
import Flex from 'components/base/Flex';
import Grid from 'components/base/Grid';
import Link from 'components/base/Link';
import Paragraph from 'components/base/Paragraph';

import { getUsernameOrAddress } from 'utils/helpers';
import { buildShareProfileTweet } from 'utils/twitter-templates';

import TwitterIcon from 'assets/images/social/twitter-icon.svg';

import Account from 'types/Account';
import SocialVerification from 'types/SocialVerification';

export interface ShareProfileProps {
  currentUser: Account;
  twitterSocialVerification: SocialVerification;
  instagramSocialVerification: SocialVerification;
}

const twitterIconStyles = css({
  width: 24,
  height: 24,
  display: 'block',
});

export default function ShareProfile(props: ShareProfileProps): JSX.Element {
  const { currentUser } = props;

  const usernameOrAddress = getUsernameOrAddress(currentUser);

  return (
    <Box>
      <Box
        css={{
          paddingX: '$4',
          paddingY: '$8',
          display: 'flex',
          justifyContent: 'flex-end',
          '@bp1': { paddingX: '$8' },
        }}
      >
        <Box css={{ textAlign: 'right' }}>
          <Grid css={{ gap: '$6' }}>
            <Text weight={600} size={3}>
              Share your profile on Twitter
            </Text>
            <Paragraph css={{ color: '$black60', marginLeft: 'auto' }}>
              Get to know members of the community.
            </Paragraph>
          </Grid>

          <Flex
            css={{
              justifyContent: 'flex-end',
              flex: 1,
              paddingTop: '$7',
              paddingBottom: '$8',
            }}
          >
            <Link
              href={`https://twitter.com/intent/tweet?text=${encodeURI(
                buildShareProfileTweet({ usernameOrAddress })
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              css={{ textDecoration: 'none' }}
            >
              <Button
                type="button"
                size="large"
                shape="regular"
                color="black"
                css={{ paddingRight: 36 }}
              >
                <Flex css={{ justifyContent: 'center', alignItems: 'center' }}>
                  <TwitterIcon className={twitterIconStyles()} />
                  <Text
                    css={{ marginLeft: '$4', position: 'relative', top: -2 }}
                  >
                    Tweet
                  </Text>
                </Flex>
              </Button>
            </Link>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}
