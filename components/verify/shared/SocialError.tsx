/* eslint-disable react/jsx-max-depth */
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { includes } from 'ramda';

import Box from 'components/base/Box';
import Grid from 'components/base/Grid';
import Heading from 'components/base/Heading';
import Text from 'components/base/Text';
import Button from 'components/base/Button';
import { VerificationLaterStateContainer } from 'components/verify/VerificationContainer';

import { ServiceName } from 'types/SocialVerification';

import { useDeleteSocialVerification } from 'graphql/server/mutations/delete-social-verification.generated';
import Paragraph from 'components/base/Paragraph';

interface SocialErrorProps {
  reset?: any;
  serviceName?: ServiceName;
  failedReason?: string;
  redirectPath?: string;
  socialVerificationID?: string;
}

export default function SocialError(props: SocialErrorProps): JSX.Element {
  const {
    reset,
    serviceName = ServiceName.TWITTER,
    redirectPath,
    socialVerificationID,
    failedReason,
  } = props;

  const router = useRouter();

  const { mutateAsync: deleteInstagramVerification } =
    useDeleteSocialVerification();

  const failedReasonToShow =
    failedReason && includes('Ethereum address', failedReason)
      ? 'Your Ethereum address needs to be included somewhere in the tweet.'
      : failedReason;

  const handleDelete = useCallback(async () => {
    if (socialVerificationID) {
      await deleteInstagramVerification({
        id: socialVerificationID,
      });
    }
    await router.push(
      `/profile/verify/instagram?redirect-path=${redirectPath}`
    );
  }, [deleteInstagramVerification, socialVerificationID, redirectPath, router]);

  return (
    <VerificationLaterStateContainer>
      <Box>
        <Grid css={{ gap: '$4' }}>
          <Heading
            size={6}
            css={{ textAlign: 'center', marginBottom: '$4', maxWidth: 500 }}
          >
            There was an error while verifying your {serviceName} profile.
          </Heading>
          <Paragraph
            css={{ marginX: 'auto', marginBottom: '$4', maxWidth: 500 }}
          >
            Please try again.
          </Paragraph>
          {failedReason && (
            <Paragraph
              css={{
                marginBottom: '$4',
                maxWidth: 500,
                fontFamily: '$mono',
                color: '$red100',
              }}
            >
              {failedReasonToShow}
            </Paragraph>
          )}
          {serviceName === ServiceName.INSTAGRAM ? (
            <Button
              size="large"
              shape="regular"
              color="black"
              type="button"
              css={{
                width: '100%',
              }}
              onClick={handleDelete}
            >
              <Text>Retry verification</Text>
            </Button>
          ) : (
            <Button
              size="large"
              shape="regular"
              color="black"
              type="button"
              css={{
                width: '100%',
              }}
              onClick={reset}
            >
              <Text>Retry verification</Text>
            </Button>
          )}
        </Grid>
      </Box>
    </VerificationLaterStateContainer>
  );
}
