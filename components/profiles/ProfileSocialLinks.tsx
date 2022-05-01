/* eslint-disable max-lines */
/* eslint-disable react/jsx-max-depth */
import { ReactNode } from 'react';

import Box from 'components/base/Box';
import Link from 'components/base/Link';
import Text from 'components/base/Text';
import Grid from 'components/base/Grid';

import Website from 'assets/images/social/website-icon.svg';
import DiscordIcon from 'assets/images/social/discord-icon.svg';
import Twitch from 'assets/images/social/twitch-icon.svg';
import YouTube from 'assets/images/social/youtube-icon.svg';
import Facebook from 'assets/images/social/facebook-icon.svg';
import TikTok from 'assets/images/social/tiktok-icon.svg';
import SnapchatIcon from 'assets/images/social/snapchat-icon.svg';

import { buildSocialLink, buildTikTokHandle, getUrlHost } from 'utils/urls';
import { getSocialHandle } from 'utils/strings';
import { isEmptyOrNil } from 'utils/helpers';

import SocialLinkMap from 'types/SocialLink';

interface ProfileSocialLinksProps {
  socialLinks: SocialLinkMap;
}

export default function ProfileSocialLinks(
  props: ProfileSocialLinksProps
): JSX.Element {
  const { socialLinks } = props;

  return (
    <Grid css={{ gap: '$4', '@bp1': { gap: '$5' } }}>
      <SocialLink
        icon={<Website style={{ display: 'block' }} />}
        handle={socialLinks?.website?.handle}
        linkBuilderFn={buildSocialLink.website}
      >
        {getUrlHost(socialLinks?.website?.handle)}
      </SocialLink>

      <SocialLink
        icon={
          <DiscordIcon
            style={{ display: 'block', width: '24px', height: '24px' }}
          />
        }
        handle={socialLinks?.discord?.handle}
      >
        {socialLinks?.discord?.handle}
      </SocialLink>

      <SocialLink
        icon={<YouTube style={{ display: 'block' }} />}
        handle={socialLinks?.youtube?.handle}
        linkBuilderFn={buildSocialLink.youtube}
      >
        YouTube
      </SocialLink>

      <SocialLink
        icon={<Facebook style={{ display: 'block' }} />}
        handle={socialLinks?.facebook?.handle}
        linkBuilderFn={buildSocialLink.facebook}
      >
        {getSocialHandle(socialLinks?.facebook?.handle)}
      </SocialLink>

      <SocialLink
        icon={<Twitch style={{ display: 'block' }} />}
        handle={socialLinks?.twitch?.handle}
        linkBuilderFn={buildSocialLink.twitch}
      >
        {getSocialHandle(socialLinks?.twitch?.handle)}
      </SocialLink>

      <SocialLink
        icon={<TikTok style={{ display: 'block' }} />}
        handle={buildTikTokHandle(socialLinks?.tiktok?.handle)}
        linkBuilderFn={buildSocialLink.tiktok}
      >
        {getSocialHandle(buildTikTokHandle(socialLinks?.tiktok?.handle))}
      </SocialLink>

      <SocialLink
        icon={
          <SnapchatIcon
            style={{ display: 'block', width: '24px', height: '23px' }}
          />
        }
        handle={socialLinks?.snapchat?.handle}
        linkBuilderFn={buildSocialLink.snapchat}
      >
        {getSocialHandle(socialLinks?.snapchat?.handle)}
      </SocialLink>
    </Grid>
  );
}

interface SocialLinkIconProps {
  children: ReactNode;
}

function SocialLinkIcon(props: SocialLinkIconProps): JSX.Element {
  const { children } = props;
  return <Box css={{ marginRight: '$4' }}>{children}</Box>;
}

interface SocialLinkHandleProps {
  children: ReactNode;
}

function SocialLinkHandle(props: SocialLinkHandleProps): JSX.Element {
  const { children } = props;
  return (
    <Text
      weight={600}
      size={2}
      css={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
    >
      {children}
    </Text>
  );
}

interface SocialLinkProps {
  handle: string;
  children: ReactNode;
  icon: ReactNode;
  linkBuilderFn?: any;
}

function SocialLink(props: SocialLinkProps): JSX.Element {
  const { handle, children, linkBuilderFn, icon } = props;

  const noHandle = isEmptyOrNil(handle);

  if (noHandle) {
    return null;
  }

  if (!linkBuilderFn) {
    return (
      <Box
        css={{
          display: 'flex',
          alignItems: 'center',
          textDecoration: 'none',
          color: '$black100',
          fontSize: '$3',
          '@bp1': {
            fontSize: '$2',
          },
        }}
      >
        <SocialLinkIcon>{icon}</SocialLinkIcon>
        <SocialLinkHandle>{children}</SocialLinkHandle>
      </Box>
    );
  }

  return (
    <Link
      href={linkBuilderFn(handle)}
      css={{
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
        color: '$black100',
        fontSize: '$3',
        '@bp1': {
          fontSize: '$2',
        },
      }}
      target="_blank"
      rel="noreferrer"
    >
      <SocialLinkIcon>{icon}</SocialLinkIcon>
      <SocialLinkHandle>{children}</SocialLinkHandle>
    </Link>
  );
}
