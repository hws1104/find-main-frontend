import { take, length } from 'ramda';
import { styled } from 'stitches.config';

import Flex from 'components/base/Flex';
import Text from 'components/base/Text';
import Box from 'components/base/Box';
import { UserStackInteractive } from 'components/follows/UserStack';

import useModal from 'hooks/use-modal';

import { ModalKey } from 'types/modal';

import { isEmptyOrNil } from 'utils/helpers';
import { UserFragment } from 'graphql/hasura/hasura-fragments.generated';

const CollectorsPill = styled(Flex, {
  backgroundColor: '$white100',
  boxShadow: '$0',
  borderRadius: '$round',
  paddingX: '$5',
  paddingY: '$3',
  alignItems: 'center',
  position: 'relative',
  transition: 'box-shadow $1 $ease',
  '@hover': {
    '&:hover': {
      boxShadow: '$1',
    },
  },
});

const CollectorsHeading = styled(Text, {
  fontFamily: '$body',
  fontSize: '$body',
  fontWeight: 600,
});

const ViewAllButton = styled(CollectorsHeading, {
  position: 'relative',
  zIndex: 2,
  marginLeft: '$5',
  color: '$black50',
  cursor: 'pointer',
  transition: 'color $1 $ease',
  display: 'none',
  '@bp1': {
    display: 'block',
  },
  '@hover': {
    '&:hover': {
      color: '$black100',
    },
  },
});

interface ProfileCollectorsProps {
  collectors: UserFragment[];
}

export default function ProfileCollectors(
  props: ProfileCollectorsProps
): JSX.Element {
  const { collectors } = props;

  const { setCurrentModal } = useModal();

  const topFiveCollectors = take(5, collectors);

  const openCollectorsModal = () => {
    setCurrentModal(ModalKey.COLLECTORS);
  };

  const hasNoCollectors = isEmptyOrNil(collectors);

  const hasMoreCollectors = length(collectors) > 5;

  if (hasNoCollectors) {
    return null;
  }

  return (
    <CollectorsPill>
      <Box
        onClick={openCollectorsModal}
        css={{
          position: 'absolute',
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          cursor: 'pointer',
          zIndex: 1,
        }}
      />
      <CollectorsHeading css={{ marginRight: '$3' }}>
        Collected by
      </CollectorsHeading>
      <Box css={{ position: 'relative', zIndex: 2 }}>
        <UserStackInteractive users={topFiveCollectors} />
      </Box>

      {hasMoreCollectors && (
        <ViewAllButton onClick={openCollectorsModal}>View all</ViewAllButton>
      )}
    </CollectorsPill>
  );
}
