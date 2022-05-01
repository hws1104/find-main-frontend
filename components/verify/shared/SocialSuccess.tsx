/* eslint-disable react/jsx-max-depth */
import Box from 'components/base/Box';
import Grid from 'components/base/Grid';
import Button from 'components/base/Button';
import Heading from 'components/base/Heading';
import Text from 'components/base/Text';
import Flex from 'components/base/Flex';
import Paragraph from 'components/base/Paragraph';
import Link from 'components/base/Link';

import { VerificationLaterStateContainer } from 'components/verify/VerificationContainer';

interface SocialSuccessProps {
  redirectPath: string;
  serviceName?: string;
}

export default function SocialSuccess({
  redirectPath,
  serviceName = 'Twitter',
}: SocialSuccessProps): JSX.Element {
  return (
    <VerificationLaterStateContainer>
      <Box>
        <Grid css={{ gap: '$4' }}>
          <Flex css={{ justifyContent: 'center' }}>
            <Heading
              size={6}
              css={{
                marginBottom: '$4',
                maxWidth: 640,
                textAlign: 'center',
              }}
            >
              Your profile has been verified via {serviceName}!
            </Heading>
          </Flex>

          <Grid css={{ maxWidth: 260, marginX: 'auto', gap: '$7' }}>
            <Paragraph css={{ textAlign: 'center' }}>
              You’ve successfully verified your {serviceName} profile on
              Foundation.
            </Paragraph>

            <Link href={redirectPath} css={{ display: 'block' }}>
              <Button
                size="large"
                shape="regular"
                color="black"
                type="button"
                css={{
                  width: '100%',
                  paddingRight: '36px',
                }}
              >
                <Text css={{ marginLeft: '$4', position: 'relative', top: -2 }}>
                  Continue
                </Text>
              </Button>
            </Link>
          </Grid>
        </Grid>
      </Box>
    </VerificationLaterStateContainer>
  );
}
