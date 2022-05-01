import { ReactNode } from 'react';
import { DialogContent } from '@reach/dialog';
import { motion } from 'framer-motion';
import { CSS, styled } from 'stitches.config';
interface ModalContentProps {
  children?: ReactNode;
  css?: CSS;
}

const StyledDialogContent = styled(DialogContent, {
  display: 'flex',
  flex: 'auto',
  flexDirection: 'column',
  justifyContent: 'center',
  boxShadow: '$1',
  backgroundColor: '$white100',
  paddingX: '$6',
  paddingBottom: '$6',
  paddingTop: '$7',
  maxWidth: 400,
  width: '100%',
  margin: 'auto',
  borderRadius: '$3',
  '@bp1': {
    paddingX: '$7',
    paddingBottom: '$7',
  },
});
const MotionDialogContent = motion(StyledDialogContent);

export default function ModalContent(props: ModalContentProps): JSX.Element {
  const { children, css } = props;
  return (
    <MotionDialogContent
      aria-label="Modal"
      initial={{ opacity: 0, y: 15 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: {
          delay: 0.1,
          duration: 0.1,
        },
      }}
      exit={{
        opacity: 0,
        y: 15,
        transition: {
          delay: 0,
          duration: 0.5,
        },
      }}
      transition={{ duration: 0.1, type: 'tween' }}
      css={css as any}
    >
      {children}
    </MotionDialogContent>
  );
}
