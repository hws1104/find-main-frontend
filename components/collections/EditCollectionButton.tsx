import { ReactNode } from 'react';
import Button, { ButtonVariants } from 'components/base/Button';

interface EditCollectionButtonProps {
  openModal: () => void;
  children: ReactNode;
  color: ButtonVariants['color'];
}

export default function EditCollectionButton(
  props: EditCollectionButtonProps
): JSX.Element {
  const { openModal, children, color } = props;
  return (
    <Button
      hoverable
      shape="round"
      size="medium"
      appearance="ghost"
      color={color}
      css={{
        display: 'none',
        paddingX: '$6',
        '@bp1': {
          display: 'block',
        },
      }}
      onClick={openModal}
    >
      {children}
    </Button>
  );
}
