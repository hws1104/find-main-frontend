import Flex from 'components/base/Flex';
import { styled } from 'stitches.config';

const DropzoneContainer = styled(Flex, {
  background: '$white100',
  position: 'relative',
  border: '1px dashed $black10',
  borderRadius: '$2',
  justifyContent: 'center',
  alignItems: 'center',
  color: '$black60',
  transition: 'color $0 $ease, border-color $0 $ease',
  variants: {
    isInteractive: {
      true: {
        cursor: 'pointer',
      },
    },
    isActive: {
      true: {
        borderColor: '$black60',
        color: '$black100',
      },
    },
  },
});

export default DropzoneContainer;
