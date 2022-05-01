import {
  compose,
  paths,
  reject,
  uniqBy,
  isNil,
  identity,
  map,
  flatten,
  head,
  cond,
  T,
  split,
  sort,
} from 'ramda';

import { AuctionWithBids } from 'types/Auction';

import { maybeGetAddress } from './users';
import { isAuctionEnded, isAuctionLive } from './auctions/auctions';
import { isAllTrue } from './helpers';
import { ArtworkEvent, EventType } from 'types/Event';
import { parseDateToUnix } from './dates/dates';

export const isBidEventAfterAuctionClose = (
  eventType: EventType,
  unixDateEnding: number
): boolean => {
  // is the history event a bid
  const isBidEvent = eventType === EventType.Bid;
  // if the auction has ended
  const hasAuctionEnded = !isAuctionLive(unixDateEnding);
  // return true when all values are true

  return isAllTrue([isBidEvent, hasAuctionEnded]);
};

// an array of the paths where public keys exist on NftHistory
const getHistoryPublicKeyPaths = paths<string>([
  ['actorAccount', 'id'],
  ['nftRecipient', 'id'],
]);

export const getHistoryPublicKeys = compose(
  reject(isNil),
  // make sure only unique values
  uniqBy(identity),
  //  checksum each addresss
  map(maybeGetAddress),
  // flatten the arrays of arrays
  flatten,
  // map over the histories and get the keys
  map(getHistoryPublicKeyPaths)
);

const isBidEventAfterAuctionEnd = (
  event: ArtworkEvent,
  auction: AuctionWithBids
) =>
  isAllTrue([
    // is the most recent event a bid?
    event?.eventType === EventType.Bid,
    // has the auction ended?
    isAuctionEnded(parseDateToUnix(auction?.endsAt)),
  ]);

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export function getArtworkHistory(
  events: ArtworkEvent[],
  auction: AuctionWithBids
) {
  const mostRecentEvent = head(events);

  const sortedEvents = sortEventsByLogIndex(events);

  const soldEvent: ArtworkEvent = {
    ...mostRecentEvent,
    eventType: EventType.Sold,
  };

  return cond<ArtworkEvent, ArtworkEvent[]>([
    // if the auction has ended and most recent event is a bid
    [
      (event) => isBidEventAfterAuctionEnd(event, auction),
      // prepend the sold event to the stack
      () => [soldEvent, ...sortedEvents],
    ],
    // otherwise return the events
    [T, () => sortedEvents],
  ])(mostRecentEvent);
}

export const sortEventsByLogIndex = sort<ArtworkEvent>((a, b) => {
  return a.blockTimestamp === b.blockTimestamp
    ? getLogIndex(b) - getLogIndex(a)
    : parseDateToUnix(b.blockTimestamp) - parseDateToUnix(a.blockTimestamp);
});

const getLogIndex = (event: ArtworkEvent) => {
  // event.id would be 0xbeef-18-Bid
  const [, logIndex] = split('-', event.id);
  return Number(logIndex);
};
