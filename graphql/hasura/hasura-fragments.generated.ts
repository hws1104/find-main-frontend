import * as Types from './types-hasura.generated';

export type ArtworkFragment = (
  Pick<Types.Artwork, 'id' | 'name' | 'description' | 'assetScheme' | 'assetHost' | 'assetPath' | 'assetIPFSPath' | 'metadataScheme' | 'metadataHost' | 'metadataPath' | 'metadataIPFSPath' | 'width' | 'height' | 'duration' | 'mimeType' | 'mintTxHash' | 'assetId' | 'assetStatus' | 'tokenId' | 'status' | 'hiddenAt' | 'deletedAt' | 'moderationStatus' | 'moderationFrom' | 'latestTxDate' | 'assetVersion' | 'ownerPublicKey' | 'publicKey' | 'tags' | 'contractAddress' | 'activeSalePriceInETH' | 'lastSalePriceInETH' | 'isIndexed'>
  & { privateSales: Array<(
    Pick<Types.Private_Sale, 'ipfsPath' | 'deadlineAt' | 'soldAt' | 'buyer' | 'seller'>
    & { price: Types.Private_Sale['saleAmountInETH'] }
  )> }
);

export type CollectionFragment = Pick<Types.Collection, 'collectionImageUrl' | 'contractAddress' | 'slug' | 'coverImageUrl' | 'createdAt' | 'creatorAddress' | 'description' | 'id' | 'name' | 'symbol' | 'updatedAt' | 'contractType' | 'moderationStatus' | 'hiddenAt'>;

export type UserFragment = Pick<Types.User, 'userIndex' | 'publicKey' | 'username' | 'profileImageUrl' | 'coverImageUrl' | 'name' | 'bio' | 'isApprovedCreator' | 'moderationStatus' | 'joinedWaitlistAt' | 'createdAt' | 'isApprovedForMigrationAt' | 'isAdmin' | 'links'>;

export type InviteFragment = Pick<Types.Invite_Code, 'senderPublicKey' | 'redeemerPublicKey' | 'redeemedAt'>;

export type FollowFragment = Pick<Types.Follow, 'id' | 'createdAt' | 'updatedAt' | 'user' | 'followedUser' | 'isFollowing'>;

export type SocialVerificationFragment = Pick<Types.Social_Verification, 'id' | 'user' | 'createdAt' | 'updatedAt' | 'expiresAt' | 'lastCheckedAt' | 'socialVerificationURL' | 'verificationText' | 'userId' | 'username' | 'isValid' | 'service' | 'failedReason' | 'status'>;

export type FeedUserFragment = (
  { followerCount: { aggregate?: Types.Maybe<Pick<Types.Follow_Aggregate_Fields, 'count'>> }, follows: Array<Pick<Types.Follow, 'createdAt' | 'isFollowing'>> }
  & UserFragment
);

export type AuctionFragment = (
  Pick<Types.Auction, 'auctionId' | 'canceledAt' | 'createdAt' | 'endsAt' | 'finalizedAt' | 'highestBidAmount' | 'highestBidder' | 'id' | 'isPrimarySale' | 'reservePriceInETH' | 'seller' | 'startsAt' | 'status' | 'tokenId' | 'updatedAt'>
  & { highestBidderUser?: Types.Maybe<Pick<Types.User, 'userIndex' | 'publicKey' | 'username' | 'profileImageUrl' | 'coverImageUrl' | 'name'>>, bidCount: { aggregate?: Types.Maybe<Pick<Types.Bid_Aggregate_Fields, 'count'>> } }
);

export type BidFragment = Pick<Types.Bid, 'auctionId' | 'bidAmount' | 'bidder' | 'contractAddress' | 'createdAt' | 'datePlaced' | 'id' | 'seller' | 'status' | 'tokenId' | 'updatedAt'>;

export type LatestArtworkEventFragment = { latestEvents: Array<Pick<Types.Event, 'id' | 'eventType' | 'data'>> };

export type ArtworkEventFragment = Pick<Types.Event, 'id' | 'eventType' | 'data' | 'blockTimestamp' | 'publicKey' | 'tokenId' | 'tokenCreator'>;

export type SplitRecipientFragment = Pick<Types.Split_Recipient, 'contractAddress' | 'createdAt' | 'id' | 'indexOfShare' | 'publicKey' | 'sharePercent' | 'updatedAt'>;

export type ArtworkSplitRecipientsFragment = { splitRecipients: { aggregate?: Types.Maybe<Pick<Types.Split_Recipient_Aggregate_Fields, 'count'>> } };

export type ArtworkPrivateSalesFragment = { privateSales: Array<Pick<Types.Private_Sale, 'ipfsPath' | 'deadlineAt' | 'soldAt'>> };

export type MostRecentAuctionFragment = { auctions: Array<AuctionFragment> };

export type ArtworkFragmentExtended = (
  { owner?: Types.Maybe<UserFragment>, creator?: Types.Maybe<UserFragment>, collection?: Types.Maybe<Pick<Types.Collection, 'symbol' | 'contractAddress' | 'slug' | 'name' | 'collectionImageUrl' | 'coverImageUrl'>> }
  & ArtworkFragment
  & LatestArtworkEventFragment
  & ArtworkSplitRecipientsFragment
  & MostRecentAuctionFragment
);

export type PrivateSaleFragment = (
  Pick<Types.Private_Sale, 'deadlineAt' | 'ipfsPath' | 'soldAt'>
  & { price: Types.Private_Sale['saleAmountInETH'] }
  & { buyer: UserFragment, seller: UserFragment, artwork: (
    { creator?: Types.Maybe<UserFragment>, collection?: Types.Maybe<Pick<Types.Collection, 'slug'>> }
    & ArtworkFragment
  ) }
);

export type CollectionFragmentExtended = (
  { creator: UserFragment }
  & CollectionFragment
);

export type ActivityBidFragment = (
  { auction: AuctionFragment, artwork?: Types.Maybe<(
    { creator?: Types.Maybe<UserFragment>, collection?: Types.Maybe<Pick<Types.Collection, 'slug'>> }
    & ArtworkFragment
  )> }
  & BidFragment
);

export type UserProfileFragment = (
  { acceptedInvite?: Types.Maybe<InviteFragment>, twitSocialVerifs: Array<SocialVerificationFragment>, instaSocialVerifs: Array<SocialVerificationFragment>, followerCount: { aggregate?: Types.Maybe<Pick<Types.Follow_Aggregate_Fields, 'count'>> }, followingCount: { aggregate?: Types.Maybe<Pick<Types.Follow_Aggregate_Fields, 'count'>> } }
  & UserFragment
);

export const FollowFragment = /*#__PURE__*/ `
    fragment FollowFragment on follow {
  id
  createdAt
  updatedAt
  user
  followedUser
  isFollowing
}
    `;
export const UserFragment = /*#__PURE__*/ `
    fragment UserFragment on user {
  userIndex
  publicKey
  username
  profileImageUrl
  coverImageUrl
  name
  bio
  isApprovedCreator
  moderationStatus
  joinedWaitlistAt
  createdAt
  isApprovedForMigrationAt
  isAdmin
  links
}
    `;
export const FeedUserFragment = /*#__PURE__*/ `
    fragment FeedUserFragment on user {
  ...UserFragment
  followerCount: follows_aggregate(where: {isFollowing: {_eq: true}}) {
    aggregate {
      count
    }
  }
  follows(where: {user: {_eq: $publicKey}, isFollowing: {_eq: true}}) {
    createdAt
    isFollowing
  }
}
    ${UserFragment}`;
export const ArtworkEventFragment = /*#__PURE__*/ `
    fragment ArtworkEventFragment on event {
  id
  eventType
  data
  blockTimestamp
  publicKey
  data
  tokenId
  tokenCreator
}
    `;
export const SplitRecipientFragment = /*#__PURE__*/ `
    fragment SplitRecipientFragment on split_recipient {
  contractAddress
  createdAt
  id
  indexOfShare
  publicKey
  sharePercent
  updatedAt
}
    `;
export const ArtworkPrivateSalesFragment = /*#__PURE__*/ `
    fragment ArtworkPrivateSalesFragment on artwork {
  privateSales {
    ipfsPath
    deadlineAt
    soldAt
  }
}
    `;
export const ArtworkFragment = /*#__PURE__*/ `
    fragment ArtworkFragment on artwork {
  id
  name
  description
  assetScheme
  assetHost
  assetPath
  assetIPFSPath
  metadataScheme
  metadataHost
  metadataPath
  metadataIPFSPath
  width
  height
  duration
  mimeType
  mintTxHash
  assetId
  assetStatus
  mintTxHash
  tokenId
  status
  hiddenAt
  deletedAt
  moderationStatus
  moderationFrom
  latestTxDate
  assetVersion
  ownerPublicKey
  publicKey
  tags
  contractAddress
  activeSalePriceInETH
  lastSalePriceInETH
  isIndexed
  privateSales {
    ipfsPath
    deadlineAt
    soldAt
    price: saleAmountInETH
    buyer
    seller
  }
}
    `;
export const LatestArtworkEventFragment = /*#__PURE__*/ `
    fragment LatestArtworkEventFragment on artwork {
  latestEvents: event(
    where: {eventType: {_nin: ["MIGRATE_CREATOR", "MIGRATE_CREATOR_PAYMENT_ADDRESS", "MIGRATE_OWNER", "MIGRATE_SELLER", "SELL", "PRICE_CHANGE"]}}
    limit: 1
    order_by: {blockTimestamp: desc_nulls_last}
  ) {
    id
    eventType
    data
  }
}
    `;
export const ArtworkSplitRecipientsFragment = /*#__PURE__*/ `
    fragment ArtworkSplitRecipientsFragment on artwork {
  splitRecipients: splitRecipients_aggregate {
    aggregate {
      count
    }
  }
}
    `;
export const AuctionFragment = /*#__PURE__*/ `
    fragment AuctionFragment on auction {
  auctionId
  canceledAt
  createdAt
  endsAt
  finalizedAt
  highestBidAmount
  highestBidder
  id
  isPrimarySale
  reservePriceInETH
  seller
  startsAt
  status
  tokenId
  updatedAt
  highestBidderUser {
    userIndex
    publicKey
    username
    profileImageUrl
    coverImageUrl
    name
  }
  bidCount: bids_aggregate {
    aggregate {
      count
    }
  }
}
    `;
export const MostRecentAuctionFragment = /*#__PURE__*/ `
    fragment MostRecentAuctionFragment on artwork {
  auctions(
    where: {status: {_in: ["OPEN", "FINALIZED", "ENDED"]}}
    order_by: {endsAt: desc_nulls_first}
    limit: 1
  ) {
    ...AuctionFragment
  }
}
    ${AuctionFragment}`;
export const ArtworkFragmentExtended = /*#__PURE__*/ `
    fragment ArtworkFragmentExtended on artwork {
  ...ArtworkFragment
  ...LatestArtworkEventFragment
  ...ArtworkSplitRecipientsFragment
  ...MostRecentAuctionFragment
  owner {
    ...UserFragment
  }
  creator: user {
    ...UserFragment
  }
  collection {
    symbol
    contractAddress
    slug
    name
    collectionImageUrl
    coverImageUrl
  }
}
    ${ArtworkFragment}
${LatestArtworkEventFragment}
${ArtworkSplitRecipientsFragment}
${MostRecentAuctionFragment}
${UserFragment}`;
export const PrivateSaleFragment = /*#__PURE__*/ `
    fragment PrivateSaleFragment on private_sale {
  deadlineAt
  ipfsPath
  price: saleAmountInETH
  soldAt
  buyer: userBuyer {
    ...UserFragment
  }
  seller: userSeller {
    ...UserFragment
  }
  artwork: artworkForSale {
    ...ArtworkFragment
    creator: user {
      ...UserFragment
    }
    collection {
      slug
    }
  }
}
    ${UserFragment}
${ArtworkFragment}`;
export const CollectionFragment = /*#__PURE__*/ `
    fragment CollectionFragment on collection {
  collectionImageUrl
  contractAddress
  slug
  coverImageUrl
  createdAt
  creatorAddress
  description
  id
  name
  symbol
  updatedAt
  contractType
  moderationStatus
  hiddenAt
}
    `;
export const CollectionFragmentExtended = /*#__PURE__*/ `
    fragment CollectionFragmentExtended on collection {
  ...CollectionFragment
  creator: user {
    ...UserFragment
  }
}
    ${CollectionFragment}
${UserFragment}`;
export const BidFragment = /*#__PURE__*/ `
    fragment BidFragment on bid {
  auctionId
  bidAmount
  bidder
  contractAddress
  createdAt
  datePlaced
  id
  seller
  status
  tokenId
  updatedAt
}
    `;
export const ActivityBidFragment = /*#__PURE__*/ `
    fragment ActivityBidFragment on bid {
  ...BidFragment
  auction {
    ...AuctionFragment
  }
  artwork {
    ...ArtworkFragment
    creator: user {
      ...UserFragment
    }
    collection {
      slug
    }
  }
}
    ${BidFragment}
${AuctionFragment}
${ArtworkFragment}
${UserFragment}`;
export const InviteFragment = /*#__PURE__*/ `
    fragment InviteFragment on invite_code {
  senderPublicKey
  redeemerPublicKey
  redeemedAt
}
    `;
export const SocialVerificationFragment = /*#__PURE__*/ `
    fragment SocialVerificationFragment on social_verification {
  id
  user
  createdAt
  updatedAt
  expiresAt
  lastCheckedAt
  socialVerificationURL
  verificationText
  userId
  username
  isValid
  service
  failedReason
  status
}
    `;
export const UserProfileFragment = /*#__PURE__*/ `
    fragment UserProfileFragment on user {
  ...UserFragment
  acceptedInvite {
    ...InviteFragment
  }
  twitSocialVerifs: socialVerifications(
    where: {isValid: {_eq: true}, service: {_eq: "TWITTER"}}
    limit: 1
  ) {
    ...SocialVerificationFragment
  }
  instaSocialVerifs: socialVerifications(
    where: {isValid: {_eq: true}, service: {_eq: "INSTAGRAM"}}
    limit: 1
  ) {
    ...SocialVerificationFragment
  }
  followerCount: follows_aggregate(where: {isFollowing: {_eq: true}}) {
    aggregate {
      count
    }
  }
  followingCount: following_aggregate(where: {isFollowing: {_eq: true}}) {
    aggregate {
      count
    }
  }
}
    ${UserFragment}
${InviteFragment}
${SocialVerificationFragment}`;