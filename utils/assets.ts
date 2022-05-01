/* eslint-disable max-lines */
import {
  propEq,
  ifElse,
  allPass,
  curry,
  compose,
  prop,
  includes,
  propSatisfies,
  when,
  is,
  cond,
  pick,
  T,
} from 'ramda';
import qs from 'qs';
import { CID } from 'multiformats/cid';

import { getFileName, isValidURL } from 'utils/urls';
import { notEmptyOrNil } from 'utils/helpers';

import {
  imageAssetsHost,
  appAssetsHost,
  modelImageAssetsHost,
  videoAssetsHost,
} from 'lib/assets';

import Artwork, { BasicArtwork, ArtworkAssetFields } from 'types/Artwork';
import { VideoAssetQuality, VideoAssetOptions } from 'types/Assets';
import Account from 'types/Account';

export const MODEL_FORMAT_EXTENSIONS = [
  { extension: 'glb', mimetype: 'model/gltf-binary' },
  { extension: 'gltf', mimetype: 'model/gltf+json' },
];

const getIpfsHash = (assetIpfsPath: string) => {
  return when(
    notEmptyOrNil,
    (assetIpfsPath) =>
      assetIpfsPath.split('/').find((s: string) => {
        try {
          return Boolean(CID.parse(s));
        } catch (err) {
          return false;
        }
      }),
    assetIpfsPath
  );
};

// https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
export function bytesToSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) {
    return '0 Byte';
  }
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
}

export const isImage = (fileUrl: string): boolean =>
  /\.(jpg|jpeg|png|gif|svg)$/i.test(getFileName(fileUrl));

export const isVideo = (fileUrl: string): boolean =>
  /\.(mp4)$/i.test(getFileName(fileUrl));

export const isModel = (fileUrl: string): boolean =>
  /\.(gltf|glb)$/i.test(getFileName(fileUrl));

export const createModelMimeType = (fileName: string): string => {
  const fileExtension = fileName.split('.').pop();
  const modelMimetype = MODEL_FORMAT_EXTENSIONS.find(
    (o) => o.extension === fileExtension
  );

  return modelMimetype ? modelMimetype.mimetype : null;
};

interface ImgixOptions {
  q?: number;
  w?: number;
  h?: number;
  'max-w'?: number;
  'max-h'?: number;
  'min-h'?: number;
  'min-w'?: number;
  auto?: 'format' | 'compress' | 'format,compress';
  fit?: 'crop' | 'fill';
  fm?: 'jpg' | 'webp' | 'png';
  dpr?: number;
  bg?: string;
  cs?: 'srgb';
  frame?: number;
  exp?: number;
  blur?: number;
}

const IMGIX_OPTION_KEYS: (keyof ImgixOptions)[] = [
  'q',
  'w',
  'h',
  'auto',
  'fit',
  'max-w',
  'max-h',
  'min-h',
  'min-w',
  'fm',
  'dpr',
  'bg',
  'frame',
  'exp',
  'blur',
];

interface AssetOptions extends ImgixOptions, VideoAssetOptions {}

export function buildImgixUrl(
  url: string,
  options: ImgixOptions = {},
  hostname = appAssetsHost
): string {
  const hasUrl = notEmptyOrNil(url);
  if (!hasUrl) {
    return null;
  }

  // pick out only the options relevant to imgix
  const imageOptions = pick<ImgixOptions, string>(IMGIX_OPTION_KEYS, {
    // default options
    q: 50,
    // override options
    ...options,
  });

  const queryString = qs.stringify(imageOptions);

  try {
    const urlObject = new URL(url);

    return `${hostname}${urlObject.pathname}?${queryString}`;
  } catch (error) {
    return `${hostname}/${url}?${queryString}`;
  }
}

interface BuildImgixAssetUrlArgs {
  assetScheme: string;
  assetHost: string;
  assetPath: string;
  options: ImgixOptions;
}

export function buildImgixAssetUrl({
  assetScheme,
  assetHost,
  assetPath,
  options = {},
}: BuildImgixAssetUrlArgs): string {
  const imageOptions = pick<ImgixOptions, string>(IMGIX_OPTION_KEYS, options);

  const imgixOpts: ImgixOptions = {
    q: 50,
    auto: 'format,compress',
    cs: 'srgb',
    ...imageOptions,
  };
  const queryString = qs.stringify(imgixOpts);

  try {
    const hasURLSchemeHost = Boolean(assetScheme && assetHost);
    const urlObject = new URL(
      hasURLSchemeHost ? `${assetScheme}${assetHost}` : imageAssetsHost
    );

    // Note: The ipfs part of the path isn't needed since that's contained
    // in the Imgix web folder config
    urlObject.pathname = assetPath;

    urlObject.search = queryString;
    const urlString = urlObject.toString();
    return urlString;
  } catch (error) {
    // TODO: Send error to Sentry
    console.error(error);
    throw error;
  }
}

export const buildImgixUrlNew = curry(
  (options: ImgixOptions, url: string): string => {
    return buildImgixUrl(url, options);
  }
);

export const whenURLIsValid = curry(
  (fn: (arg0: string) => string, url: string) =>
    ifElse(
      // test whether the string is a valid URL
      isValidURL,
      // if the URL is valid, call the asset builder fn
      () => fn(url),
      // otherwise return null
      () => null
    )(url)
);

export const buildProfileShareImageUrl = whenURLIsValid(
  buildImgixUrlNew({ 'max-w': 1680, q: 70, fm: 'jpg' })
);

export const mimeTypeExtensions = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
  'video/mp4': 'mp4',
  'video/quicktime': 'mov',
};

interface FileDimensions {
  width: number;
  height: number;
  duration?: number;
}

export const getDimensionsFromImage = (file: File): Promise<FileDimensions> =>
  new Promise((resolve) => {
    const fileAsDataURL = window.URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve({
        height: img.height,
        width: img.width,
      });
    };
    img.src = fileAsDataURL;
  });

export const getDimensionsFromVideo = (file: File): Promise<FileDimensions> =>
  new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.src = url;
    video.onloadedmetadata = () => {
      resolve({
        width: video.videoWidth,
        height: video.videoHeight,
        duration: video.duration,
      });
    };
  });

// if the file’s type contains `video/` return true
const hasVideoMimeType = compose(includes('video/'), prop('type'));
const hasImageMimeType = compose(includes('image/'), prop('type'));

// if it’s a video mimeType, use the video file handler
// otherwise use the image one
const handleFileByType = cond([
  [hasVideoMimeType, getDimensionsFromVideo],
  [hasImageMimeType, getDimensionsFromImage],
  [T, () => ({ width: 0, height: 0 })],
]);

export const getDimensionsFromFile = (file: File): Promise<FileDimensions> => {
  return handleFileByType(file);
};

export const buildCoverImageUrl = compose<string, string>(
  whenURLIsValid(
    buildImgixUrlNew({ q: 75, w: 1600, auto: 'format,compress', fit: 'fill' })
  )
);

export const buildArtworkFooterImageUrl = compose<string, string>(
  whenURLIsValid(
    buildImgixUrlNew({
      blur: 180,
      'max-w': 1200,
      'max-h': 596,
      auto: 'format,compress',
      fit: 'crop',
      exp: -5,
    })
  )
);

export const getCreatorCardHero = compose<Account, string, string>(
  whenURLIsValid(
    buildImgixUrlNew({
      q: 30,
      'min-w': 400,
      'min-h': 200,
      fit: 'crop',
      auto: 'format,compress',
    })
  ),
  prop('coverImageUrl')
);

const isString = is(String);

// artwork has a video mimeType
const isVideoMimeType = propSatisfies(
  // guard the check only when it’s a string
  when(isString, includes('video/')),
  'mimeType'
);
const isImageMimeType = propSatisfies(
  // guard the check only when it’s a string
  when(isString, includes('image/')),
  'mimeType'
);

const isModelMimeType = propSatisfies(
  // guard the check only when it’s a string
  when(isString, includes('model/')),
  'mimeType'
);

const hasVideoAssetSuccessStatus = propEq('assetStatus', 'SUCCESS');
const hasVideoAssetPendingStatus = propEq('assetStatus', 'PENDING');

// when it is a video with a assetStatus === PENDING
export const hasVideoAssetProcessingStatus = allPass([
  isVideoMimeType,
  hasVideoAssetPendingStatus,
]);

export const buildS3BaseAssetUrl = ({
  assetId,
  assetPath,
}: {
  assetId: string;
  assetPath?: string;
}): string => {
  // This is a quirk of the backend, assetId is only present on FND contracts assets and is stored in the sub folder strcuture as seen below
  // If assetId isnt present then only the assetPath is present and is the correct url
  if (!assetId) {
    return assetPath;
  }
  // For perf reasons we generate extra folders as it allows for more throughput
  // folder1 is 2 letters from the 4th from the end
  // folder2 is 2 letters from the 2nd from the end
  const folder1 = assetId.substr(-4, 2);
  const folder2 = assetId.substr(-2, 2);

  // Use the last 4 chars of the assetIPFSId to ensure even distribution of keys on first characters
  return `/${folder1}/${folder2}/${assetId}`;
};

const getVideoAssetHost = (artwork: Artwork) => {
  const hasURLSchemeHost = Boolean(artwork.assetScheme && artwork.assetHost);
  const urlHost = hasURLSchemeHost
    ? `${artwork.assetScheme}${artwork.assetHost}`
    : videoAssetsHost;

  return urlHost;
};

const buildPreviewVideoUrl = cond([
  [
    propEq('assetVersion', 3),
    (artwork: Artwork) => {
      return `${getVideoAssetHost(artwork)}${buildS3BaseAssetUrl({
        assetId: artwork.assetId,
        assetPath: artwork.assetPath,
      })}/nft_preview_q3.mp4`;
    },
  ],
  [
    T,
    (artwork: Artwork) =>
      `${getVideoAssetHost(artwork)}${buildS3BaseAssetUrl({
        assetId: artwork.assetId,
        assetPath: artwork.assetPath,
      })}/nft_preview.mp4`,
  ],
]);

const buildVideoUrl = cond([
  [
    propEq('assetVersion', 3),
    (artwork: Artwork) =>
      `${getVideoAssetHost(artwork)}${buildS3BaseAssetUrl({
        assetId: artwork.assetId,
        assetPath: artwork.assetPath,
      })}/nft_q4.mp4`,
  ],
  [
    T,
    (artwork: Artwork) =>
      `${getVideoAssetHost(artwork)}${buildS3BaseAssetUrl({
        assetId: artwork.assetId,
        assetPath: artwork.assetPath,
      })}/nft.mp4`,
  ],
]);

export const buildPosterImageUrl = (artwork: Artwork): string => {
  return `${getVideoAssetHost(artwork)}${buildS3BaseAssetUrl({
    assetId: artwork.assetId,
    assetPath: artwork.assetPath,
  })}/nft.jpg`;
};

const buildModelPosterImageUrl = (
  artwork: ArtworkAssetFields,
  options?: AssetOptions
): string => {
  const ipfsHash = getIpfsHash(artwork.assetPath);
  const path = buildS3BaseAssetUrl({ assetId: ipfsHash });
  const url = `${modelImageAssetsHost}${path}/nft.png`;

  return buildImgixUrl(url, options, modelImageAssetsHost);
};

export const buildArtworkModelUrl = (artwork: Artwork): string => {
  const assetUrl = `${artwork.assetScheme}${artwork.assetHost}/ipfs/${artwork.assetIPFSPath}`;

  return assetUrl;
};

export const buildPosterUrl = cond([
  [
    (artwork) => isModel(artwork.assetPath),
    (artwork, options) => buildModelPosterImageUrl(artwork, options),
  ],
  [allPass([isVideoMimeType, hasVideoAssetSuccessStatus]), buildPosterImageUrl],
  [T, () => null],
]);

const buildArtworkVideoUrl = curry((options: AssetOptions, artwork: Artwork) =>
  cond([
    [
      propEq('quality', VideoAssetQuality.Preview),
      () => buildPreviewVideoUrl(artwork),
    ],
    [T, () => buildVideoUrl(artwork)],
  ])(options)
);

const buildArtworkImageUrl = curry(
  (options: AssetOptions, artwork: Artwork) => {
    return buildImgixAssetUrl({
      assetScheme: artwork.assetScheme,
      assetHost: artwork.assetHost,
      assetPath: artwork.assetPath,
      options,
    });
  }
);

export const buildArtworkAssetUrl = curry(
  (options: AssetOptions, artwork: ArtworkAssetFields): string =>
    cond([
      [isVideoMimeType, buildArtworkVideoUrl(options)],
      [isImageMimeType, buildArtworkImageUrl(options)],
      [isModelMimeType, buildArtworkModelUrl],
    ])(artwork)
);

export const buildAssetStaticImage = curry(
  (options: AssetOptions, artwork: ArtworkAssetFields) =>
    ifElse(
      isVideoMimeType,
      buildPosterUrl,
      buildArtworkImageUrl(options)
    )(artwork)
);

const cardAssetDefaults: AssetOptions = {
  'max-w': 960,
  'max-h': 960,
  quality: VideoAssetQuality.Preview,
};

export const buildArtworkCardAssetUrl = buildArtworkAssetUrl({
  ...cardAssetDefaults,
});

export const buildArtworkPageAssetUrl = buildArtworkAssetUrl({
  q: 80,
  'max-w': 1680,
  'max-h': 1680,
  quality: VideoAssetQuality.Max,
});

export const buildPageShareUrl = buildArtworkAssetUrl({
  'max-w': 1680,
  'max-h': 1680,
  fm: 'jpg',
  quality: VideoAssetQuality.Max,
});

export const buildAvatarUrl = curry(
  (size: number, imageUrl: string): string => {
    return buildImgixUrlNew(
      { w: size, h: size, fit: 'crop', auto: 'format,compress', dpr: 2 },
      imageUrl
    );
  }
);

export const buildCollectionCardUrl = buildImgixUrlNew({
  'max-w': 800,
  'max-h': 800,
  fit: 'fill',
  auto: 'format,compress',
  // decrease the exposure directly on the image asset instead of applying a filter to the img
  exp: -5,
});

export const buildIPFSAssetUrl = (artwork: BasicArtwork) => {
  return `https://ipfs.io/ipfs/${artwork.assetIPFSPath}`;
};
