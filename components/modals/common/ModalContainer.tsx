import { DialogOverlay } from '@reach/dialog';
import { ReactNode, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { ModalKey } from 'types/modal';

import { css } from 'stitches.config';

import useModal from 'hooks/use-modal';

import ModalCloseButton from '../ModalCloseButton';

const MotionDialogOverlay = motion(DialogOverlay);

const modalStyles = css({
  background: 'rgba(0, 0, 0, 0.8)',
  position: 'fixed',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  overflow: 'auto',
  paddingLeft: '$4',
  paddingRight: '$4',
  zIndex: 999,
  display: 'flex',
  willChange: 'opacity',
  backfaceVisibility: 'hidden',
  perspective: '1000px',
  transform: 'translate3d(0,0,0)',
  '@bp0': {
    paddingLeft: '$7',
    paddingRight: '$7',
  },
  '@bp1': {
    background: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(20px)',
  },
});

interface ModalContainerProps {
  children: ReactNode;
  modalKey: ModalKey;
  blockOverlayDismiss?: boolean;
  enableCloseButton?: boolean;
}

export default function ModalContainer(
  props: ModalContainerProps
): JSX.Element {
  const {
    children,
    modalKey,
    blockOverlayDismiss,
    enableCloseButton = true,
  } = props;

  const { currentModal, resetModal } = useModal();

  const isOpen = modalKey === currentModal;

  const onDismiss = useCallback(() => {
    if (blockOverlayDismiss) {
      return;
    }
    resetModal();
  }, [resetModal, blockOverlayDismiss]);

  return (
    <AnimatePresence exitBeforeEnter>
      {isOpen && (
        <>
          <MotionDialogOverlay
            initial={{ opacity: 0 }}
            transition={{ type: 'tween' }}
            onDismiss={onDismiss}
            className={modalStyles()}
            animate={{
              opacity: 1,
              transition: {
                when: 'beforeChildren',
                duration: 0.2,
              },
            }}
            exit={{
              opacity: 0,
              transition: {
                when: 'afterChildren',
                duration: 0.2,
              },
            }}
          >
            {enableCloseButton && <ModalCloseButton />}

            {children}
          </MotionDialogOverlay>
        </>
      )}
    </AnimatePresence>
  );
}
