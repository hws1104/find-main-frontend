import { AssetStatus } from './Artwork';
import { ModerationStatus } from './Moderation';

export enum AlgoliaArtworkAvailability {
  RESERVE_NOT_MET = 'RESERVE_NOT_MET',
  UNLISTED = 'UNLISTED',
  SOLD = 'SOLD',
  LIVE_AUCTION = 'LIVE_AUCTION',
}

export enum AlgoliaAuctionStatus {
  OPEN = 'OPEN',
  FINALIZED = 'FINALIZED',
  CANCELED = 'CANCELED',
}

export enum AlgoliaUserType {
  OTHER = 'OTHER',
  CREATOR = 'CREATOR',
  COLLECTOR = 'COLLECTOR',
}

export enum AlgoliaUserSocialVerification {
  NOT_VERIFIED = 'NOT_VERIFIED',
  TWITTER = 'TWITTER',
  INSTAGRAM = 'INSTAGRAM',
}

export type AlgoliaUserBasic = Pick<
  AlgoliaUser,
  | 'coverImageUrl'
  | 'name'
  | 'username'
  | 'profileImageUrl'
  | 'publicKey'
  | 'username'
>;

export type AlgoliaUser = {
  createdAt: string;
  creatorName: string;
  description: string;
  id: string;
  name: string;
  objectID: string;
  publicKey: string;
  userIndex: number;
  username: string;
  profileImageUrl: string;
  moderationStatus: ModerationStatus;
  coverImageUrl: string;
  userTypeFacet: AlgoliaUserType;
  socialVerificationFacet: AlgoliaUserSocialVerification;
  isHidden: boolean;
  followerCount: number;
  numMinted: number;
  numSold: number;
};

export type AlgoliaAuction = {
  auctionId: number;
  createdAt: string;
  currentPrice: number;
  endsAt: number | string;
  highestBidder: string;
  isPrimarySale: boolean;
  reservePriceInETH: number;
  seller: AlgoliaUserBasic;
  startsAt: string;
  status: AlgoliaAuctionStatus;
};

export type AlgoliaCollectionCreator = {
  coverImageUrl: string;
  name: string;
  profileImageUrl: string;
  publicKey: string;
  username: string;
};

export type AlgoliaCollection = {
  objectID: string;
  name: string;
  symbol: string;
  description: string;
  contractAddress: string;
  collectionImageUrl: string;
  coverImageUrl: string;
  isHidden: boolean;
  createdAt: number;
  slug: string;
  creator: AlgoliaCollectionCreator;
  artworkCount: number;
};

export type AlgoliaArtwork = {
  assetIPFSPath: string;
  assetScheme: string;
  assetHost: string;
  assetPath: string;
  assetId: string;
  assetStatus: AssetStatus;
  auction: AlgoliaAuction;
  availability: AlgoliaArtworkAvailability;
  createdAt: string;
  creator: AlgoliaUserBasic;
  description: string;
  id: string;
  isDeleted: boolean;
  isHidden: boolean;
  mimeType: string;
  moderationStatus: ModerationStatus;
  name: string;
  objectID: string;
  tokenId: number;
  collection: AlgoliaCollection;
};

export type AlgoliaIndexName = {
  label: string;
  value: string;
  enabledModes: string[];
};

export type AlgoliaIndex = AlgoliaIndexName & {
  indexes: AlgoliaIndexName[];
  enabledModes?: string[];
};

export type SearchResultHit = Hit<{
  count: number;
  isRefined: boolean;
  label: string;
  value: string[];
}>;

type HighlightResultArray<TItem> = TItem extends string
  ? HighlightResultPrimitive[]
  : Array<HighlightResult<TItem>>;

interface HighlightResultPrimitive {
  /** the value of the facet highlighted (html) */
  value: string;
  /** full, partial or none depending on how the query terms match */
  matchLevel: 'none' | 'partial' | 'full';
  matchedWords: string[];
  fullyHighlighted?: boolean;
}

type HighlightResultField<TField> = TField extends Array<infer TItem>
  ? HighlightResultArray<TItem>
  : TField extends string
  ? HighlightResultPrimitive
  : HighlightResult<TField>;

export type HighlightResult<TDoc> = TDoc extends { [k: string]: any }
  ? { [K in keyof TDoc]?: HighlightResultField<TDoc[K]> }
  : never;

export interface BasicDoc {
  [k: string]: string;
}

export type Hit<TDoc = BasicDoc> = TDoc & {
  objectID: string;
  /**
   * Contains the searchable attributes within the document and shows which part of the
   * attribute was matched by the search terms.  Note that if the index has defined
   * any searchable attributes, this object will only contain those keys and others
   * will not exist.
   */
  _highlightResult: HighlightResult<TDoc>;
};

type AlgoliaCollectionIndex =
  | 'collections'
  | 'collections_sort_date_created_desc'
  | 'collections_sort_date_created_asc'
  | 'collections_sort_date_last_minted_to_desc'
  | 'collections_sort_date_last_minted_to_asc';

export type AlgoliaSearchIndex = 'users' | AlgoliaCollectionIndex;
