import NextLink from 'next/link';

import { SquareAvatar } from 'components/base/Avatar';
import Flex from 'components/base/Flex';
import Mono from 'components/base/Mono';
import Heading from 'components/base/Heading';
import Card from 'components/base/Card';
import CollectionPopover from './CollectionPopover';

import { buildCollectionPath, isFNDContractAddress } from 'utils/collections';
import { buildAvatarUrl } from 'utils/assets';
import { truncateStringCenter } from 'utils/helpers';

import FNDLogo from 'assets/images/fnd-logo.svg';

import { UserFragment } from 'graphql/hasura/hasura-fragments.generated';
import { CollectionCardFragment } from 'types/Collection';

interface CollectionPopoverCardProps {
  user: UserFragment;
  collection: CollectionCardFragment;
}

const AVATAR_SIZE = 28;

export default function CollectionPopoverCard(
  props: CollectionPopoverCardProps
): JSX.Element {
  const { user, collection } = props;

  const isFndContract = isFNDContractAddress(collection.contractAddress);
  const collectionImageUrl = buildAvatarUrl(
    AVATAR_SIZE,
    collection.collectionImageUrl
  );

  return (
    <Flex>
      {isFndContract ? (
        <Flex
          center
          css={{
            background: '$black5',
            paddingY: '$3',
            paddingX: '$4',
            borderRadius: '$2',
          }}
        >
          <Flex
            center
            css={{
              backgroundColor: '$black100',
              borderRadius: '$1',
              padding: '$1',
              height: AVATAR_SIZE,
              width: AVATAR_SIZE,
              marginRight: '$2',
              color: '$white100',
            }}
          >
            <FNDLogo height={24} width={24} />
          </Flex>
          <Heading size={1}>{collection.name}</Heading>
        </Flex>
      ) : (
        <CollectionPopover collection={collection} user={user}>
          <NextLink href={buildCollectionPath(collection)} passHref>
            <Card
              as="a"
              isInteractive
              css={{
                display: 'flex',
                padding: '$4',
                alignItems: 'center',
                gap: '$4',
                textDecoration: 'none',
                color: '$black100',
              }}
            >
              {collectionImageUrl && (
                <SquareAvatar
                  imageUrl={collectionImageUrl}
                  alt={collection.name}
                  size={AVATAR_SIZE}
                  shape={1}
                />
              )}
              {collection.name ? (
                <Heading
                  size={2}
                  css={{
                    maxWidth: 200,
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {collection.name}
                </Heading>
              ) : (
                <Mono size={1}>
                  {truncateStringCenter(4, collection.contractAddress)}
                </Mono>
              )}
            </Card>
          </NextLink>
        </CollectionPopover>
      )}
    </Flex>
  );
}
