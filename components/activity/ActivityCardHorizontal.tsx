/* eslint-disable max-lines */
/* eslint-disable react/jsx-max-depth */
import { styled } from 'stitches.config';

import Box from 'components/base/Box';
import Flex from 'components/base/Flex';
import Grid from 'components/base/Grid';
import ActivityCardTitle from './ActivityCardTitle';
import ActivityCardImage from './ActivityCardImage';
import UserTagInline from 'components/users/UserTagInline';

import { buildArtworkPath } from 'utils/artwork/artwork';

import { BasicArtwork } from 'types/Artwork';
import { ActivityCardProps } from './types';

import { UserFragment } from 'graphql/hasura/hasura-fragments.generated';

interface ActivityCardHorizontalHeaderProps {
  artwork: BasicArtwork;
}

export function ActivityCardHorizontalHeader(
  props: ActivityCardHorizontalHeaderProps
): JSX.Element {
  const { artwork } = props;
  return <ActivityCardImage artwork={artwork} />;
}

const ActivityCardContainer = styled(Grid, {
  gap: '$6',
  gridTemplateColumns: '140px 1fr',
  alignItems: 'center',
  display: 'none',
  backgroundColor: '$white100',
  boxShadow: '$0',
  borderRadius: '$2',
  border: 'solid 1px $black10',
  padding: '$5',
  '@bp1': {
    display: 'grid',
    gap: '$6',
  },
  '@bp2': {
    padding: '$7',
    gridTemplateColumns: '220px 1fr',
    gap: '$7',
  },
  '@bp3': {
    gridTemplateColumns: '260px 1fr',
    gap: '$8',
  },
});

const ActivityCardPriceSection = styled(Box, {
  marginRight: '$5',
  paddingRight: '$5',
  borderRight: 'solid 1px $black10',
  '@bp2': {
    marginRight: '$7',
    paddingRight: '$7',
  },
});

const ActivityCardContentGrid = styled(Grid, {
  gridTemplateColumns: '1fr 220px',
  '@bp2': {
    gridTemplateColumns: '1fr 280px',
  },
  '@bp3': {
    gridTemplateColumns: '1fr 340px',
  },
});

export interface ActivityCardHorizontalProps extends ActivityCardProps {
  title: string;
  artwork: BasicArtwork;
  creator: UserFragment;
}

export default function ActivityCardHorizontal(
  props: ActivityCardHorizontalProps
): JSX.Element {
  const {
    headerSection,
    priceSection,
    countdownSection,
    actionSection,
    artwork,
    creator,
    title,
  } = props;

  const artworkPath = buildArtworkPath({ artwork, user: creator });

  return (
    <ActivityCardContainer>
      <Box>{headerSection}</Box>
      <ActivityCardContentGrid>
        <Grid>
          <Flex>
            <ActivityCardTitle href={artworkPath}>{title}</ActivityCardTitle>
          </Flex>
          <Box
            css={{
              marginBottom: '$5',
            }}
          >
            <UserTagInline user={creator} />
          </Box>
          <Flex>
            <ActivityCardPriceSection>{priceSection}</ActivityCardPriceSection>
            <Box>{countdownSection}</Box>
          </Flex>
        </Grid>
        <Flex
          expandVertical
          css={{
            paddingLeft: '$5',
            '@bp3': {
              paddingLeft: '$8',
            },
          }}
        >
          {actionSection}
        </Flex>
      </ActivityCardContentGrid>
    </ActivityCardContainer>
  );
}
