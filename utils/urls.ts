/* eslint-disable max-lines */
import qs from 'query-string';

import { URL_REGEX } from 'schemas/generic';

import {
  startsWith,
  anyPass,
  test,
  unless,
  when,
  is,
  ifElse,
  curry,
  allPass,
  always,
  compose,
  includes,
  nth,
  map,
  groupBy,
  toPairs,
  sort,
  findIndex,
  whereEq,
} from 'ramda';

import { OG_IMAGE } from './constants/meta';
import { isProd, notEmptyOrNil } from 'utils/helpers';
import { getTokenId, getStrAfterLastSlash } from 'utils/artwork/artwork';
import { getInstagramHandle, getSocialHandle } from './strings';
import { isString } from './formatters';

import { ArtworkFragmentExtended } from 'graphql/hasura/hasura-fragments.generated';
import { BasicArtwork } from 'types/Artwork';

export const urlWithParams = (url: string, query: any): string => {
  return when(
    notEmptyOrNil,
    (url) => {
      // Check if url already contains a query string
      // Cant use new URL api as Contentful sends no protocol
      const qsPattern = new RegExp(/\?.+=.*/g);
      if (qsPattern.test(url)) {
        return url;
      }
      return `${url}?${qs.stringify(query)}`;
    },
    url
  );
};

export const buildAvatarUrl = (imageUrl: string): string => {
  return when(
    notEmptyOrNil,
    (imageUrl) =>
      urlWithParams(imageUrl, {
        q: 90,
        w: 200,
        h: 200,
        fit: 'fill',
      }),
    imageUrl
  );
};

export const withHttps = when(
  is(String),
  ifElse(
    startsWith('http'),
    (url) => url,
    (url) => `https:${url}`
  )
);

export const getOgImage = ifElse(notEmptyOrNil, withHttps, always(OG_IMAGE));

export const absoluteUrl = (path: string): string => {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL && isProd()
      ? process.env.NEXT_PUBLIC_APP_URL
      : process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : 'http://localhost:3000';

  if (!path || path === '/') {
    return baseUrl;
  }

  return baseUrl + path;
};

export function getFileName(fileUrl: string): string {
  return when(
    notEmptyOrNil,
    (fileUrl) => fileUrl.split('/').pop().split('#')[0].split('?')[0],
    fileUrl
  );
}

export function getFileExtension(fileUrl: string): string {
  return when(
    notEmptyOrNil,
    (fileUrl) => {
      const filename = getFileName(fileUrl);
      return filename.split('.').pop();
    },
    fileUrl
  );
}
const appendHandle = curry((url: string, handle: string): string => {
  return when(
    notEmptyOrNil,
    (handle) => (handle.startsWith('http') ? handle : `${url}${handle}`),
    handle
  );
});

export const buildSocialLink = {
  website: appendHandle('http://'),
  instagram: compose(
    appendHandle('https://instagram.com/'),
    getInstagramHandle
  ),
  twitter: compose(appendHandle('https://twitter.com/'), getSocialHandle),
  // TODO: Handle YouTube user accounts (non-channel ones) better
  youtube: appendHandle('https://youtube.com/channel/'),
  facebook: appendHandle('https://facebook.com/'),
  twitch: appendHandle('https://twitch.tv/'),
  tiktok: appendHandle('https://www.tiktok.com/'),
  snapchat: appendHandle('https://snapchat.com/add/'),
};

export function getUrlHost(url: string): string {
  return when(
    notEmptyOrNil,
    (url) => {
      try {
        const urlObject = new URL(url);
        return urlObject.hostname;
      } catch (error) {
        return url;
      }
    },
    url
  );
}

// is a valid url
const isValidUrl = test(URL_REGEX);
// starts with a @ symbol
const hasAtSymbol = startsWith('@');

export const buildTikTokHandle = when(
  allPass([is(String), notEmptyOrNil]),
  unless(
    // if the url starts with an @ symbol
    // or is a URL match return false
    anyPass([hasAtSymbol, isValidUrl]),
    // otherwise append @ symbol if true
    (handle) => `@${handle}`
  )
);

export const VALID_URL_REGEX =
  /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})*$/;

export const isValidURL = test(VALID_URL_REGEX);

export const buildMetadataUrl = (artwork: BasicArtwork): string => {
  if (artwork.metadataHost.includes('ipfs.foundation.app')) {
    return `https://ipfs.io/ipfs/${artwork.metadataPath}`;
  }
  return `${artwork.metadataScheme}${artwork.metadataHost}${artwork.metadataPath}`;
};

const isStringWithDash = allPass([isString, includes('-')]);
const isNumberTest = test(/^\d*(\.\d+)?$/);

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const getTokenIdFromUrl = compose<string, string, string, number>(
  when(isNumberTest, Number),
  when(isStringWithDash, getTokenId),
  when(isValidURL, getStrAfterLastSlash)
);

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const getCollectionSlugFromUrl = (url: string) => {
  const urlComponents = url.split('/');
  // -2 is the second item in the url -1 is the tokenID
  const slug = nth(-2, urlComponents);

  return slug;
};

interface ArtworkUrl {
  collectionSlug: string;
  tokenId: number;
}

export function parseArtworkUrl(url: string): ArtworkUrl {
  return {
    collectionSlug: getCollectionSlugFromUrl(url),
    tokenId: getTokenIdFromUrl(url),
  };
}

const groupArtworksByCollectionSlug = compose<
  string[],
  ArtworkUrl[],
  Record<string, ArtworkUrl[]>
>(
  groupBy((url) => url.collectionSlug),
  map(parseArtworkUrl)
);
interface ArtworkUrlsByCollection {
  collectionSlug: string;
  tokenIds: number[];
}

export const groupArtworkUrlsByCollection = (
  urls: string[]
): ArtworkUrlsByCollection[] => {
  const groupedArtworkUrls = groupArtworksByCollectionSlug(urls);

  return toPairs(groupedArtworkUrls).flatMap(
    ([collectionSlug, artworkUrls]) => ({
      collectionSlug,
      tokenIds: artworkUrls.map((url) => url.tokenId),
    })
  );
};

const findSortedIndex = (artwork: ArtworkFragmentExtended) =>
  findIndex(
    whereEq({
      collectionSlug: artwork.collection.slug,
      tokenId: artwork.tokenId,
    })
  );

export function sortFeaturedArtworks(
  sortedUrls: ArtworkUrl[],
  artworks: ArtworkFragmentExtended[]
) {
  return sort<ArtworkFragmentExtended>((a, b) => {
    const firstIndex = findSortedIndex(a)(sortedUrls);
    const secondIndex = findSortedIndex(b)(sortedUrls);
    return firstIndex - secondIndex;
  }, artworks);
}
