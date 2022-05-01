import { ReactNode } from 'react';

import NextLink from 'next/link';

import Flex from 'components/base/Flex';
import { SquareAvatar } from 'components/base/Avatar';
import TextLink from 'components/base/TextLink';

import { buildCollectionPath, isFNDContractAddress } from 'utils/collections';
import { buildImgixUrlNew } from 'utils/assets';

import { AlgoliaCollection } from 'types/Algolia';
import { CollectionCardFragment } from 'types/Collection';

interface ArtworkCardCollectionProps {
  collection: CollectionCardFragment | AlgoliaCollection;
}

export default function ArtworkCardCollection(
  props: ArtworkCardCollectionProps
): JSX.Element {
  const { collection } = props;

  const AVATAR_SIZE = 24;

  const collectionImageUrl = buildImgixUrlNew({
    w: AVATAR_SIZE,
    h: AVATAR_SIZE,
    fit: 'crop',
    auto: 'format,compress',
    dpr: 2,
    frame: 1,
  });

  return (
    <CollectionContainer collection={collection}>
      {collection.collectionImageUrl && (
        <SquareAvatar
          imageUrl={collectionImageUrl(collection.collectionImageUrl)}
          css={{ marginRight: '$3' }}
          alt={collection.name}
          size={AVATAR_SIZE}
          shape={1}
        />
      )}
    </CollectionContainer>
  );
}

interface CollectionContainerProps {
  collection: CollectionCardFragment | AlgoliaCollection;
  children: ReactNode;
}

function CollectionContainer(props: CollectionContainerProps) {
  const { collection, children } = props;

  const isFndContract = isFNDContractAddress(collection?.contractAddress);

  if (!isFndContract) {
    return (
      <NextLink
        href={buildCollectionPath(collection)}
        passHref
        prefetch={false}
      >
        <TextLink
          css={{
            display: 'flex',
            alignItems: 'center',
            color: '$black60',
            fontWeight: 600,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            zIndex: 2,
          }}
        >
          {children}
          {collection.name}
        </TextLink>
      </NextLink>
    );
  } else {
    return (
      <Flex
        css={{
          alignItems: 'center',
          color: '$black100',
          fontWeight: 600,
          minWidth: 0,
        }}
      >
        {children}
        {collection.name}
      </Flex>
    );
  }
}
