import { styled } from 'stitches.config';

import Box from 'components/base/Box';
import Flex from 'components/base/Flex';
import Icon from 'components/Icon';
import UserStackV2 from 'components/users/UserStackV2';
import SplitsModal from 'components/modals/SplitsModal';

import SplitIcon from 'assets/icons/split-icon.svg';

import { ArtworkPageSplitRecipient } from 'queries/server/artwork-page';

import { ModalKey } from 'types/modal';

import { areKeysEqual } from 'utils/users';

import useModal from 'hooks/use-modal';

const IconContainer = styled(Box, {
  color: '$black20',
  marginRight: '$6',
  transition: 'color $0 $ease',
});

const ArtworkSplitContainer = styled(Flex, {
  boxShadow: '$0',
  borderRadius: '$round',
  minHeight: 52,
  alignItems: 'center',
  paddingLeft: '$6',
  paddingRight: '$3',
  cursor: 'pointer',
  transition: 'transform $1 $ease, box-shadow $1 $ease',
  willChange: 'transform',
  '@hover': {
    '&:hover': {
      boxShadow: '$1',
      transform: 'translateY(-2px)',
      [`& ${IconContainer}`]: {
        color: '$black100',
      },
    },
    '&:active': {
      boxShadow: '$0',
      transform: 'translateY(0)',
    },
  },
});

interface ArtworkSplitsProps {
  percentSplits: ArtworkPageSplitRecipient[];
  creatorPublicKey: string;
}

export default function ArtworkSplits(props: ArtworkSplitsProps): JSX.Element {
  const { percentSplits, creatorPublicKey } = props;

  const splitUsers = percentSplits
    .map((share) => share.user)
    .filter((user) => !areKeysEqual([user.publicKey, creatorPublicKey]));

  const { setCurrentModal } = useModal();

  const openSplitsModal = () => {
    setCurrentModal(ModalKey.ARTWORK_SPLITS);
  };

  return (
    <>
      <SplitsModal percentSplits={percentSplits} />
      <Flex>
        <ArtworkSplitContainer onClick={openSplitsModal}>
          <IconContainer>
            <Icon icon={SplitIcon} width={24} height={20} />
          </IconContainer>
          <UserStackV2 users={splitUsers} />
        </ArtworkSplitContainer>
      </Flex>
    </>
  );
}
