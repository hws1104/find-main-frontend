import CardGrid from 'components/CardGrid';
import Box from 'components/base/Box';
import Grid from 'components/base/Grid';
import FeaturedSectionHeading from 'components/FeaturedSectionHeading';
import HomePageButton from 'components/buttons/HomePageButton';
import ArtworkCard from 'components/cards/artwork/ArtworkCard';

import Artwork from 'types/Artwork';

import { ArtworkFragmentExtended } from 'graphql/hasura/hasura-fragments.generated';

interface FeaturedArtworksProps {
  featuredArtworks: ArtworkFragmentExtended[];
  publicAddress: string;
}

export default function FeaturedArtworks(
  props: FeaturedArtworksProps
): JSX.Element {
  const { featuredArtworks } = props;

  if (!featuredArtworks) {
    return null;
  }

  return (
    <Box>
      <FeaturedSectionHeading
        link={{ href: '/artworks', text: 'View all artworks' }}
      >
        Featured artworks
      </FeaturedSectionHeading>
      <Grid css={{ gap: '$7' }}>
        <CardGrid>
          {featuredArtworks.map((artwork: Artwork) => (
            <ArtworkCard
              artwork={artwork}
              creator={artwork.creator}
              currentUser={null}
              key={artwork.id}
            />
          ))}
        </CardGrid>
        <HomePageButton href="/artworks">View all artworks</HomePageButton>
      </Grid>
    </Box>
  );
}
