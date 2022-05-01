import { styled } from 'stitches.config';
import CircleAvatar from 'components/avatars/CircleAvatar';
import GraySquare from 'components/base/GraySquare';

interface UserDropdownButtonProps {
  isLoading: boolean;
  publicKey: string;
  avatarUrl: string;
  onClick: () => void;
}

export default function UserDropdownButton(
  props: UserDropdownButtonProps
): JSX.Element {
  const { isLoading, avatarUrl, publicKey, onClick } = props;

  return (
    <Button onClick={onClick}>
      {isLoading ? (
        <GraySquare
          css={{
            background: '$black5',
            height: 42,
            width: 42,
            borderRadius: '$round',
          }}
        />
      ) : (
        <CircleAvatar
          publicKey={publicKey}
          imageUrl={avatarUrl}
          maxSize={42}
          css={{ width: 42, height: 42 }}
        />
      )}
    </Button>
  );
}

const Button = styled('button', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '$white100',
  border: 'unset',
  boxShadow: '$0',
  padding: 6,
  height: 54,
  width: 54,
  borderRadius: '$round',
  marginLeft: 'auto',
  cursor: 'pointer',
  willChange: 'transform',
  transition: 'transform $1 $ease, box-shadow $1 $ease',
  '@hover': {
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '$1',
    },
    '&:active': {
      transform: 'translateY(0)',
      boxShadow: '$0',
    },
  },
  '&:focus-visible': {
    outline: 'none',
    boxShadow: '$0',
  },
});
