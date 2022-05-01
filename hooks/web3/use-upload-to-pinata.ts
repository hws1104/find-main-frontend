import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from 'react-query';
import axios, { AxiosRequestConfig } from 'axios';
import { useState, Dispatch, SetStateAction } from 'react';

import { PINATA_FILE_ENDPOINT } from 'lib/constants';

type FileUploadProgress = {
  percentProgress: number;
  setPercentComplete: Dispatch<SetStateAction<number>>;
};

type UseMutationResultWithProgress<T, U> = T & { meta: U };

interface UploadToPinataVariables {
  file: File;
  jwt: string;
}

interface UploadToPinata {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
  isDuplicate: boolean;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function useUploadToPinata<TError = Error, TContext = unknown>(
  options?: UseMutationOptions<
    UploadToPinata,
    TError,
    UploadToPinataVariables,
    TContext
  >
): UseMutationResultWithProgress<
  UseMutationResult<UploadToPinata, TError, UploadToPinataVariables, TContext>,
  FileUploadProgress
> {
  const [percentComplete, setPercentComplete] = useState(0);

  const mutation = useMutation<
    UploadToPinata,
    TError,
    UploadToPinataVariables,
    TContext
  >(async (variables) => {
    const formData = new FormData();
    formData.append('file', variables.file);

    // https://pinata.cloud/documentation#PinFileToIPFS
    const pinataOptions = JSON.stringify({
      wrapWithDirectory: true,
    });
    formData.append('pinataOptions', pinataOptions);

    const formOptions: AxiosRequestConfig = {
      maxContentLength: Infinity,
      headers: {
        'Content-Type': `multipart/form-data`,
        Authorization: `Bearer ${variables.jwt}`,
      },
      onUploadProgress: (ev) => {
        const progressPercentage = (ev.loaded / ev.total) * 100;
        setPercentComplete(progressPercentage);
      },
    };

    const query = await axios.post<UploadToPinata>(
      PINATA_FILE_ENDPOINT,
      formData,
      formOptions
    );

    return query.data;
  }, options);

  return {
    ...mutation,
    meta: {
      setPercentComplete,
      percentProgress: percentComplete,
    },
  };
}
