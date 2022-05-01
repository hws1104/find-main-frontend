/* eslint-disable max-lines */
/* eslint-disable react/jsx-max-depth */
import { useCallback, ReactNode } from 'react';
import { Formik, Form, FormikHelpers, FormikContextType } from 'formik';
import { useRouter } from 'next/router';
import { compose, cond, T } from 'ramda';
import * as Sentry from '@sentry/nextjs';

import TransactionLayoutV2 from 'components/layouts/TransactionLayoutV2';
import UploadGuard from 'components/transactions/generic/UploadGuard';
import DropzoneMediaField from 'components/forms/fields/DropzoneMediaField';
import DropzoneMediaPreview from 'components/forms/DropzoneMediaPreview';
import DropzoneUploadProgress from 'components/forms/DropzoneUploadProgress';
import DropzoneGenericWarning, {
  DropzoneGenericWarningProps,
} from 'components/upload/DropzoneGenericWarning';
import DropzoneDuplicateUpload from 'components/upload/DropzoneDuplicateUpload';

import useWalletSession from 'hooks/web3/wallet/use-wallet-session';
import useUploadToPinata from 'hooks/web3/use-upload-to-pinata';
import useUploadModelAssets from 'hooks/mutations/use-upload-model-assets';
import { useCreateArtwork } from 'graphql/server/mutations/create-artwork.generated';

import { getArtworkByAssetPathAndCreator } from 'queries/hasura/artworks-v2';
import { generatePinataApiKey } from 'queries/uploads';

import { UploadSchema, UPLOAD_ERRORS } from 'schemas/upload';

import { PageType } from 'types/page';
import { DUPLICATE_ASSET_ERROR_MSG } from 'lib/constants';
import { isEmptyOrNil } from 'utils/helpers';
import {
  createModelMimeType,
  getDimensionsFromFile,
  isModel,
} from 'utils/assets';

UploadMedia.getLayout = compose<JSX.Element, JSX.Element, JSX.Element>(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  TransactionLayoutV2({
    title: 'Create an NFT',
    backgroundColor: '$black5',
    pageType: PageType.minimalLoggedIn,
  }),
  (page: ReactNode) =>
    UploadGuard(page, {
      pageGuards: [
        'approved-creator',
        'social-verification',
        'user-moderated',
        'agreed-to-tos',
      ],
    })
);

interface UploadMediaFormValues {
  file: File;
  modelPoster: Blob;
}

export default function UploadMedia(): JSX.Element {
  const { data: user } = useWalletSession();

  const router = useRouter();

  const currentUserPublicKey = user?.publicAddress;
  const token = user?.token;

  const {
    mutateAsync: uploadToPinata,
    reset: resetUpload,
    meta: uploadMeta,
  } = useUploadToPinata();

  const { mutateAsync: createArtwork } = useCreateArtwork({
    onMutate: (res) => {
      Sentry.captureMessage('Create artwork payload', {
        tags: {
          section: 'upload-flow',
          mutation: 'CreateArtwork',
        },
        extra: res,
      });
    },
  });

  const { mutateAsync: uploadModelAssets } = useUploadModelAssets();

  const handleUpload = useCallback(
    async (
      values: UploadMediaFormValues,
      actions: FormikHelpers<UploadMediaFormValues>
    ) => {
      const { file } = values;

      const pinataApiKey = await generatePinataApiKey(token);

      // upload the file to pinata
      const pinataUpload = await uploadToPinata({
        file,
        jwt: pinataApiKey.JWT,
      });

      // construct the assetPath
      const assetPath = `${pinataUpload.IpfsHash}/${file.name}`;

      // query for existing MINTING or MINTED artworks with matching assetPath
      const duplicateArtwork = await getArtworkByAssetPathAndCreator({
        assetPath,
        publicKey: currentUserPublicKey,
      });

      // short-circuit the upload and throw an error if there is a duplicate
      if (duplicateArtwork) {
        return actions.setFieldError('file', DUPLICATE_ASSET_ERROR_MSG);
      }

      const fileDimensions = await getDimensionsFromFile(file);

      // for now we make the assumption that if
      // there is no file type it must be a 3D model
      const isTypeEmpty = isEmptyOrNil(file.type);
      const fallbackType = createModelMimeType(file.name);

      const isModelAsset = isModel(file.name);

      if (isModelAsset) {
        await uploadModelAssets({
          ipfsHash: pinataUpload.IpfsHash,
          modelPoster: values.modelPoster,
        });
      }

      const artwork = await createArtwork({
        data: {
          assetIPFSPath: assetPath,
          mimeType: isTypeEmpty ? fallbackType : file.type,
          width: fileDimensions.width,
          height: fileDimensions.height,
          duration: fileDimensions.duration,
          // we set this for 3D assets as they
          // pull directly from our ipfs endpoint
          assetHost: isTypeEmpty ? 'ipfs.foundation.app' : null,
        },
      });

      const artworkId = artwork.createArtwork.id;

      await router.push({
        pathname: `/create/mint/${artworkId}`,
        query: router.query,
      });
    },
    [
      currentUserPublicKey,
      token,
      router,
      uploadToPinata,
      createArtwork,
      uploadModelAssets,
    ]
  );

  return (
    <Formik<UploadMediaFormValues>
      validationSchema={UploadSchema}
      onSubmit={handleUpload}
      onReset={() => {
        resetUpload();
        uploadMeta.setPercentComplete(0);
      }}
      initialValues={{ file: null, modelPoster: null }}
    >
      {(formikContext) => (
        <Form
          style={{
            display: 'flex',
            flexGrow: 1,
            flexDirection: 'column',
          }}
        >
          {cond<FormikContextType<UploadMediaFormValues>, JSX.Element>([
            [
              (ctx) => ctx.isSubmitting,
              () => (
                <DropzoneUploadProgress
                  uploadProgress={uploadMeta.percentProgress}
                />
              ),
            ],
            // TODO: handle generic error state (e.g. upload fails)
            [
              (ctx) => ctx.errors.file === UPLOAD_ERRORS.TYPE_NOT_SUPPORTED,
              (ctx) => <DropzoneUnsupportedFile onReset={ctx.resetForm} />,
            ],
            [
              (ctx) => ctx.errors.file === UPLOAD_ERRORS.FILE_TOO_LARGE,
              (ctx) => <DropzoneSizeExceeded onReset={ctx.resetForm} />,
            ],
            [
              (ctx) => ctx.errors.file === DUPLICATE_ASSET_ERROR_MSG,
              (ctx) => <DropzoneDuplicateUpload onReset={ctx.resetForm} />,
            ],
            [
              (ctx) => Boolean(ctx.values.file),
              () => <DropzoneMediaPreview name="file" />,
            ],
            [T, () => <DropzoneMediaField name="file" />],
          ])(formikContext)}
        </Form>
      )}
    </Formik>
  );
}

function DropzoneSizeExceeded(
  props: Pick<DropzoneGenericWarningProps, 'onReset'>
) {
  return (
    <DropzoneGenericWarning
      {...props}
      title={UPLOAD_ERRORS.FILE_TOO_LARGE}
      description="Upload a file that is 50MB or smaller."
    />
  );
}

function DropzoneUnsupportedFile(
  props: Pick<DropzoneGenericWarningProps, 'onReset'>
) {
  return (
    <DropzoneGenericWarning
      {...props}
      title={UPLOAD_ERRORS.TYPE_NOT_SUPPORTED}
      description="Upload a JPG, PNG, GIF, GLTF, GLB, or MP4."
    />
  );
}
