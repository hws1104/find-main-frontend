import { styled } from 'stitches.config';
import { ReactNode } from 'react';

import Box from 'components/base/Box';
import Background from 'components/Background';
import Flex from 'components/base/Flex';
import CollectionStats, { CollectionStatsContainer } from './CollectionStats';
import PopoverShare from 'components/popover/PopoverShare';
import CollectionAdminPopover from './CollectionAdminPopover';
import Overlay from 'components/base/Overlay';

import type { CollectionStats as ICollectionStats } from 'graphql/hasura/queries/collection-stats.generated';
import { UserFragment } from 'graphql/hasura/hasura-fragments.generated';

interface CollectionHeroContainerProps {
  coverImage: string;
  contractSlug: string;
  children: ReactNode;
  collectionTweet: string;
  collectionStats: ICollectionStats;
  currentUser: UserFragment;
}

export default function CollectionHeroContainer(
  props: CollectionHeroContainerProps
): JSX.Element {
  const {
    coverImage,
    contractSlug,
    collectionStats,
    collectionTweet,
    children,
    currentUser,
  } = props;

  return (
    <Wrapper>
      {coverImage && (
        <Overlay
          css={{
            zIndex: -1,
            minHeight: 600,
            '@bp1': {
              minHeight: 760,
            },
          }}
        />
      )}
      <Background
        css={{
          backgroundColor: '$black5',
          minHeight: 510,
          '@bp1': {
            minHeight: 760,
          },
        }}
        style={{ backgroundImage: coverImage ? `url(${coverImage})` : null }}
      />
      <InnerWrapper>{children}</InnerWrapper>
      <CollectionStatsContainer>
        <CollectionStats
          contractSlug={contractSlug}
          initialData={collectionStats}
        />
        <Flex
          css={{
            display: 'none',
            position: 'absolute',
            zIndex: 3,
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            paddingRight: '$6',
            '@bp1': {
              display: 'flex',
            },
          }}
        >
          <CollectionAdminPopover
            css={{ marginRight: '$4' }}
            currentUserIsAdmin={currentUser?.isAdmin}
          />
          <PopoverShare shareText={collectionTweet} />
        </Flex>
      </CollectionStatsContainer>
    </Wrapper>
  );
}

const Wrapper = styled(Flex, {
  position: 'relative',
  alignItems: 'flex-end',
  minHeight: 600,
  '@bp1': {
    minHeight: 760,
  },
});

const InnerWrapper = styled(Box, {
  maxWidth: '$container',
  zIndex: 1,
  paddingX: '$6',
  paddingY: '$10',
  marginX: 'auto',
  flexGrow: 1,
  '@bp0': {
    paddingY: '$11',
  },
});
