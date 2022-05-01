/* eslint-disable react/jsx-max-depth */
/* eslint-disable max-lines */
import { ReactNode } from 'react';
import NextLink from 'next/link';

import Box from 'components/base/Box';
import Flex from 'components/base/Flex';
import Grid from 'components/base/Grid';
import Text from 'components/base/Text';
import Link from 'components/base/Link';

import Account from 'types/Account';
import SocialVerification from 'types/SocialVerification';

import CheckIcon from 'assets/icons/check-icon.svg';
import { notEmptyOrNil } from 'utils/helpers';
import { all } from 'ramda';
import { css } from 'stitches.config';

export interface SetupTipsProps {
  currentUser: Account;
  token: string;
  twitterSocialVerification: SocialVerification;
  instagramSocialVerification: SocialVerification;
}

export default function SetupTips(props: SetupTipsProps): JSX.Element {
  const {
    twitterSocialVerification,
    instagramSocialVerification,
    currentUser,
  } = props;

  const hasRequiredInfo = all(notEmptyOrNil, [
    currentUser?.profileImageUrl,
    currentUser?.coverImageUrl,
    currentUser?.bio,
  ]);

  return (
    <Box>
      <Box
        css={{
          paddingX: '$4',
          paddingY: '$8',
          display: 'grid',
          justifyContent: 'space-between',
          gap: '$7',
          '@bp1': {
            paddingX: '$8',
          },
        }}
      >
        <Text weight={600} size={3}>
          What you need to do
        </Text>
        <Grid css={{ gap: '$6' }}>
          <VerificationStep isChecked={twitterSocialVerification?.isValid}>
            <VerificationStepLink href="/profile/verify/twitter">
              <Text weight={600} size={2}>
                Verify your Twitter
              </Text>
            </VerificationStepLink>
          </VerificationStep>
          <VerificationStep isChecked={instagramSocialVerification?.isValid}>
            <VerificationStepLink href="/profile/verify/instagram">
              <Text weight={600} size={2}>
                Verify your Instagram
              </Text>
            </VerificationStepLink>
          </VerificationStep>
          <VerificationStep isChecked={hasRequiredInfo}>
            <VerificationStepLink href="/profile">
              <Grid css={{ gap: '$2' }}>
                <Text weight={600} size={2}>
                  Complete your Profile
                </Text>
                <Text size={0} css={{ color: '$black60' }}>
                  Upload a profile image, cover image and add a bio.
                </Text>
              </Grid>
            </VerificationStepLink>
          </VerificationStep>
        </Grid>
      </Box>
    </Box>
  );
}

interface VerificationStepLinkProps {
  href: string;
  children: ReactNode;
}

function VerificationStepLink(props: VerificationStepLinkProps): JSX.Element {
  const { children, href } = props;
  return (
    <NextLink href={href}>
      <Link
        css={{
          textDecoration: 'none',
          display: 'block',
          color: '$black100',
        }}
      >
        {children}
      </Link>
    </NextLink>
  );
}

interface VerificationStepProps {
  children: ReactNode;
  isChecked: boolean;
}

const checkIconStyles = css({ width: 24 });

function VerificationStep(props: VerificationStepProps): JSX.Element {
  const { isChecked, children } = props;
  return (
    <Flex
      css={{
        alignItems: 'center',
        textAlign: 'left',
        pointerEvents: isChecked ? 'none' : 'all',
      }}
    >
      <Box
        css={{
          flexShrink: 0,
          marginRight: '$6',
          width: 40,
          height: 40,
          borderRadius: '$2',
          backgroundColor: isChecked ? '$black100' : '$white100',
          border: '1px solid',
          borderColor: isChecked ? '$black100' : '$black10',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transition: 'color $2 $ease',
        }}
      >
        {isChecked && <CheckIcon className={checkIconStyles()} />}
      </Box>
      {children}
    </Flex>
  );
}
