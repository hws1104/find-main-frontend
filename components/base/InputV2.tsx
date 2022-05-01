import { styled } from 'stitches.config';

const InputV2 = styled('input', {
  fontFamily: '$body',
  fontWeight: 500,
  fontSize: '$1',
  lineHeight: 1.2,
  minHeight: 60,
  display: 'flex',
  alignItems: 'center',
  appearance: 'none',
  borderRadius: '$2',
  border: 'solid 1px $black10',
  width: '100%',
  paddingX: '$5',
  paddingY: '$4',
  transition: 'box-shadow $1 $ease, border-color $1 $ease',
  '&::placeholder': {
    color: '$black40',
    transition: 'color $1 $ease',
  },
  '&:disabled': {
    cursor: 'not-allowed',
    backgroundColor: '$black5',
    boxShadow: 'none',
    border: 'solid 1px $black10',
  },
  '@hover': {
    '&:hover': {
      boxShadow: '0px 0px 0px 2px rgba(0, 0, 0, 0.15)',
      borderColor: '$black40',
      '&::placeholder': {
        color: '$black60',
      },
    },
  },
  '&:focus': {
    outline: 'none',
    borderColor: '$black100',
    boxShadow: '0px 0px 0px 2px rgba(0, 0, 0, 0.15)',
  },
  variants: {
    isInvalid: {
      true: {
        borderColor: '$red100',
        boxShadow: '0px 0px 0px 2px rgba(249, 58, 58, 0.15)',
        '&:focus': {
          outline: 'none',
          borderColor: '$red100',
          boxShadow: '0px 0px 0px 2px rgba(249, 58, 58, 0.15)',
        },
      },
    },
  },
});

export default InputV2;
