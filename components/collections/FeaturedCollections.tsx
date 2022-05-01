import CardGrid from 'components/CardGrid';
import Box from 'components/base/Box';
import CollectionCard from 'components/cards/collections/CollectionCard';
import FeaturedSectionHeading from 'components/FeaturedSectionHeading';

import { CollectionFragmentExtended } from 'graphql/hasura/hasura-fragments.generated';

import { isEmptyOrNil } from 'utils/helpers';

interface FeaturedCollectionsProps {
  collections: CollectionFragmentExtended[];
}

export default function FeaturedCollections(
  props: FeaturedCollectionsProps
): JSX.Element {
  const { collections } = props;

  const hasNoCollections = isEmptyOrNil(collections);

  if (hasNoCollections) {
    return null;
  }

  return (
    <Box>
      <FeaturedSectionHeading
        link={{ href: '/collections', text: 'View all collections' }}
      >
        Featured collections
      </FeaturedSectionHeading>
      <CardGrid>
        {collections.map((collection) => {
          return (
            <CollectionCard
              key={collection.id}
              collection={collection}
              creator={collection.creator}
            />
          );
        })}
      </CardGrid>
    </Box>
  );
}
