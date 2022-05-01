import { ReactNode } from 'react';

import {
  ArtworkAuctionContainer,
  ArtworkAuctionMetaContainer,
} from '../ArtworkAuctionElements';
import ArtworkAuctionPrice from '../ArtworkAuctionPrice';
import ArtworkAuctionBidAction from '../ArtworkAuctionBidAction';

import { areKeysEqual } from 'utils/users';

import {
  ArtworkFragmentExtended,
  BidFragment,
} from 'graphql/hasura/hasura-fragments.generated';

import { AuctionWithBids } from 'types/Auction';

import { RESERVE_PRICE_LABEL } from 'lib/constants';

interface AuctionStateGenericProps {
  artwork: ArtworkFragmentExtended;
  amountInETH: number;
  children?: ReactNode;
  currentUserBid: BidFragment;
  minutesRemaining: number;
  publicAddress: string;
  bidPath: string;
  label: string;
  auction: AuctionWithBids;
}

export default function AuctionStateGeneric(
  props: AuctionStateGenericProps
): JSX.Element {
  const {
    artwork,
    amountInETH,
    label,
    children,
    currentUserBid,
    minutesRemaining,
    bidPath,
    auction,
    publicAddress,
  } = props;

  const currentUserNotOwner = publicAddress !== artwork.ownerPublicKey;

  return (
    <ArtworkAuctionContainer>
      <ArtworkAuctionMetaContainer>
        <ArtworkAuctionPrice
          artwork={artwork}
          auction={auction}
          label={label}
          amountInETH={amountInETH}
        />
        {children && children}
        {label === RESERVE_PRICE_LABEL && currentUserNotOwner && (
          <ArtworkAuctionBidAction
            artwork={artwork}
            currentUserBid={currentUserBid}
            isCurrentUserHighestBidder={areKeysEqual([
              auction.highestBidder,
              currentUserBid?.bidder,
            ])}
            minutesRemaining={minutesRemaining}
            bidPath={bidPath}
            endDate={null}
          />
        )}
      </ArtworkAuctionMetaContainer>
      {label !== RESERVE_PRICE_LABEL && currentUserNotOwner && (
        <ArtworkAuctionBidAction
          artwork={artwork}
          currentUserBid={currentUserBid}
          isCurrentUserHighestBidder={areKeysEqual([
            auction.highestBidder,
            currentUserBid?.bidder,
          ])}
          minutesRemaining={minutesRemaining}
          bidPath={bidPath}
          endDate={null}
        />
      )}
    </ArtworkAuctionContainer>
  );
}
