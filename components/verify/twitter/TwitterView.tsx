/* eslint-disable react/jsx-max-depth */
import useWalletSession from 'hooks/web3/wallet/use-wallet-session';
import useUserByPublicKey from 'hooks/queries/use-user-by-public-key';

import TwitterForm from 'components/verify/twitter/TwitterForm';
import TextField from 'components/forms/fields/TextField';
import SubmitButton from 'components/forms/SubmitButton';
import { VerificationFormContainer } from 'components/verify/VerificationContainer';
import TwitterShareButtonLink from 'components/links/TwitterShareButtonLink';

import { buildVerifyTweet } from 'utils/twitter-templates';

import { TwitterFormValues } from './types';

import { getUsernameOrAddress } from 'utils/helpers';
import Grid from 'components/base/Grid';
import Box from 'components/base/Box';
import Flex from 'components/base/Flex';
import Heading from 'components/base/Heading';
import Text from 'components/base/Text';

interface TwitterViewProps {
  onSubmit: (values: TwitterFormValues) => void;
}

export default function TwitterView(props: TwitterViewProps): JSX.Element {
  const { onSubmit } = props;

  const { data: user } = useWalletSession();

  const { data: userData } = useUserByPublicKey({
    publicKey: user?.publicAddress,
  });

  const twitterShareText = buildVerifyTweet({
    creatorName: `${getUsernameOrAddress(userData?.user)}`,
    creatorAddress: user?.publicAddress,
    profilePath: `/${getUsernameOrAddress(userData?.user)}`,
  });

  return (
    <VerificationFormContainer>
      <TwitterForm
        onSubmit={onSubmit}
        initialValues={{
          tweetURL: '',
        }}
      >
        <Grid css={{ gridGap: '$7' }}>
          <Flex
            center
            css={{
              flexDirection: 'column',
            }}
          >
            <Heading size={6} css={{ marginBottom: '$7' }}>
              Verify your profile via Twitter
            </Heading>
          </Flex>
          <Box
            css={{
              paddingY: '$9',
              boxShadow: '$1',
              borderRadius: '$2',
              backgroundColor: '$white100',
            }}
          >
            <Box
              css={{
                paddingX: '$9',
                marginBottom: '$7',
                borderBottom: 'solid 1px $black5',
              }}
            >
              <Text
                size={2}
                weight={600}
                css={{ color: '$black60', marginBottom: '$4' }}
              >
                Step One
              </Text>
              <Grid
                css={{
                  gridGap: '$6',
                  gridtemplateColumns: '1fr',
                  '@bp1': {
                    gridTemplateColumns: '2fr 1fr',
                  },
                }}
              >
                <Box css={{ marginBottom: '$8', maxWidth: 370 }}>
                  <Heading size={3} css={{ marginBottom: '$4', maxWidth: 370 }}>
                    Post a public tweet that contains your wallet address.
                  </Heading>
                  <Text size={1} css={{ marginBottom: '$2' }}>
                    Your wallet address is
                  </Text>
                  <Text>{user?.publicAddress}</Text>
                </Box>
                <Box>
                  <TwitterShareButtonLink
                    twitterShareText={twitterShareText}
                    text={'Post Tweet'}
                  />
                </Box>
              </Grid>
            </Box>
            <Box css={{ paddingX: '$9' }}>
              <Text
                size={2}
                weight={600}
                css={{ color: '$black60', marginBottom: '$4' }}
              >
                Step Two
              </Text>
              <Heading size={3} css={{ marginBottom: '$8', maxWidth: 330 }}>
                Paste the URL of the tweet to verify your profile.
              </Heading>
            </Box>

            <Grid css={{ gridGap: '$6' }}>
              <Grid css={{ paddingX: '$9' }}>
                <Box>
                  <TextField
                    placeholder="Tweet URL"
                    name="tweetURL"
                    label="Tweet URL"
                    required={false}
                  />
                </Box>
              </Grid>
              <Box css={{ paddingX: '$9' }}>
                <SubmitButton submittingText="Confirm" disableIfInvalid>
                  Confirm
                </SubmitButton>
              </Box>
            </Grid>
          </Box>
        </Grid>
      </TwitterForm>
    </VerificationFormContainer>
  );
}
