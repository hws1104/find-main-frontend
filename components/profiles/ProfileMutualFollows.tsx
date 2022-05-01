import Box from 'components/base/Box';
import Heading from 'components/base/Heading';
import Flex from 'components/base/Flex';
import TextLink from 'components/base/TextLink';
import FollowsAvatars from 'components/follows/FollowsAvatars';

import useFollowModal from 'hooks/use-follow-modal';

import { ModalMode } from 'types/modal';

interface ProfileMutualFollowsProps {
  currentUserPublicKey: string;
  publicKey: string;
  followerCount: number;
  isQueryEnabled: boolean;
}

export default function ProfileMutualFollows(
  props: ProfileMutualFollowsProps
): JSX.Element {
  const { currentUserPublicKey, publicKey, followerCount, isQueryEnabled } =
    props;

  const { toggleModal } = useFollowModal(publicKey);

  const hasFollowers = followerCount > 0;

  if (!hasFollowers) {
    return null;
  }

  return (
    <Box>
      <Heading size={2}>Followed by</Heading>
      <Flex css={{ paddingTop: '$4', paddingBottom: '$5' }}>
        <FollowsAvatars
          publicKey={publicKey}
          currentUserPublicKey={currentUserPublicKey}
          isQueryEnabled={isQueryEnabled}
          isInteractive={true}
          avatarsCount={5}
        />
      </Flex>
      <Flex>
        <TextLink
          css={{ fontSize: '$2' }}
          onClick={() => toggleModal(ModalMode.Followers)}
        >
          View all
        </TextLink>
      </Flex>
    </Box>
  );
}
