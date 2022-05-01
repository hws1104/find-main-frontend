import CloseIcon from 'assets/icons/close-icon.svg';
import useModal from 'hooks/use-modal';
import Flex from 'components/base/Flex';
import { motion } from 'framer-motion';

interface ModalCloseButtonProps {
  className?: string;
}

export default function ModalCloseButton(
  props: ModalCloseButtonProps
): JSX.Element {
  const { className } = props;

  const { resetModal } = useModal();

  return (
    <motion.div>
      <Flex
        as={motion.div}
        onClick={resetModal}
        className={className}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        transition={{ duration: 0.1 }}
        css={{
          position: 'fixed',
          top: '$7',
          right: '$7',
          color: '$white100',
          backgroundColor: '$black100',
          width: 50,
          height: 50,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '$round',
          cursor: 'pointer',
          boxShadow: '$1',
          willChange: 'transform',
          '@hover': {
            '&:hover': {
              boxShadow: '$2',
            },
          },
        }}
      >
        <CloseIcon width={20} height={20} style={{ display: 'block' }} />
      </Flex>
    </motion.div>
  );
}
