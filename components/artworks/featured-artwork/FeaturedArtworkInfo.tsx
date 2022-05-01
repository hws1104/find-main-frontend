import Flex from 'components/base/Flex';
import UserTagV3 from 'components/users/UserTagV3';
import CollectionPopoverCard from 'components/collections/CollectionPopoverCard';

import { UserFragment } from 'graphql/hasura/hasura-fragments.generated';
import { CollectionCardFragment } from 'types/Collection';
import { HandleSegmentEventFn } from './types';

import {
  ArtworkInfoBlock,
  ArtworkInfoContainer,
  ArtworkInfoHeading,
} from '../ArtworkInfo';

interface FeaturedArtworkInfoProps {
  user: UserFragment;
  collection: CollectionCardFragment;
  handleSegmentEvent: HandleSegmentEventFn;
}

export default function FeaturedArtworkInfo(
  props: FeaturedArtworkInfoProps
): JSX.Element {
  const { user, collection, handleSegmentEvent } = props;

  return (
    <ArtworkInfoContainer>
      <ArtworkInfoBlock onClick={() => handleSegmentEvent('created_by_pill')}>
        <ArtworkInfoHeading spacing="large">Created by</ArtworkInfoHeading>
        <Flex css={{ marginY: 'auto' }}>
          <UserTagV3 user={user} />
        </Flex>
      </ArtworkInfoBlock>
      <ArtworkInfoBlock>
        <ArtworkInfoHeading spacing="large">Collection</ArtworkInfoHeading>
        <CollectionPopoverCard user={user} collection={collection} />
      </ArtworkInfoBlock>
    </ArtworkInfoContainer>
  );
}
