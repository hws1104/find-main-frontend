/* eslint-disable max-lines */
/* eslint-disable react/jsx-max-depth */
import { UseMutationResult } from 'react-query';
import NextLink from 'next/link';

import { styled } from 'stitches.config';

import Flex from 'components/base/Flex';
import ArtworkCardMedia from 'components/cards/artwork/subcomponents/ArtworkCardMedia';
import ArtworkCardTitle from 'components/cards/artwork/subcomponents/ArtworkCardTitle';
import ArtworkCardSkeleton from 'components/cards/artwork/ArtworkCardSkeleton';
import ArtworkCardContainer from 'components/cards/artwork/subcomponents/ArtworkCardContainer';
import ArtworkCardPopoverOwner from 'components/cards/artwork/subcomponents/popovers/ArtworkCardPopoverOwner';
import ArtworkCardHeader from 'components/cards/artwork/subcomponents/ArtworkCardHeader';
import ArtworkCardMeta from 'components/cards/artwork/subcomponents/ArtworkCardMeta';
import CardContextProvider, {
  useCardContext,
} from 'components/cards/CardContext';
import ArtworkCardCollection from './subcomponents/ArtworkCardCollection';
import ArtworkCardCreator from './subcomponents/ArtworkCardCreator';
import GraySquare from 'components/base/GraySquare';

import {
  buildArtworkPath,
  getComputedArtworkStatus,
} from 'utils/artwork/artwork';
import { buildArtworkAssetUrl, buildPosterUrl } from 'utils/assets';
import { isAllTrue, notEmptyOrNil } from 'utils/helpers';
import { areKeysEqual } from 'utils/users';
import {
  getLatestArtworkEvent,
  getMostRecentAuction,
} from 'utils/auctions/auctions';

import WalletUser from 'types/WalletUser';
import { VideoAssetQuality } from 'types/Assets';
import { ArtworkV2 } from 'types/Artwork';

import { UserFragment } from 'graphql/hasura/hasura-fragments.generated';
import {
  SetArtworkUserVisibility,
  SetArtworkUserVisibilityVariables,
} from 'graphql/server/mutations/set-artwork-user-visibility.generated';

import SplitIcon from 'assets/icons/split-icon.svg';

export default function ArtworkCardContext(
  props: ArtworkCardProps
): JSX.Element {
  return (
    <CardContextProvider>
      <ArtworkCard {...props} />
    </CardContextProvider>
  );
}

type ArtworkCardType = 'regular' | 'detailed';

interface ArtworkCardProps {
  artwork: ArtworkV2;
  creator: UserFragment;
  currentUser: WalletUser;
  // optionals
  isCurrentUserProfile?: boolean;
  setArtworkUserVisibility?: UseMutationResult<
    SetArtworkUserVisibility,
    Error,
    SetArtworkUserVisibilityVariables
  >;
  cardType?: ArtworkCardType;
  prefetch?: boolean;
}

export function ArtworkCard(props: ArtworkCardProps): JSX.Element {
  const {
    artwork,
    creator,
    currentUser,
    isCurrentUserProfile = false,
    setArtworkUserVisibility,
    cardType = 'detailed',
    prefetch = false,
  } = props;

  const { isHovered, setIsHovered } = useCardContext();

  if (!artwork) {
    return <ArtworkCardSkeleton cardType={cardType} />;
  }

  const artworkPath = buildArtworkPath({ user: creator, artwork });

  const assetUrl = buildArtworkAssetUrl(
    { h: 640, q: 80, quality: VideoAssetQuality.Preview },
    artwork
  );

  const posterUrl = buildPosterUrl(artwork);

  const mostRecentActiveAuction = getMostRecentAuction(artwork);

  const hasSplits = artwork?.splitRecipients?.aggregate?.count > 0;

  const isCreatorOwner = areKeysEqual([
    artwork?.ownerPublicKey,
    artwork?.publicKey,
  ]);

  const computedArtworkStatus = getComputedArtworkStatus({
    mostRecentActiveAuction,
    latestArtworkEvent: getLatestArtworkEvent({
      latestEvents: artwork?.latestEvents,
    }),
    currentUser,
    isCreatorOwner,
  });

  const isOwner = areKeysEqual([
    currentUser?.publicAddress,
    artwork?.ownerPublicKey,
  ]);

  const isOwnerOnProfile = isAllTrue([isCurrentUserProfile, isOwner]);

  const hasName = notEmptyOrNil(artwork.name);

  return (
    <ArtworkCardContainer isHovered={isHovered} className="artwork-card">
      {artwork.tokenId && (
        <NextLink passHref href={artworkPath} prefetch={prefetch}>
          <StyledLink>{artwork.name}</StyledLink>
        </NextLink>
      )}
      <Flex
        css={{
          paddingX: '$4',
          paddingY: '$2',
          color: '$black60',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <ArtworkCardCreator artwork={artwork} />
        {hasSplits && <SplitIcon width={20} height={17} title="split" />}
      </Flex>
      <ArtworkCardMedia assetUrl={assetUrl} posterUrl={posterUrl} />
      <ArtworkCardHeader>
        {artwork?.collection && (
          <ArtworkCardCollection collection={artwork?.collection} />
        )}
        <Flex css={{ justifyContent: 'space-between', minWidth: 0 }}>
          {hasName ? (
            <ArtworkCardTitle>{artwork.name}</ArtworkCardTitle>
          ) : (
            <GraySquare css={{ height: 31, width: 160 }} />
          )}

          {isCurrentUserProfile && (
            <ArtworkCardPopoverOwner
              appearance="minimal"
              size="small"
              artwork={artwork}
              status={computedArtworkStatus}
              currentUser={currentUser}
              setArtworkUserVisibility={setArtworkUserVisibility}
              setIsHovered={setIsHovered}
              css={{
                marginY: -5,
                display: 'none',
                '@bp1': {
                  display: 'flex',
                },
              }}
            />
          )}
        </Flex>
      </ArtworkCardHeader>
      {cardType === 'detailed' && (
        <Flex
          css={{ flexDirection: 'column' }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <ArtworkCardMeta
            artwork={artwork}
            mostRecentActiveAuction={mostRecentActiveAuction}
            isOwnerOnProfile={isOwnerOnProfile}
            status={computedArtworkStatus}
          />
        </Flex>
      )}
    </ArtworkCardContainer>
  );
}

const StyledLink = styled('a', {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: 2,
  textIndent: '-9999rem',
});
