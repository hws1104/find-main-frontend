import Box from 'components/base/Box';
import Flex from 'components/base/Flex';
import Grid from 'components/base/Grid';
import Heading from 'components/base/Heading';
import TextLink from 'components/base/TextLink';
import Paragraph from 'components/base/Paragraph';

import { keyframes, styled } from 'stitches.config';

interface DropzoneUploadProgressProps {
  uploadProgress: number;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function DropzoneUploadProgress(
  props: DropzoneUploadProgressProps
) {
  const { uploadProgress } = props;

  return (
    <Flex css={{ height: '100%', paddingBottom: '$8' }} center expandVertical>
      <Grid css={{ gap: '$8' }}>
        <Heading size={6} css={{ textAlign: 'center' }}>
          Uploading to IPFS…
        </Heading>

        <Box css={{ width: 640 }}>
          <ProgressBar uploadProgress={uploadProgress} />
        </Box>
        <Grid
          css={{
            gap: '$4',
            textAlign: 'center',
            justifyContent: 'center',
          }}
        >
          <Paragraph css={{ maxWidth: 480 }}>
            The InterPlanetary File System, known as IPFS, is a peer-to-peer
            network for sharing data in a distributed file system.
          </Paragraph>
          <TextLink
            href="https://help.foundation.app/en/articles/4784859-what-are-the-technical-specs"
            target="_blank"
            rel="noreferrer"
          >
            Learn more about IPFS →
          </TextLink>
        </Grid>
      </Grid>
    </Flex>
  );
}

const translate = keyframes({
  '0%': { backgroundPositionX: 0 },
  '100%': { backgroundPositionX: '-150000px' },
});

const RainbowBar = styled(Box, {
  animation: `${translate} 400s linear infinite`,
  animationFillMode: 'backwards',
  transition: 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
  background:
    'linear-gradient(89.98deg, #76E650 0%, #F9D649 12.5%, #F08E35 25%, #EC5157 37.5%, #FF18BD 50%, #1A4BFF 62.5%, #62D8F9 75%, #76E650 87.5%)',
  backgroundSize: '800px auto',
  backgroundColor: '$black50',
  borderRadius: '$round',
});

interface ProgressBarProps {
  uploadProgress: number;
}

// TODO: put this into its own component
function ProgressBar(props: ProgressBarProps) {
  const { uploadProgress } = props;

  return (
    <Flex
      css={{
        height: 10,
        backgroundColor: '$black10',
        borderRadius: '$round',
        position: 'relative',
      }}
    >
      <RainbowBar style={{ width: `${uploadProgress}%` }} css={{ zIndex: 2 }} />
      <RainbowBar
        style={{ width: `${uploadProgress}%` }}
        css={{
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          filter: 'blur(8px)',
          zIndex: 1,
        }}
      />
    </Flex>
  );
}
