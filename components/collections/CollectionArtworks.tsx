import NextLink from 'next/link';

import CardGrid from 'components/CardGrid';
import ArtworkCard from 'components/cards/artwork/ArtworkCard';
import ArtworkCardSkeleton from 'components/cards/artwork/ArtworkCardSkeleton';
import CollectionEmptyState from 'components/collections/CollectionEmptyState';
import Flex from 'components/base/Flex';
import Paragraph from 'components/base/Paragraph';
import Heading from 'components/base/Heading';
import Button from 'components/base/Button';

import { ArtworkV2 } from 'types/Artwork';
import WalletUser from 'types/WalletUser';
import { ModalKey } from 'types/modal';

import MediaIcons from 'assets/images/media.svg';

interface CollectionArtworksProps {
  isLoading: boolean;
  hasArtworks: boolean;
  collectionArtworks: ArtworkV2[];
  currentUser: WalletUser;
  isOwnerOnCollection: boolean;
  unstyledCollection: boolean;
  setCurrentModal: (value: ModalKey) => void;
  emptyCollection: boolean;
  contractAddress: string;
}

export default function CollectionArtworks(
  props: CollectionArtworksProps
): JSX.Element {
  const {
    isLoading,
    hasArtworks,
    collectionArtworks,
    currentUser,
    isOwnerOnCollection,
    unstyledCollection,
    setCurrentModal,
    emptyCollection,
    contractAddress,
  } = props;

  if (isLoading) {
    return (
      <CardGrid>
        {[...Array(8)].map((_, index) => (
          <ArtworkCardSkeleton key={index} />
        ))}
      </CardGrid>
    );
  }

  if (hasArtworks) {
    return (
      <CardGrid>
        {collectionArtworks.map((artwork) => (
          <ArtworkCard
            key={artwork.id}
            artwork={artwork}
            creator={artwork.creator}
            currentUser={currentUser}
            isCurrentUserProfile={true}
          />
        ))}
      </CardGrid>
    );
  }

  if (isOwnerOnCollection && unstyledCollection) {
    return (
      <Flex
        css={{
          paddingY: '$5',
          marginX: 'auto',
          maxWidth: 500,
          minHeight: 400,
          '@bp1': {
            minHeight: 600,
          },
        }}
        center
        expandVertical
      >
        <Heading
          size={{ '@initial': 3, '@bp1': 4 }}
          css={{ textAlign: 'center', marginBottom: '$5' }}
        >
          Customize your collection
        </Heading>
        <Paragraph
          css={{
            textAlign: 'center',
            marginX: 'auto',
            marginBottom: '$7',
            maxWidth: 280,
          }}
        >
          Before you mint an NFT to your collection, customize it by uploading a
          logo, cover image, and description.
        </Paragraph>
        <Button
          color="black"
          hoverable
          shape="regular"
          size="large"
          onClick={() => setCurrentModal(ModalKey.EDIT_COLLECTION)}
          css={{ minWidth: 200 }}
        >
          Edit Collection
        </Button>
      </Flex>
    );
  }
  if (isOwnerOnCollection && emptyCollection) {
    return (
      <Flex
        css={{
          paddingY: '$5',
          minHeight: 400,
          '@bp1': {
            minHeight: 600,
          },
        }}
        center
        expandVertical
      >
        <MediaIcons />

        <Heading
          size={{ '@initial': 3, '@bp1': 4 }}
          css={{ textAlign: 'center', marginBottom: '$5', paddingTop: '$6' }}
        >
          Add artworks to your collection
        </Heading>
        <Paragraph
          css={{
            textAlign: 'center',
            marginX: 'auto',
            marginBottom: '$7',
            maxWidth: 280,
          }}
        >
          This collection is currently empty. Get it started by minting the
          first NFT.
        </Paragraph>
        <NextLink
          href={`/create/upload?contractAddress=${contractAddress}`}
          passHref
          prefetch={false}
        >
          <Button
            as="a"
            color="black"
            hoverable
            shape="regular"
            size="large"
            css={{ minWidth: 200 }}
          >
            Mint an NFT
          </Button>
        </NextLink>
      </Flex>
    );
  }
  return <CollectionEmptyState emptyCollection={emptyCollection} />;
}
