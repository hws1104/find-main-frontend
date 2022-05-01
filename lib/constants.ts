import { ModerationStatus } from 'types/Moderation';

export const EXAMPLE_PATH = 'cms-contentful';
export const CMS_NAME = 'Contentful';
export const CMS_URL = 'https://www.contentful.com';
export const HOME_OG_IMAGE_URL =
  'https://og-image.now.sh/Next.js%20Blog%20Example%20with%20**Contentful**.png?theme=light&md=1&fontSize=100px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg&images=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOSIgaGVpZ2h0PSIzMiI%2BCiAgPHBhdGggZmlsbD0iI0ZGRDg1RiIgZD0iTTkuNyAyMi4zQzggMjAuNyA3IDE4LjUgNyAxNnMxLTQuNyAyLjYtNi4zYzEuNC0xLjQgMS40LTMuNiAwLTVzLTMuNi0xLjQtNSAwQzEuOCA3LjYgMCAxMS42IDAgMTZzMS44IDguNCA0LjcgMTEuM2MxLjQgMS40IDMuNiAxLjQgNSAwIDEuMy0xLjQgMS4zLTMuNiAwLTV6Ij48L3BhdGg%2BCiAgPHBhdGggZmlsbD0iIzNCQjRFNyIgZD0iTTkuNyA5LjdDMTEuMyA4IDEzLjUgNyAxNiA3czQuNyAxIDYuMyAyLjZjMS40IDEuNCAzLjYgMS40IDUgMHMxLjQtMy42IDAtNUMyNC40IDEuOCAyMC40IDAgMTYgMFM3LjYgMS44IDQuNyA0LjdjLTEuNCAxLjQtMS40IDMuNiAwIDUgMS40IDEuMyAzLjYgMS4zIDUgMHoiPjwvcGF0aD4KICA8cGF0aCBmaWxsPSIjRUQ1QzY4IiBkPSJNMjIuMyAyMi4zQzIwLjcgMjQgMTguNSAyNSAxNiAyNXMtNC43LTEtNi4zLTIuNmMtMS40LTEuNC0zLjYtMS40LTUgMHMtMS40IDMuNiAwIDVDNy42IDMwLjIgMTEuNiAzMiAxNiAzMnM4LjQtMS44IDExLjMtNC43YzEuNC0xLjQgMS40LTMuNiAwLTUtMS40LTEuMy0zLjYtMS4zLTUgMHoiPjwvcGF0aD4KICA8Y2lyY2xlIGN4PSI3LjIiIGN5PSI3LjIiIHI9IjMuNSIgZmlsbD0iIzMwOEJDNSI%2BPC9jaXJjbGU%2BCiAgPGNpcmNsZSBjeD0iNy4yIiBjeT0iMjQuOCIgcj0iMy41IiBmaWxsPSIjRDU0NjVGIj48L2NpcmNsZT4KPC9zdmc%2B';

export const PINATA_FILE_ENDPOINT =
  'https://api.pinata.cloud/pinning/pinFileToIPFS';
export const PINATA_JSON_ENDPOINT =
  'https://api.pinata.cloud/pinning/pinJSONToIPFS';

// TODO: Delete this when we stop using it
export const ONE_ETH_IN_WEI = '1000000000000000000';

export const POLL_INTERVAL_TOKEN_ID = 1000 * 2; // 2 seconds
export const POLL_INTERVAL_VIDEO = 1000 * 2; // 2 seconds

export const TWITTER_URL_MAX_CHARS = 400; // TODO: Pick value

export const HOMEPAGE_FEATURED_ARTWORK_ID = 1;
export const HOMEPAGE_FEATURED_ARTWORK_COLLECTION_SLUG = 'flowers';

export const HOMEPAGE_FEATURED_ARTWORK_IDS = [
  'https://staging.foundation.app/@lozzam/~/5178',
  'https://staging.foundation.app/@baggybydesign/sit/2',
  'https://staging.foundation.app/@baggybydesign/~/5187',
  'https://staging.foundation.app/@baggybydesign/rad/5100',
  'https://staging.foundation.app/@net121/gr33n/1',
  'https://staging.foundation.app/@baggybydesign/~/5135',
  'https://staging.foundation.app/@baggybydesign/bigrad/4',
  'https://staging.foundation.app/@lozzam/~/5173',
];

export const HOMEPAGE_FEATURED_CREATOR_IDS = [
  'http://localhost:3000/loudsqueak',
  'http://localhost:3000/sdgjasldkgjasldg',
  'http://localhost:3000/loudsqueak-demo',
  'http://localhost:3000/lozza',
  'http://localhost:3000/turnipboi',
  'http://localhost:3000/net121',
  'http://localhost:3000/gosset2',
  'http://localhost:3000/matt',
  'http://localhost:3000/paul',
  'http://localhost:3000/maalavidaa',
  'http://localhost:3000/jkm',
  'http://localhost:3000/paulcowgill',
  'http://localhost:3000/gonzzzalo',
  'http://localhost:3000/elpizo_',
  'http://localhost:3000/samanthays',
  'http://localhost:3000/gonzzzalo_',
  'http://localhost:3000/loudsqueak_',
  'http://localhost:3000/davidportebeckefeld_',
  'http://localhost:3000/arvidabystromold',
  'http://localhost:3000/pixlpa',
  'http://localhost:3000/notsamantha',
  'http://localhost:3000/arvidabystrom',
  'http://localhost:3000/davidportebeckefeld',
  'http://localhost:3000/Nick',
  'http://localhost:3000/samantha',
  'http://localhost:3000/hd-test',
  'http://localhost:3000/coopahtroopa',
];

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const PUBLIC_FEED_PER_PAGE_COUNT = 48;

export const CATEGORY_PER_PAGE_COUNT = 100;

export const DEFAULT_PROVIDER_TYPE = 'METAMASK';

export const ALL_USER_MODERATION_STATUSES = [
  ModerationStatus.Active,
  ModerationStatus.Suspended,
  ModerationStatus.UnderReview,
];

export const ALL_ARTWORK_MODERATION_STATUSES = [
  ...ALL_USER_MODERATION_STATUSES,
  ModerationStatus.TakedownRequested,
];

export const DUPLICATE_ASSET_ERROR_MSG = 'DUPLICATE_ASSET';

export const MIN_FOLLOWS_COUNT = 5;

// the foundation 15%  fee multiplier
export const FND_FEE_MULTIPLIER = 0.15;

// the creator’s 85%
export const CREATOR_FEE_MULTIPLIER = 1 - FND_FEE_MULTIPLIER;

export const SOLD_FOR_LABEL = 'Sold for';
export const CURRENT_BID_LABEL = 'Current bid';
export const RESERVE_PRICE_LABEL = 'Reserve price';

export const WALLETCONNECT_BRIDGE =
  'https://foundation.bridge.walletconnect.org';

export const SENTRY_IGNORED_ERRORS = [
  'MetaMask Personal Message Signature: User denied message signature.',
  'MetaMask Tx Signature: User denied transaction signature.',
  'MetaMask Message Signature: User denied message signature.',
  'User rejected request',
  'User rejected the transaction',
  'ResizeObserver loop limit exceeded',
  'ResizeObserver loop completed with undelivered notifications.',
];

export const CONTENTFUL_HOME_PAGE_ID = '4aQQfoWs4jjk4srqvD1eyJ';

export const WEEKLY_FORM_URL =
  'https://withfoundation.us19.list-manage.com/subscribe/post-json?u=c4a22288e5ecbe301dff16398&amp;id=4b6e100ee2';

export const COLLECTOR_FORM_URL =
  'https://withfoundation.us19.list-manage.com/subscribe/post-json?u=c4a22288e5ecbe301dff16398&amp;id=070bb51df0';

export const MAX_SPLIT_RECIPIENT_COUNT = 4;

export const LEVER_API_URL =
  'https://api.lever.co/v0/postings/with-foundation?mode=json';

export const FND_CONTRACT_SLUG = '~';
