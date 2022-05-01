import { useState } from 'react';
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from 'react-query';
import axios, { AxiosRequestConfig } from 'axios';

import { S3AssetBucket } from 'types/Assets';

import useSignFile from 'hooks/mutations/use-sign-file';

type FileUploadS3 = {
  url: string;
};

type FileUploadS3Progress = {
  percentProgress: number;
  fileName: string;
};

interface FileUploadS3Variables {
  file: File;
  bucket: S3AssetBucket;
}

type UseMutationResultWithProgress<T, U> = T & { meta: U };

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function useFileUploadS3<TError = Error, TContext = unknown>(
  options?: UseMutationOptions<
    FileUploadS3,
    TError,
    FileUploadS3Variables,
    TContext
  >
): UseMutationResultWithProgress<
  UseMutationResult<FileUploadS3, TError, FileUploadS3Variables, TContext>,
  FileUploadS3Progress
> {
  const { mutateAsync: signFiles } = useSignFile();

  const [percentProgress, setPercentProgress] = useState(0);
  const [fileName, setFileName] = useState<string>(null);

  const handleFileUpload = useMutation(async (variables) => {
    const { file, bucket } = variables;

    const uploadPath = await signFiles({ file, bucket });

    setFileName(file.name);

    const uploadOptions: AxiosRequestConfig = {
      headers: {
        'Content-Type': file.type,
      },
      onUploadProgress: (ev) => {
        const progressPercentage = (ev.loaded / ev.total) * 100;
        setPercentProgress(progressPercentage);
      },
    };

    await axios.put(uploadPath.url, file, uploadOptions);

    return {
      url: getPathFromUrl(uploadPath.url),
    };
  }, options);

  return {
    ...handleFileUpload,
    meta: {
      percentProgress,
      fileName,
    },
  };
}

function getPathFromUrl(url) {
  return url.split('?')[0];
}
