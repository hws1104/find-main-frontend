import { ArtworkFragmentExtended } from 'graphql/hasura/hasura-fragments.generated';
import Box from 'components/base/Box';
import UserTagInline from 'components/users/UserTagInline';
import { AlgoliaArtwork } from 'types/Algolia';

interface ArtworkCardCreatorProps {
  artwork: ArtworkFragmentExtended | AlgoliaArtwork;
}

export default function ArtworkCardCreator(
  props: ArtworkCardCreatorProps
): JSX.Element {
  const { artwork } = props;

  const creator = artwork?.creator;

  return (
    <Box
      css={{
        zIndex: 2,
        minWidth: 0,
        paddingY: '$2',
      }}
    >
      <UserTagInline user={creator} />
    </Box>
  );
}
