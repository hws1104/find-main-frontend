/* eslint-disable max-lines */
/* eslint-disable react/jsx-max-depth */
import {
  propEq,
  compose,
  curry,
  anyPass,
  ifElse,
  multiply,
  is,
  always,
  add,
  isNil,
  propSatisfies,
  allPass,
  propOr,
  head,
  cond,
  T,
  pathEq,
} from 'ramda';

import { AuctionStatus } from 'types/Auction';
import {
  AuctionFragment,
  ArtworkFragmentExtended,
} from 'graphql/hasura/hasura-fragments.generated';

import { isEmptyOrNil, notEmptyOrNil } from 'utils/helpers';
import { areKeysEqual } from 'utils/users';
import { isUnixDateInPast, parseDateToUnix } from 'utils/dates/dates';
import { ceilWithDecimals } from 'utils/formatters';
import { LatestArtworkEvent } from 'types/Event';

const isAuctionStatusOpen = propEq<string>('status', AuctionStatus.OPEN);

export const isAuctionStatusFinalized = propEq<string>(
  'status',
  AuctionStatus.FINALIZED
);

// TODO: Don't hardcode 1.1
const incrementBidAmount = compose<string | number, number, number, number>(
  ceilWithDecimals(4),
  multiply(1.1),
  Number
);

export const getAuctionMinBidPrice = cond<
  Pick<AuctionFragment, 'highestBidAmount' | 'reservePriceInETH'>,
  number
>([
  [
    (auction) => Boolean(auction?.highestBidAmount),
    (auction) => incrementBidAmount(auction.highestBidAmount),
  ],
  [T, (auction) => auction?.reservePriceInETH],
]);

const isString = is(String);
const isNumber = is(Number);

const isStringOrNumber = anyPass([isString, isNumber]);

// buffer in seconds
const PAST_CONFIRMATIONS_BUFFER = 30;

const isAuctionInPastWithBuffer = compose(
  isUnixDateInPast,
  add(PAST_CONFIRMATIONS_BUFFER),
  Number
);

export const isAuctionEnded = ifElse(
  // if the value is present
  isStringOrNumber,
  // run the value through the check
  isAuctionInPastWithBuffer,
  // otherwise return false
  always(false)
);

export const auctionHasHighestBid = propSatisfies(notEmptyOrNil, 'highestBid');

export const isArtworkAuctionWinner = curry(
  (publicAddress: string, auction: AuctionFragment) => {
    const highestBidder = auction?.highestBidder;
    const isOwned = areKeysEqual([publicAddress, highestBidder]);
    return isOwned;
  }
);

export const isArtworkAuctionCreator = curry(
  (publicAddress: string, artwork: ArtworkFragmentExtended) => {
    const artworkOwnerId = artwork?.creator?.publicKey;
    const isOwned = areKeysEqual([publicAddress, artworkOwnerId]);
    return isOwned;
  }
);

export const isArtworkAuctionOwner = curry(
  (publicAddress: string, auction: AuctionFragment) => {
    const artworkOwnerId = auction?.seller;
    const isOwned = areKeysEqual([publicAddress, artworkOwnerId]);
    return isOwned;
  }
);

export const isAuctionNotYetListed = anyPass([
  isNil,
  propEq('status', AuctionStatus.CANCELED),
]);

export const isAuctionLive = allPass([
  notEmptyOrNil,
  (date: string) => !isAuctionEnded(date),
]);

export const isAuctionOpenForBids = anyPass([
  // is the auction in action
  (auction: AuctionFragment) => isAuctionLive(parseDateToUnix(auction?.endsAt)),
  // is the auction listed and ready
  allPass([
    notEmptyOrNil,
    isAuctionStatusOpen,
    (auction: AuctionFragment) => isEmptyOrNil(auction?.highestBidderUser),
  ]),
]);

type ArtworkWithAuctions = {
  auctions: AuctionFragment[];
};

export const getMostRecentAuction = compose<
  ArtworkWithAuctions,
  AuctionFragment[],
  AuctionFragment
>(head, propOr([], 'auctions'));

type ArtworkWithEvents = { latestEvents: LatestArtworkEvent[] };

export const getLatestArtworkEvent = compose<
  ArtworkWithEvents,
  LatestArtworkEvent[],
  LatestArtworkEvent
>(head, propOr([], 'latestEvents'));

export const isAuctionOpenV2 = allPass([
  notEmptyOrNil,
  pathEq(['auctions', 0, 'status'], AuctionStatus.OPEN),
]);
