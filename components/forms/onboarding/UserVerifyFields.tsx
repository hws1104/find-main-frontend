import { useRouter } from 'next/router';
import { useQueryClient } from 'react-query';

import TwitterIcon from 'assets/icons/twitter-icon.svg';
import InstagramIcon from 'assets/icons/instagram-icon.svg';

import { buildSocialLink } from 'utils/urls';
import { BUTTON_WIDTH } from 'utils/buttons';

import Flex from 'components/base/Flex';
import Box from 'components/base/Box';
import Grid from 'components/base/Grid';

import FormBlock from 'components/forms/FormBlock';
import TwitterVerifyLink from 'components/links/SocialVerifyLink';
import InstagramVerifyPageLink from 'components/links/InstagramVerifyPageLink';
import { SocialLinkRemoveable } from 'components/profiles/SocialLinkVerified';

import SocialVerification from 'types/SocialVerification';

import { useDeleteSocialVerification } from 'graphql/server/mutations/delete-social-verification.generated';
import Paragraph from 'components/base/Paragraph';

interface UserVerifyFieldsProps {
  twitterSocialVerification: SocialVerification;
  instagramSocialVerification: SocialVerification;
  token: string;
  publicAddress: string;
}

export default function UserVerifyFields(
  props: UserVerifyFieldsProps
): JSX.Element {
  const { twitterSocialVerification, instagramSocialVerification } = props;

  const router = useRouter();

  const queryClient = useQueryClient();

  const isTwitterUsernameValid = twitterSocialVerification?.isValid;
  const twitterUsername = twitterSocialVerification?.username;
  const isInstagramUsernameValid = instagramSocialVerification?.isValid;
  const instagramUsername = instagramSocialVerification?.username;

  const {
    mutateAsync: deleteTwitterVerification,
    isLoading: isDeleteTwitterVerificationLoading,
  } = useDeleteSocialVerification({
    onSuccess: () => {
      queryClient.invalidateQueries(['UserValidSocialVerificationsByService']);
    },
  });

  const {
    mutateAsync: deleteInstagramVerification,
    isLoading: isDeleteInstagramVerificationLoading,
  } = useDeleteSocialVerification({
    onSuccess: () => {
      queryClient.invalidateQueries(['UserValidSocialVerificationsByService']);
    },
  });

  return (
    <FormBlock
      title="Verify your profile"
      shouldShowBadge={true}
      hintText={
        <Paragraph css={{ marginBottom: '$6', '@bp1': { marginBottom: 0 } }}>
          Show the Foundation community that your profile is authentic.
        </Paragraph>
      }
    >
      <Grid css={{ gap: '$4' }}>
        {isTwitterUsernameValid ? (
          <Flex css={{ '@bp1': { justifyContent: 'flex-end' } }}>
            <SocialLinkRemoveable
              icon={
                <Flex css={{ width: 19 }}>
                  <TwitterIcon
                    style={{
                      display: 'block',
                      width: '100%',
                      height: 'auto',
                    }}
                  />
                </Flex>
              }
              handle={twitterUsername}
              linkBuilderFn={buildSocialLink.twitter}
              isLoading={isDeleteTwitterVerificationLoading}
              onClick={() =>
                deleteTwitterVerification({ id: twitterSocialVerification.id })
              }
            >
              @{twitterUsername}
            </SocialLinkRemoveable>
          </Flex>
        ) : (
          <Flex css={{ '@bp1': { justifyContent: 'flex-end' } }}>
            <Box css={{ width: BUTTON_WIDTH }}>
              <TwitterVerifyLink
                text="Verify via Twitter"
                redirectPath={router.asPath}
              />
            </Box>
          </Flex>
        )}
        {isInstagramUsernameValid ? (
          <Flex css={{ '@bp1': { justifyContent: 'flex-end' } }}>
            <SocialLinkRemoveable
              icon={
                <Flex css={{ width: 19 }}>
                  <InstagramIcon
                    style={{
                      display: 'block',
                      width: '100%',
                      height: 'auto',
                    }}
                  />
                </Flex>
              }
              handle={instagramUsername}
              linkBuilderFn={buildSocialLink.instagram}
              isLoading={isDeleteInstagramVerificationLoading}
              onClick={() =>
                deleteInstagramVerification({
                  id: instagramSocialVerification.id,
                })
              }
            >
              {instagramUsername}
            </SocialLinkRemoveable>
          </Flex>
        ) : (
          <Flex css={{ '@bp1': { justifyContent: 'flex-end' } }}>
            <Box css={{ width: BUTTON_WIDTH }}>
              <InstagramVerifyPageLink
                text="Verify via Instagram"
                redirectPath={router.asPath}
              />
            </Box>
          </Flex>
        )}
      </Grid>
    </FormBlock>
  );
}
