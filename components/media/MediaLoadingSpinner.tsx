import { AnimatePresence, motion } from 'framer-motion';

import Box from 'components/base/Box';
import SpinnerStroked from 'components/SpinnerStroked';

const animationProps = {
  initial: { opacity: 0 },
  exit: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { delay: 0.1, duration: 0.2 },
};

interface MediaLoadingSpinnerProps {
  isLoading: boolean;
  size?: number;
  color?: string;
}

export default function MediaLoadingSpinner(
  props: MediaLoadingSpinnerProps
): JSX.Element {
  const { isLoading, size, color = '$white100' } = props;
  return (
    <AnimatePresence initial={false}>
      {isLoading && (
        <motion.div {...animationProps}>
          <Box
            css={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              color: color,
            }}
          >
            <SpinnerStroked size={size} />
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
