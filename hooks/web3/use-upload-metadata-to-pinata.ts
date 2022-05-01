import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from 'react-query';
import axios, { AxiosRequestConfig } from 'axios';
import { PINATA_FILE_ENDPOINT } from 'lib/constants';

interface UploadToPinataVariables {
  name: string;
  description: string;
  assetPath: string;
  jwt: string;
}

interface UploadMetadataToPinataApi {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
  isDuplicate: boolean;
}

interface UploadMetadataToPinata extends UploadMetadataToPinataApi {
  metadataIPFSPath: string;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function useUploadMetadataToPinata<
  TError = Error,
  TContext = unknown
>(
  options?: UseMutationOptions<
    UploadMetadataToPinata,
    TError,
    UploadToPinataVariables,
    TContext
  >
): UseMutationResult<
  UploadMetadataToPinata,
  TError,
  UploadToPinataVariables,
  TContext
> {
  return useMutation(async (variables) => {
    const { name, description, assetPath, jwt } = variables;

    const metadata = buildMetadata(name, description);

    const formData = buildFormData({
      fileContents: JSON.stringify({
        name,
        description,
        image: 'ipfs://' + assetPath,
      }),
      pinataOptions: JSON.stringify({
        wrapWithDirectory: true,
      }),
      metadata: JSON.stringify(metadata),
    });

    const formOptions: AxiosRequestConfig = {
      maxContentLength: Infinity,
      headers: {
        'Content-Type': `multipart/form-data;`,
        Authorization: `Bearer ${jwt}`,
      },
    };

    const { data } = await axios.post<UploadMetadataToPinataApi>(
      PINATA_FILE_ENDPOINT,
      formData,
      formOptions
    );

    return {
      ...data,
      metadataIPFSPath: data.IpfsHash + '/metadata.json',
    };
  }, options);
}

function buildMetadata(name: string, description: string) {
  return {
    name,
    keyvalues: {
      description,
    },
  };
}

interface DataArgs {
  fileContents: string;
  pinataOptions: string;
  metadata: string;
}

function buildFormData({ fileContents, pinataOptions, metadata }: DataArgs) {
  const data = new FormData();
  const mockFile = new File([fileContents], 'metadata.json', {
    type: 'application/json',
  });
  data.append('file', mockFile, 'metadata.json');
  data.append('pinataOptions', pinataOptions);
  data.append('pinataMetadata', metadata);
  return data;
}
