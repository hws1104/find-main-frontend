import Flex from 'components/base/Flex';
import Text from 'components/base/Text';
import UserTagV3 from 'components/users/UserTagV3';
import CollectionPopoverCard from 'components/collections/CollectionPopoverCard';
import ArtworkSplits from './ArtworkSplits';

import { UserFragment } from 'graphql/hasura/hasura-fragments.generated';
import { CollectionCardFragment } from 'types/Collection';

import { ArtworkPageSplitRecipient } from 'queries/server/artwork-page';

import { styled } from 'stitches.config';

import { notEmptyOrNil } from 'utils/helpers';

interface ArtworkInfoProps {
  user: UserFragment;
  collection: CollectionCardFragment;
  percentSplits: ArtworkPageSplitRecipient[];
  creatorPublicKey: string;
}

export default function ArtworkInfo(props: ArtworkInfoProps): JSX.Element {
  const { user, collection, percentSplits, creatorPublicKey } = props;

  const hasSplits = notEmptyOrNil(percentSplits);

  return (
    <ArtworkInfoContainer>
      {/* when it’s the only block pass no order variant */}
      <ArtworkInfoBlock>
        <ArtworkInfoHeading spacing="large">Created by</ArtworkInfoHeading>
        <Flex>
          <UserTagV3 user={user} />
        </Flex>
      </ArtworkInfoBlock>
      {hasSplits && (
        <ArtworkInfoBlock>
          <ArtworkInfoHeading spacing="large">Split with</ArtworkInfoHeading>
          <ArtworkSplits
            creatorPublicKey={creatorPublicKey}
            percentSplits={percentSplits}
          />
        </ArtworkInfoBlock>
      )}
      <ArtworkInfoBlock>
        <ArtworkInfoHeading spacing="large">Collection</ArtworkInfoHeading>
        <CollectionPopoverCard user={user} collection={collection} />
      </ArtworkInfoBlock>
    </ArtworkInfoContainer>
  );
}

export const ArtworkInfoHeading = styled(Text, {
  color: '$black60',
  fontWeight: 600,

  variants: {
    spacing: {
      regular: {
        marginBottom: '$1',
      },
      large: {
        marginBottom: '$3',
      },
    },
  },
});

export const ArtworkInfoBlock = styled(Flex, {
  flexDirection: 'column',
  justifyContent: 'space-between',
});

export const ArtworkInfoContainer = styled(Flex, {
  flexDirection: 'column',

  '@bp0': {
    flexDirection: 'row',
  },
  [`> ${ArtworkInfoBlock}:not(:last-of-type)`]: {
    paddingBottom: '$6',
    '@bp0': {
      paddingRight: '$6',
      paddingBottom: 0,
      marginRight: '$6',
      borderRight: '1px solid $black5',
    },
  },
});
