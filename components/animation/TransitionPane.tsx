import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface TransitionPaneProps {
  children: ReactNode;
}

export default function TransitionPane(
  props: TransitionPaneProps
): JSX.Element {
  const { children } = props;

  return (
    <motion.div
      style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
