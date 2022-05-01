import { useMutation, UseMutationOptions } from 'react-query';
import axios from 'axios';

import { buildS3BaseAssetUrl } from 'utils/assets';
import { S3AssetBucket } from 'types/Assets';

interface SignedUrl {
  url: string;
  bucket: S3AssetBucket;
}

interface UploadModelAssetsVariables {
  ipfsHash: string;
  modelPoster: Blob;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function useUploadModelAssets<
  TError = Error,
  TContext = unknown
>(
  options?: UseMutationOptions<
    boolean,
    TError,
    UploadModelAssetsVariables,
    TContext
  >
) {
  return useMutation(async (variables) => {
    const assetPath = buildS3BaseAssetUrl({ assetId: variables.ipfsHash });

    const signedUrl = await axios.post<SignedUrl>('/api/sign-url', {
      path: `${removePrecedingSlash(assetPath)}/nft.png`,
      bucket: S3AssetBucket.Models,
    });

    await axios.put(signedUrl.data.url, variables.modelPoster);

    return true;
  }, options);
}

// We have to have a preceeding slash for all the other helpers
// But here we need to remove it otherwise s3 tries to add to a null folder
const removePrecedingSlash = (path: string) => path.replace(/^\//, '');
