/* eslint-disable react/jsx-max-depth */
import Box from 'components/base/Box';
import Grid from 'components/base/Grid';
import Heading from 'components/base/Heading';
import Body from 'components/base/Body';

import InstagramConnectLink from 'components/links/InstagramConnectLink';
import Image from 'next/image';
import Paragraph from 'components/base/Paragraph';
import Link from 'components/base/Link';

const BUTTON_AND_WARNING_WIDTH = 400;

export default function InstagramView(): JSX.Element {
  return (
    <Body
      css={{
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Grid css={{ gap: '$7' }}>
        <Box
          css={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: 460,
          }}
        >
          <Image
            src="/images/Instagram.png"
            alt="Instagram"
            width="80"
            height="80"
          />
          <Heading size={6} css={{ marginY: '$7', textAlign: 'center' }}>
            Verify your profile via Instagram
          </Heading>
          <Paragraph
            css={{ marginBottom: '$7', textAlign: 'center', maxWidth: 380 }}
          >
            Verify your profile to prove to the authenticity of your profile by
            connecting your Instagram account to Foundation.
          </Paragraph>
          <Box
            css={{
              padding: '$6',
              marginBottom: '$4',
              width: BUTTON_AND_WARNING_WIDTH,
              borderRadius: '$2',
              backgroundColor: '$black10',
            }}
          >
            <Paragraph css={{ textAlign: 'center', fontSize: '$0' }}>
              Please visit{' '}
              <Link
                href={`https://www.instagram.com`}
                css={{
                  textDecoration: 'none',
                  color: '$black60',
                  fontWeight: 600,
                  transition: 'color $2 $ease',
                  cursor: 'pointer',
                  '@hover': {
                    '&:hover': {
                      color: '$black100',
                    },
                  },
                }}
              >
                Instagram
              </Link>{' '}
              to ensure you are currently signed in to the account you want to
              verify.
            </Paragraph>
          </Box>
          <InstagramConnectLink width={BUTTON_AND_WARNING_WIDTH} />
        </Box>
      </Grid>
    </Body>
  );
}
