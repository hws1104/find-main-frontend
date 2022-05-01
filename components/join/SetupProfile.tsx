import Heading from 'components/base/Heading';
import Grid from 'components/base/Grid';
import Paragraph from 'components/base/Paragraph';
import SetupTips from 'components/join/SetupTips';

import ShareProfile from 'components/join/ShareProfile';

import { SocialVerificationFragment } from 'graphql/hasura/hasura-fragments.generated';
import Account from 'types/Account';
import TextLink from 'components/base/TextLink';

export interface SetupProfileProps {
  token: string;
  isApprovedCreator: boolean;
  twitterSocialVerification: SocialVerificationFragment;
  instagramSocialVerification: SocialVerificationFragment;
  currentUser: Account;
}

export default function SetupProfile(props: SetupProfileProps): JSX.Element {
  const {
    token,
    twitterSocialVerification,
    instagramSocialVerification,
    currentUser,
  } = props;

  return (
    <Grid
      css={{
        maxWidth: 1000,
        width: '100%',
        marginX: 'auto',
        paddingY: '$9',
        gap: '$8',
      }}
    >
      <Grid css={{ gap: '$8' }}>
        <Grid css={{ gap: '$6', textAlign: 'center' }}>
          <Heading size={6}>Set up your profile</Heading>
          <Paragraph css={{ marginX: 'auto' }}>
            Verify your account and create a profile that stands out.
          </Paragraph>
        </Grid>

        <Grid
          css={{
            gridTemplateColumns: 'repeat(2, 1fr)',
            backgroundColor: '$white100',
            borderRadius: '$2',
            boxShadow: '$0',
          }}
        >
          <SetupTips
            twitterSocialVerification={twitterSocialVerification}
            instagramSocialVerification={instagramSocialVerification}
            currentUser={currentUser}
            token={token}
          />

          <ShareProfile
            twitterSocialVerification={twitterSocialVerification}
            instagramSocialVerification={instagramSocialVerification}
            currentUser={currentUser}
          />
        </Grid>

        <TextLink
          css={{ marginX: 'auto' }}
          target="_blank"
          rel="noopener noreferrer"
          href="https://help.foundation.app/en/collections/2846848-creator-invites"
        >
          Learn more about creator invites
        </TextLink>
      </Grid>
    </Grid>
  );
}
