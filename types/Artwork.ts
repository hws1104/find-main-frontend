import {
  UserFragment,
  ArtworkFragment,
  ArtworkFragmentExtended,
  ArtworkEventFragment,
} from 'graphql/hasura/hasura-fragments.generated';
import {
  Artwork,
  Artwork_User_Visibility,
  Maybe,
} from 'graphql/hasura/types-hasura.generated';
import Account from './Account';
import { AlgoliaArtwork } from './Algolia';
import { ArtworkEvent, LatestArtworkEvent } from './Event';

import { ModerationStatus } from './Moderation';

export type ArtworkFromDB = {
  name: string;
  description?: string;
  assetScheme?: string;
  assetHost?: string;
  assetPath?: string;
  assetIPFSPath?: string;
  metadataScheme?: string;
  metadataHost?: string;
  metadataPath?: string;
  metadataIPFSPath?: string;
  downloadableUrl?: string;
  tokenId?: string;
  user?: Account;
  creator?: Account;
  status?: string;
  mimeType?: string;
  assetId?: string;
  assetStatus?: AssetStatus;
  mintTxHash?: string;
  width?: number;
  height?: number;
  moderationStatus?: ModerationStatus;
  moderationFrom?: string;
  event?: ArtworkEvent;
  assetVersion?: number;
  tags?: string[];
  privateSales: {
    ipfsPath?: string;
    deadlineAt?: string;
    soldAt?: string;
    price?: string;
  }[];
};

type LatestArtworkEvents = {
  latestEvents: LatestArtworkEvent[];
};

export type ArtworkV2 = ArtworkFragmentExtended &
  LatestArtworkEvents & {
    artworkUserVisibilities?: Array<Pick<Artwork_User_Visibility, 'hiddenAt'>>;
  };

export type BasicArtwork = Maybe<
  { creator?: Maybe<UserFragment> } & ArtworkFragment
>;

export type CollectionArtwork = Maybe<
  { creator?: Maybe<UserFragment> } & ArtworkFragmentExtended
>;

export interface ArtworkWithEvent extends ArtworkFragmentExtended {
  event: ArtworkEventFragment;
}

export type ArtworkAssetFields = Pick<
  Artwork,
  | 'assetIPFSPath'
  | 'assetScheme'
  | 'assetHost'
  | 'assetPath'
  | 'assetId'
  | 'assetStatus'
  | 'mimeType'
  | 'name'
  | 'tokenId'
  | 'id'
>;

export type MergedArtwork = ArtworkV2;

export type PolymorphicArtwork = MergedArtwork | AlgoliaArtwork | ArtworkV2;

export default MergedArtwork;

export enum ArtworkStatus {
  DRAFT = 'DRAFT',
  MINTING = 'MINTING',
  MINTED = 'MINTED',
  FAILED = 'FAILED',
}

export enum AssetProcessor {
  MUX = 'MUX',
  COCONUT = 'COCONUT',
}

export enum AssetStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export type ArtworkQueryType = 'uuid' | 'tokenId';
