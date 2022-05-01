import { useMutation, UseMutationOptions } from 'react-query';
import { cond, equals } from 'ramda';
import axios from 'axios';

import { S3AssetBucket } from 'types/Assets';

type SignFile = {
  url: string;
};

interface SignFileVariables {
  file: File;
  bucket: S3AssetBucket;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function useSignFile<TError = Error, TContext = unknown>(
  options?: UseMutationOptions<SignFile, TError, SignFileVariables, TContext>
) {
  return useMutation(async (variables) => {
    const query = await axios.post<SignFile>('/api/sign-url', {
      path: getUploadPath(variables),
      bucket: variables.bucket,
    });
    return { url: query.data.url };
  }, options);
}

interface UploadPathOptions {
  file: File;
  bucket: S3AssetBucket;
}

const getRandString = () => Math.random().toString(36).substr(2, 9);

function getUploadPath({ file, bucket }: UploadPathOptions) {
  const fileName = `${getRandString()}-${file.name}`;

  return cond<S3AssetBucket, string>([
    [equals(S3AssetBucket.Collections), () => `collections/${fileName}`],
    [equals(S3AssetBucket.Models), () => `creators/collection/${fileName}`],
  ])(bucket);
}
