import { styled } from 'stitches.config';
import { motion } from 'framer-motion';

import Grid from 'components/base/Grid';
import Flex from 'components/base/Flex';
import UserTagV3 from 'components/users/UserTagV3';
import Text from 'components/base/Text';
import Box from 'components/base/Box';

import { ArtworkPageSplitRecipient } from 'queries/server/artwork-page';

const ANIMATION_DURATION = 0.15;

interface SplitsBreakdownRowProps {
  split: ArtworkPageSplitRecipient;
  index: number;
}

export default function SplitsBreakdownRow(
  props: SplitsBreakdownRowProps
): JSX.Element {
  const { split, index } = props;

  const sharePercentage = `${split.sharePercent}%`;

  return (
    <Grid css={{ gap: '$6', '@bp1': { gap: '$7' } }}>
      <Flex css={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <UserTagV3 user={split.user} hoverable />
        <Text size={3} weight={600}>
          {sharePercentage}
        </Text>
      </Flex>
      <ProgressBarContainer>
        <ProgressBar
          as={motion.div}
          initial={{ width: 0 }}
          animate={{ width: sharePercentage }}
          transition={{ delay: (index + 1) * ANIMATION_DURATION }}
        />
      </ProgressBarContainer>
    </Grid>
  );
}

// TODO: move these into a separate component
const ProgressBar = styled(Box, {
  background:
    'linear-gradient(110.78deg, #76E650 -1.13%, #F9D649 15.22%, #F08E35 32.09%, #EC5157 48.96%, #FF18BD 67.94%, #1A4BFF 85.34%, #62D8F9 99.57%)',
  height: 4,
  borderRadius: '$round',
});

const ProgressBarContainer = styled(Box, {
  height: 4,
  display: 'grid',
  gridTemplateRows: '1fr',
  backgroundColor: '$black10',
  borderRadius: '$round',
});
