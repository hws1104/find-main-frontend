/* eslint-disable react/jsx-max-depth */
/* eslint-disable max-lines */
import NextLink from 'next/link';
import { styled } from 'stitches.config';

import Box from 'components/base/Box';
import Grid from 'components/base/Grid';
import ArtworkCard from 'components/cards/artwork/ArtworkCard';
import Heading from 'components/base/Heading';
import Flex from 'components/base/Flex';
import CollectionTitle from 'components/collections/CollectionTitle';
import ContractPill from 'components/collections/ContractPill';
import UserTagV3 from 'components/users/UserTagV3';
import CollectionLogo from 'components/collections/CollectionLogo';
import Link from 'components/base/Link';
import Text from 'components/base/Text';
import MarkdownText from 'components/base/MarkdownText';
import CircleAvatar from 'components/avatars/CircleAvatar';
import Footer from 'components/footers/Footer';
import Overlay from 'components/base/Overlay';
import CreatorName from 'components/creators/CreatorName';

import { getUsernameOrAddressInfo, isEmptyOrNil } from 'utils/helpers';
import {
  buildArtworkFooterImageUrl,
  buildAvatarUrl,
  buildImgixUrl,
} from 'utils/assets';
import { abbreviateValue } from 'utils/formatters';
import { buildCollectionPath } from 'utils/collections';
import { pluralizeWord } from 'utils/strings';
import { buildUserProfilePath } from 'utils/artwork/artwork';

import WalletUser from 'types/WalletUser';
import { CollectionCardFragment } from 'types/Collection';

import { UserFragment } from 'graphql/hasura/hasura-fragments.generated';
import { ArtworkPageArtworkOtherArtworks } from 'queries/server/artwork-page';

interface ArtworkFooterProps {
  isFndCollection: boolean;
  otherArtworks?: ArtworkPageArtworkOtherArtworks;
  currentUser: WalletUser;
  creator: UserFragment;
  coverImageUrl?: string;
  collection: CollectionCardFragment;
}

export default function ArtworkFooter(props: ArtworkFooterProps): JSX.Element {
  const {
    isFndCollection,
    otherArtworks,
    currentUser,
    creator,
    collection,
    coverImageUrl,
  } = props;

  const works = otherArtworks?.artworks;
  const coverImage = isFndCollection
    ? buildArtworkFooterImageUrl(creator?.coverImageUrl)
    : buildArtworkFooterImageUrl(coverImageUrl);
  const emptyState = isEmptyOrNil(coverImage);
  const colorState = emptyState ? 'dark' : 'light';
  const color = emptyState ? '$black100' : '$white100';
  const artworkCount = otherArtworks?.artworksCount?.aggregate?.count;

  const { usernameOrAddress, hasUsername, nameOrUsername, hasName } =
    getUsernameOrAddressInfo(creator);

  const hasArtworks = artworkCount > 0;

  return (
    <Box
      css={{
        '@bp0': {
          position: 'sticky',
        },
        zIndex: 1,
        bottom: 0,
        left: 0,
        width: '100%',
        background: emptyState ? `$black5` : `url(${coverImage})`,
        backgroundColor: emptyState ? `$black5` : `$black100`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Box
        css={{
          paddingTop: '$10',
          paddingX: '$6',
          maxWidth: '$container',
          marginX: 'auto',
          width: '100%',
        }}
      >
        {!emptyState && <Overlay css={{ zIndex: 2, pointerEvents: 'none' }} />}

        <Grid
          css={{
            zIndex: 3,
            position: 'relative',
            paddingBottom: '$5',
            gridGap: '$9',
            '@bp2': { gridTemplateColumns: '1fr 2fr' },
            '@bp3': { gridTemplateColumns: '1fr 3fr' },
          }}
        >
          {isFndCollection ? (
            <Flex
              css={{
                flexDirection: 'column',
                alignItems: 'center',
                '@bp2': { alignItems: 'flex-start', textAlign: 'left' },
              }}
            >
              <NextLink
                href={buildUserProfilePath({ user: creator })}
                passHref
                prefetch={false}
              >
                <Link css={{ textDecoration: 'none', color, maxWidth: 500 }}>
                  <CircleAvatar
                    maxSize={180}
                    css={{
                      width: 120,
                      height: 120,
                      boxShadow: '0 0 0px 10px rgba(255, 255, 255, 0.4)',
                      marginX: 'auto',
                      '@bp2': { width: 160, height: 160, marginX: 'unset' },
                    }}
                    imageUrl={buildImgixUrl(creator?.profileImageUrl, {
                      w: 350,
                    })}
                    publicKey={creator?.publicKey}
                  />
                  <Flex
                    css={{
                      paddingY: '$4',
                      alignItems: 'center',
                      flexDirection: 'column',
                      '@bp2': {
                        alignItems: 'flex-start',
                      },
                    }}
                  >
                    <Flex
                      css={{
                        maxWidth: '100%',
                        width: '100%',
                        paddingTop: '$6',
                        justifyContent: 'center',
                        '@bp2': {
                          justifyContent: 'flex-start',
                        },
                      }}
                    >
                      {hasName && <CreatorName>{nameOrUsername}</CreatorName>}
                    </Flex>
                    {hasUsername && (
                      <Text
                        weight={600}
                        size={{ '@initial': 2, '@bp1': 3 }}
                        css={{
                          color: emptyState
                            ? color
                            : 'rgba(255, 255, 255, 0.8)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          wordBreak: 'break-all',
                          transition: 'color $ease $1',
                          '@hover': {
                            '&:hover': {
                              color: emptyState ? '$black100' : '$white100',
                            },
                          },
                        }}
                      >
                        {usernameOrAddress}
                      </Text>
                    )}
                  </Flex>
                  {creator?.bio && (
                    <MarkdownText
                      css={{
                        textAlign: 'center',
                        '@bp2': {
                          textAlign: 'left',
                        },
                      }}
                    >
                      {creator?.bio}
                    </MarkdownText>
                  )}
                </Link>
              </NextLink>
            </Flex>
          ) : (
            <Flex css={{ flexDirection: 'column' }}>
              <NextLink
                href={buildCollectionPath(collection)}
                passHref
                prefetch={false}
              >
                <Link css={{ textDecoration: 'none' }}>
                  <Flex
                    css={{
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      '@bp2': { alignItems: 'flex-start', textAlign: 'left' },
                    }}
                  >
                    {collection.collectionImageUrl && (
                      <CollectionLogo
                        imageUrl={buildAvatarUrl(
                          160,
                          collection.collectionImageUrl
                        )}
                        alt={collection.name}
                        appearance="frosted"
                        stroke={{ '@initial': 2, '@bp1': 3 }}
                        shape={2}
                      />
                    )}
                    <Box
                      css={{
                        paddingY: '$6',
                      }}
                    >
                      <ContractPill
                        hasIcon={true}
                        frosted={!emptyState}
                        contract={collection.symbol}
                      />
                    </Box>
                    <CollectionTitle
                      color={colorState}
                      css={{ marginBottom: '$7' }}
                      size={{ '@bpxs': 4, '@initial': 5 }}
                    >
                      {collection.name}
                    </CollectionTitle>
                    <Heading
                      size={2}
                      css={{
                        opacity: 0.6,
                        color,
                      }}
                    >
                      {abbreviateValue(artworkCount)}{' '}
                      {pluralizeWord('Artwork', artworkCount)}
                    </Heading>
                  </Flex>
                </Link>
              </NextLink>
              <Flex
                css={{
                  marginTop: '$6',
                  justifyContent: 'center',
                  '@bp2': { justifyContent: 'flex-start' },
                }}
              >
                <UserTagV3
                  appearance={emptyState ? 'normal' : 'frosted'}
                  hoverable
                  user={creator}
                />
              </Flex>
            </Flex>
          )}
          {hasArtworks && (
            <CardGrid>
              {works.map((artwork) => (
                <ArtworkCard
                  prefetch={true}
                  key={artwork.tokenId}
                  artwork={artwork}
                  creator={creator}
                  currentUser={currentUser}
                />
              ))}
            </CardGrid>
          )}
        </Grid>
      </Box>
      <Footer
        footerStyle={{
          position: 'relative',
          zIndex: 3,
          '.footer-link': {
            color: emptyState ? '$black60' : 'rgba(255, 255, 255, 0.8)',
            '@hover': {
              '&:hover': {
                color: '$white100',
              },
            },
          },
        }}
      />
    </Box>
  );
}

const CardGrid = styled(Grid, {
  display: 'none',
  '@bp2': {
    display: 'grid',
    flex: 1,
    gridGap: '$4',
    gridTemplateColumns: 'repeat(2,1fr)',
    '.artwork-card:nth-of-type(3)': {
      display: 'none',
    },
  },
  '@bp4': {
    gridTemplateColumns: 'repeat(3,1fr)',
    '.artwork-card': {
      display: 'flex',
    },
    '.artwork-card:nth-of-type(3)': {
      display: 'flex',
    },
  },
});
