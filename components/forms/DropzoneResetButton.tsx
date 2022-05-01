import Box from 'components/base/Box';

import CloseIcon from 'assets/icons/circle-close-icon.svg';

interface DropzoneResetButtonProps {
  onClick: () => void;
}

export default function DropzoneResetButton(
  props: DropzoneResetButtonProps
): JSX.Element {
  const { onClick } = props;
  return (
    <Box
      onClick={onClick}
      css={{
        position: 'absolute',
        top: '$5',
        right: '$5',
        cursor: 'pointer',
        zIndex: 3,
        color: '$black100',
        // TODO: use Icon + currentColor
        svg: {
          transition: 'color $1 $ease',
          '@hover': {
            '&:hover': {
              fill: '$black100',
              color: '$white100',
            },
          },
        },
      }}
    >
      <CloseIcon style={{ display: 'block' }} />
    </Box>
  );
}
