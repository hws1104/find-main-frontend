import { AnimatePresence, motion } from 'framer-motion';
import { CSS, styled } from 'stitches.config';

import Text from 'components/base/Text';
import Box from 'components/base/Box';

import SpinnerStroked from 'components/SpinnerStroked';

interface ArtworkCardOptimizingProps {
  css?: CSS;
  isVisible: boolean;
}

const MotionBox = styled(motion.div, {
  backgroundColor: '$black100',
  color: '$white100',
  borderRadius: '$round',
  position: 'absolute',
  lineHeight: 1,
  display: 'flex',
  padding: '$2',
  alignItems: 'center',
  zIndex: 9,
});

export default function ArtworkCardOptimizing(
  props: ArtworkCardOptimizingProps
): JSX.Element {
  const { css, isVisible } = props;

  return (
    <AnimatePresence>
      {isVisible && (
        <MotionBox
          css={css as any}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: [1, 0, 0], y: -20 }}
          transition={{
            duration: 0.35,
            type: 'spring',
          }}
        >
          <Box>
            <SpinnerStroked size={14} />
          </Box>
          <Text weight={600} css={{ marginLeft: '$2' }}>
            Processing…
          </Text>
        </MotionBox>
      )}
    </AnimatePresence>
  );
}
