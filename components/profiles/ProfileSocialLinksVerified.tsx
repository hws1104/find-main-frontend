/* eslint-disable react/jsx-max-depth */
import Box from 'components/base/Box';
import Flex from 'components/base/Flex';

import TwitterVerifyLink from 'components/links/SocialVerifyLink';
import InstagramVerifyPageLink from 'components/links/InstagramVerifyPageLink';

import TwitterIcon from 'assets/icons/twitter-icon.svg';
import InstagramIcon from 'assets/icons/instagram-icon.svg';

import { buildSocialLink } from 'utils/urls';
import { getSocialHandle } from 'utils/strings';

import SocialLinkVerified from './SocialLinkVerified';
import { SocialLinkVerifiedMap } from 'types/SocialLink';
import { useRouter } from 'next/router';
import { BUTTON_WIDTH } from 'utils/buttons';

interface ProfileSocialLinksVerifiedProps {
  socialLinks: SocialLinkVerifiedMap;
  isMyProfile: boolean;
}

export default function ProfileSocialLinksVerified(
  props: ProfileSocialLinksVerifiedProps
): JSX.Element {
  const { socialLinks, isMyProfile } = props;

  const router = useRouter();

  return (
    <>
      {socialLinks.twitter ? (
        <Flex>
          <SocialLinkVerified
            icon={
              <Box css={{ width: 19 }}>
                <TwitterIcon
                  style={{ display: 'block', width: '100%', height: 'auto' }}
                />
              </Box>
            }
            handle={socialLinks?.twitter?.handle}
            linkBuilderFn={buildSocialLink.twitter}
          >
            @{getSocialHandle(socialLinks?.twitter?.handle)}
          </SocialLinkVerified>
        </Flex>
      ) : isMyProfile ? (
        <Flex css={{ justifyContent: 'flex-start' }}>
          <Box
            css={{
              width: BUTTON_WIDTH,
              justifyContent: 'flex-center',
            }}
          >
            <TwitterVerifyLink
              text="Verify via Twitter"
              redirectPath={router.asPath}
            />
          </Box>
        </Flex>
      ) : null}
      {socialLinks.instagram ? (
        <Flex>
          <SocialLinkVerified
            icon={
              <Box css={{ width: 19 }}>
                <InstagramIcon
                  style={{ display: 'block', width: '100%', height: 'auto' }}
                />
              </Box>
            }
            handle={socialLinks?.instagram?.handle}
            linkBuilderFn={buildSocialLink.instagram}
          >
            {getSocialHandle(socialLinks?.instagram?.handle)}
          </SocialLinkVerified>
        </Flex>
      ) : isMyProfile ? (
        <Flex css={{ justifyContent: 'flex-start' }}>
          <Box css={{ width: BUTTON_WIDTH, justifyContent: 'flex-center' }}>
            <InstagramVerifyPageLink
              text="Verify via Instagram"
              redirectPath={router.asPath}
            />
          </Box>
        </Flex>
      ) : null}
    </>
  );
}
