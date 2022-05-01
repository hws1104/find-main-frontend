/* eslint-disable max-lines */
import { getNFT721Address } from 'lib/addresses';
import {
  propEq,
  reject,
  filter,
  prop,
  compose,
  when,
  cond,
  always,
  T,
  sort,
  indexOf,
  allPass,
  last,
  includes,
  length,
  splitEvery,
  transpose,
  pathOr,
  is,
  split,
  ifElse,
} from 'ramda';

import { isFuture } from 'date-fns';

import { parseDateToUnix } from 'utils/dates/dates';
import { areKeysEqual } from 'utils/users';
import {
  getUsernameOrAddress,
  isEmptyOrNil,
  notEmpty,
  notEmptyOrNil,
} from 'utils/helpers';
import { isBidEventAfterAuctionClose } from 'utils/history';
import { isAuctionLive } from 'utils/auctions/auctions';

import {
  ArtworkFragment,
  ArtworkFragmentExtended,
  AuctionFragment,
  CollectionFragment,
} from 'graphql/hasura/hasura-fragments.generated';
import { ArtworkEvent, EventType, LatestArtworkEvent } from 'types/Event';
import {
  ComputedArtworkStatus,
  ArtworkAndOwnerStatus,
} from 'types/artwork/artwork';
import Artwork, { ArtworkV2, BasicArtwork } from 'types/Artwork';
import { PolymorphicAccount } from 'types/Account';

import { AuctionStatus } from 'types/Auction';
import WalletUser from 'types/WalletUser';
import { FND_CONTRACT_SLUG } from 'lib/constants';

export type ArtworkMeta = {
  id: string;
  tokenId?: number;
  name?: string;
  contractAddress?: string;
  collection?: {
    slug?: string;
  };
};

// if the tokenId is included in the list, sort it in order
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const getSortedArtworks = (tokenIds: number[]) =>
  sort<ArtworkFragmentExtended>((a, b) => {
    const firstIndex = indexOf(a.tokenId, tokenIds);
    const secondIndex = indexOf(b.tokenId, tokenIds);
    return firstIndex - secondIndex;
  });

export const getArtworkTokenId = (artwork: ArtworkMeta) => artwork?.tokenId;

interface BuildArtworkPathProps {
  user: PolymorphicAccount;
  artwork: ArtworkMeta;
}

interface BuildUserProfilePathProps {
  user: PolymorphicAccount;
}

interface BuildSellerPrivateSalePath {
  user: PolymorphicAccount;
  artwork: BasicArtwork;
}

export function buildArtworkPath({
  user,
  artwork,
}: BuildArtworkPathProps): string {
  const username = getUsernameOrAddress(user);
  const tokenId = getArtworkTokenId(artwork);
  const contractSlug = getArtworkCollectionSlug(artwork);
  return `/${username}/${contractSlug}/${tokenId}`;
}

export function buildCreatorArtworkIdPath(artwork: ArtworkMeta): string {
  const contractSlug = getArtworkCollectionSlug(artwork);
  return `/creator/${contractSlug}/${artwork?.id}`;
}

export function buildUserProfilePath({
  user,
}: BuildUserProfilePathProps): string {
  const username = getUsernameOrAddress(user);
  return `/${username}`;
}

export function buildCreatorArtworkPath(artwork: ArtworkMeta): string {
  const tokenId = getArtworkTokenId(artwork);
  const contractSlug = getArtworkCollectionSlug(artwork);
  return `/creator/${contractSlug}/${tokenId}`;
}

export function buildSellerPrivateSalePath({
  user,
  artwork,
}: BuildSellerPrivateSalePath): string {
  const activePrivateSale = artwork?.privateSales.find((p) =>
    isFuture(new Date(`${p.deadlineAt}Z`))
  );
  const artworkPath = buildArtworkPath({ user, artwork });

  const privateSaleIpfsHash = activePrivateSale?.ipfsPath;
  return `${artworkPath}/private-sale/submitted?ipfsHash=${privateSaleIpfsHash}`;
}

// TODO: Make a shared helper that can be used on FeaturedArtwork and ArtworkCardPrices
// with the original scope of isTransferredOwner for primary markets

// TODO: Handle the case where a listing happens after this
export const isTransferredOwnerMostRecent = (
  history: ArtworkEvent[]
): boolean => {
  return (
    getLastTransferDatetime(history) > getLastSaleDatetime(history) &&
    getLastTransferDatetime(history) > getLastListingDatetime(history) &&
    getLastTransferDatetime(history) > getLastPrivateSaleDatetime(history)
  );
};

export const isPrivateSaleOwnerMostRecent = (
  history: ArtworkEvent[]
): boolean => {
  return (
    getLastPrivateSaleDatetime(history) > getLastSaleDatetime(history) &&
    getLastPrivateSaleDatetime(history) > getLastListingDatetime(history) &&
    getLastPrivateSaleDatetime(history) > getLastTransferDatetime(history)
  );
};

const getHistoryEvent = (event: EventType) =>
  compose(
    (date: string) => new Date(date),
    pathOr(null, [0, 'blockTimestamp']),
    filter<ArtworkEvent>(propEq<string>('eventType', event))
  );

// TODO: Handle empty or nil input in this helper
export const getLastSaleDatetime = getHistoryEvent(EventType.Sold);

// TODO: Handle empty or nil input in this helper
export const getLastTransferDatetime = getHistoryEvent(EventType.Transferred);

// TODO: Handle empty or nil input in this helper
export const getLastListingDatetime = getHistoryEvent(EventType.Listed);

export const getLastPrivateSaleDatetime = getHistoryEvent(
  EventType.PrivateSale
);

export const getNextPageParam = (
  lastPage: unknown,
  allPages: unknown[]
): number => {
  return notEmpty(lastPage) ? length(allPages) : undefined;
};

interface ComputedArtworkStatusArgs {
  latestArtworkEvent: LatestArtworkEvent;
  mostRecentActiveAuction: AuctionFragment;
  currentUser: WalletUser;
  isCreatorOwner: boolean;
}

export const getComputedArtworkStatus = ({
  isCreatorOwner,
  mostRecentActiveAuction,
  currentUser,
  latestArtworkEvent,
}: ComputedArtworkStatusArgs): ComputedArtworkStatus => {
  const eventType = latestArtworkEvent?.eventType;
  const auctionStatus = mostRecentActiveAuction?.status;
  const auctionEndsAt = mostRecentActiveAuction?.endsAt;
  const isAuctionFinalized = auctionStatus === AuctionStatus.FINALIZED;

  // this will return false when both are undefined
  const isSellerCurrentUser = areKeysEqual([
    currentUser?.publicAddress,
    mostRecentActiveAuction?.seller,
  ]);

  const unixEndDate = parseDateToUnix(auctionEndsAt);

  // this helper handles the edge-case where an auction
  // ended but hasn’t been settled yet
  const isAuctionUnsettled = isBidEventAfterAuctionClose(
    eventType,
    unixEndDate
  );

  const isArtworkAuctionLive = isAuctionLive(unixEndDate);

  // here we reduce + re-map some of the states
  return cond<EventType, ComputedArtworkStatus>([
    [() => isArtworkAuctionLive, always(ComputedArtworkStatus.LiveAuction)],
    [() => isAuctionUnsettled, always(ComputedArtworkStatus.Unsettled)],
    [
      (status) => includes(status, [EventType.PriceChanged, EventType.Bid]),
      always(ComputedArtworkStatus.Listed),
    ],
    [
      (status) => isAuctionFinalized && includes(status, [EventType.Unlisted]),
      always(ComputedArtworkStatus.Settled),
    ],
    [
      (status) => isCreatorOwner && includes(status, [EventType.Unlisted]),
      always(ComputedArtworkStatus.Minted),
    ],
    [
      (status) => !isCreatorOwner && includes(status, [EventType.Unlisted]),
      always(ComputedArtworkStatus.Transferred),
    ],
    [
      (status) => !isSellerCurrentUser && includes(status, [EventType.Listed]),
      always(ComputedArtworkStatus.ListedButNotByMe),
    ],
    // otherwise just return the latestEventStatus
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    [T, (status) => status],
  ])(eventType);
};

export function splitArray<T>(arr: T[], length: number): T[][] {
  // [1, 2, 3, 4, 5, 6] becomes [[1, 2, 3], [4, 5, 6]]
  const result = splitEvery(length, arr);
  // [[1, 4], [2, 5], [3, 6]]
  return transpose(result);
}

// Feed Artwork & Ownership Statuses
export const getArtworkAndOwnerStatus = cond<
  { event: EventType; isOwner: boolean },
  ArtworkAndOwnerStatus
>([
  // MintedOwner
  [
    allPass([propEq('event', EventType.Minted), prop('isOwner')]),
    always(ArtworkAndOwnerStatus.MintedOwner),
  ],
  // MintedNonOwner,
  [
    propEq('event', EventType.Minted),
    always(ArtworkAndOwnerStatus.MintedNonOwner),
  ],
  // TransferredOwner
  [
    allPass([propEq('event', EventType.Transferred), prop('isOwner')]),
    always(ArtworkAndOwnerStatus.TransferredOwner),
  ],
  // TransferredNonOwner
  [
    propEq('event', EventType.Transferred),
    always(ArtworkAndOwnerStatus.TransferredNonOwner),
  ],
  // ListedOwner
  [
    allPass([propEq('event', EventType.Listed), prop('isOwner')]),
    always(ArtworkAndOwnerStatus.ListedOwner),
  ],
  // ListedNonOwner
  [
    propEq('event', EventType.Listed),
    always(ArtworkAndOwnerStatus.ListedNonOwner),
  ],
  // PriceChangedOwner
  [
    allPass([propEq('event', EventType.PriceChanged), prop('isOwner')]),
    always(ArtworkAndOwnerStatus.PriceChangedOwner),
  ],
  // PriceChangedNonOwner
  [
    propEq('event', EventType.PriceChanged),
    always(ArtworkAndOwnerStatus.PriceChangedNonOwner),
  ],
  // UnlistedOwner
  [
    allPass([propEq('event', EventType.Unlisted), prop('isOwner')]),
    always(ArtworkAndOwnerStatus.UnlistedOwner),
  ],
  // UnlistedNonOwner
  [
    propEq('event', EventType.Unlisted),
    always(ArtworkAndOwnerStatus.UnlistedNonOwner),
  ],
  // InAuctionOwner
  [
    allPass([propEq('event', EventType.Bid), prop('isOwner')]),
    always(ArtworkAndOwnerStatus.InAuctionOwner),
  ],
  // InAuctionNonOwner
  [
    propEq('event', EventType.Bid),
    always(ArtworkAndOwnerStatus.InAuctionNonOwner),
  ],
  // SoldOwner
  [
    allPass([propEq('event', EventType.Sold), prop('isOwner')]),
    always(ArtworkAndOwnerStatus.SoldOwner),
  ],
  // SoldNonOwner
  [propEq('event', EventType.Sold), always(ArtworkAndOwnerStatus.SoldNonOwner)],
  // SettledOwner
  [
    allPass([propEq('event', EventType.Settled), prop('isOwner')]),
    always(ArtworkAndOwnerStatus.SettledOwner),
  ],
  // SettledNonOwner
  [
    propEq('event', EventType.Settled),
    always(ArtworkAndOwnerStatus.SettledNonOwner),
  ],
  [T, () => null],
]);

export const rejectUserHiddenArtworks = <T extends ArtworkV2>(artworks: T[]) =>
  artworks.filter((artwork) => isEmptyOrNil(artwork.artworkUserVisibilities));

type ArtworkPrivateSales = {
  privateSales: ArtworkFragment['privateSales'];
};

export const hasActivePrivateSale = <T extends ArtworkPrivateSales>(
  artwork: T
): boolean => {
  return artwork?.privateSales.some(
    (ps) => isFuture(new Date(`${ps.deadlineAt}Z`)) && !ps.soldAt
  );
};

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export function getArtworkContractAddress(
  artwork: Pick<Artwork, 'contractAddress'>
) {
  return artwork?.contractAddress ?? getNFT721Address();
}

type ArtworkWithCollectionSlug = {
  collection?: Pick<CollectionFragment, 'slug'>;
};

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export function getArtworkCollectionSlug(artwork: ArtworkWithCollectionSlug) {
  return artwork?.collection?.slug ?? FND_CONTRACT_SLUG;
}

export function buildArtworkTokenPath(artwork: ArtworkMeta) {
  return `${artwork?.collection?.slug}/${artwork?.tokenId}`;
}

export function buildArtworkListPath(
  artwork: ArtworkMeta,
  marketType: 'primary' | 'secondary'
) {
  if (marketType === 'secondary') {
    return `/create/list/${buildArtworkTokenPath(artwork)}?type=secondary`;
  }
  return `/create/list/${buildArtworkTokenPath(artwork)}`;
}

export function buildArtworkTagsPath(artwork: ArtworkMeta) {
  return `/create/tags/${artwork?.id}`;
}
const isString = is(String);

export const getStrAfterLastHyphen = when(isString, compose(last, split('-')));

const containsHyphen = includes('-');

export const getTokenId: (arg0: string) => string = ifElse(
  allPass([notEmptyOrNil, containsHyphen]),
  getStrAfterLastHyphen,

  () => null
);

export const getStrAfterLastSlash = when(isString, compose(last, split('/')));
