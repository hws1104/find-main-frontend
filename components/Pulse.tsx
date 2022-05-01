import { motion } from 'framer-motion';

interface PulseProps {
  size: number;
}

export default function Pulse(props: PulseProps): JSX.Element {
  const { size = 10 } = props;

  return (
    <motion.div
      style={{
        width: size,
        height: size,
        backgroundColor: 'black',
        borderRadius: 999,
      }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0.95, 1, 0.95],
      }}
      transition={{
        ease: 'linear',
        repeat: Infinity,
        duration: 2,
      }}
    />
  );
}
