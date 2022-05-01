/* eslint-disable max-lines */
/* eslint-disable react/jsx-max-depth */

import Box from 'components/base/Box';
import Flex from 'components/base/Flex';
import Grid from 'components/base/Grid';
import ActivityCardImage from './ActivityCardImage';
import ActivityCardTitle from './ActivityCardTitle';
import UserTagInline from 'components/users/UserTagInline';

import { BasicArtwork } from 'types/Artwork';
import { ActivityCardProps } from './types';

import { styled } from 'stitches.config';
import { buildArtworkPath } from 'utils/artwork/artwork';

interface ActivityCardVerticalHeaderProps {
  artwork: BasicArtwork;
}

export function ActivityCardVerticalHeader(
  props: ActivityCardVerticalHeaderProps
): JSX.Element {
  const { artwork } = props;

  const creator = artwork.creator;

  const artworkPath = buildArtworkPath({ artwork, user: creator });

  return (
    <Grid
      css={{
        gap: '$4',
        gridTemplateColumns: '64px 1fr',
        alignItems: 'center',
        '@bp0': {
          gap: '$6',
        },
      }}
    >
      <ActivityCardImage artwork={artwork} />
      <Box>
        <Flex>
          <ActivityCardTitle href={artworkPath}>
            {artwork.name}
          </ActivityCardTitle>
        </Flex>
        <UserTagInline user={creator} />
      </Box>
    </Grid>
  );
}

const ActivityCardSection = styled(Box, {
  borderBottom: 'solid 1px $black10',
  padding: '$4',
  '@bp0': {
    padding: '$5',
  },
});

export default function ActivityCardVertical(
  props: ActivityCardProps
): JSX.Element {
  const {
    headerSection,
    priceSection,
    countdownSection,
    metaSection,
    actionSection,
  } = props;

  return (
    <Box
      css={{
        backgroundColor: '$white100',
        boxShadow: '$0',
        borderRadius: '$2',
        border: 'solid 1px $black10',
        '@bp1': {
          display: 'none',
        },
      }}
    >
      <ActivityCardSection>{headerSection}</ActivityCardSection>
      <Grid
        css={{
          '@bp0': {
            gridTemplateColumns: '1fr 1fr',
          },
        }}
      >
        <ActivityCardSection>{priceSection}</ActivityCardSection>
        <ActivityCardSection>{countdownSection}</ActivityCardSection>
      </Grid>

      {metaSection && <ActivityCardSection>{metaSection}</ActivityCardSection>}

      <ActivityCardSection>{actionSection}</ActivityCardSection>
    </Box>
  );
}
