import Paragraph from 'components/base/Paragraph';

import { ModalMode } from 'types/modal';

interface FollowsEmptyState {
  modalMode: ModalMode;
}

export default function FollowsEmptyState(
  props: FollowsEmptyState
): JSX.Element {
  const { modalMode } = props;
  if (modalMode === ModalMode.Following) {
    return (
      <Paragraph css={{ margin: 'auto' }}>
        This user isn’t following anyone.
      </Paragraph>
    );
  }
  if (modalMode === ModalMode.Followers) {
    return (
      <Paragraph css={{ margin: 'auto' }}>
        This user does not have any followers.
      </Paragraph>
    );
  }
  return null;
}
