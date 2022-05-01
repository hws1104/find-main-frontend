/* eslint-disable react/jsx-max-depth */
import { styled } from 'stitches.config';
import { Form, Formik, useField } from 'formik';
import { useCallback } from 'react';
import { useQueryClient } from 'react-query';
import { useMeasure } from 'react-use';

import ModalContainer from './common/ModalContainer';
import ModalContent from './common/ModalContent';
import Heading from 'components/base/Heading';
import TextAreaField from 'components/forms/fields/TextAreaField';
import Box from 'components/base/Box';
import Divider from 'components/base/Divider';
import DropzoneFieldV2 from 'components/forms/fields/DropzoneFieldV2';
import Grid from 'components/base/Grid';
import FormikSubmitButton from 'components/forms/FormikSubmitButton';
import TextField from 'components/forms/fields/TextField';
import Text from 'components/base/Text';

import { S3AssetBucket } from 'types/Assets';
import { ModalKey } from 'types/modal';

import { CollectionByContractSlug } from 'graphql/hasura/queries/collection-by-contract-slug.generated';

import { isAllTrue, notEmptyOrNil } from 'utils/helpers';

import {
  useUpdateCollection,
  UpdateCollectionVariables,
} from 'graphql/server/mutations/update-collection.generated';
import useCollectionByContractAddress from 'hooks/queries/hasura/collections/use-collection-by-contract-address';
import useModal from 'hooks/use-modal';
import useCollectionByContractSlug from 'hooks/queries/hasura/collections/use-collection-by-contract-slug';
import { EditCollectionSchema } from 'schemas/collection';
import { useRouter } from 'next/router';

interface EditCollectionModalProps {
  contractAddress: string;
}

export default function EditCollectionModal(
  props: EditCollectionModalProps
): JSX.Element {
  const { contractAddress } = props;

  const router = useRouter();
  const { currentModal, resetModal } = useModal();
  const queryClient = useQueryClient();

  const isModalOpen = currentModal === ModalKey.EDIT_COLLECTION;

  const { data: collectionData, refetch: refetchCollection } =
    useCollectionByContractAddress(
      { contractAddress },
      {
        enabled: isAllTrue([isModalOpen]),
        refetchOnWindowFocus: false,
      }
    );

  const { mutateAsync: updateCollectionMutation } = useUpdateCollection();

  const updateCollection = useCallback(
    async (values: UpdateCollectionVariables) => {
      await updateCollectionMutation(values);
      const { data: collection } = await refetchCollection();
      // update the main collection page data via the query cache
      queryClient.setQueryData<CollectionByContractSlug>(
        useCollectionByContractSlug.getKey({ contractSlug: collection.slug }),
        { collections: [collection] }
      );
      // close the modal
      resetModal();

      // If the collection slug has changed then push to the new url
      if (collection.slug !== collectionData.slug) {
        await router.push(`/collection/${collection.slug}`);
      }
    },
    [
      queryClient,
      updateCollectionMutation,
      refetchCollection,
      resetModal,
      collectionData,
      router,
    ]
  );

  return (
    <ModalContainer modalKey={ModalKey.EDIT_COLLECTION}>
      <ModalContent css={{ maxWidth: 520, padding: 0 }}>
        <Heading size={4} css={{ padding: '$8' }}>
          Edit Collection
        </Heading>
        <Formik<UpdateCollectionVariables>
          validationSchema={EditCollectionSchema({
            initialSlug: collectionData?.slug,
          })}
          onSubmit={updateCollection}
          enableReinitialize
          // so the slug validation fires without needing input blur
          initialTouched={{
            data: {
              slug: true,
            },
          }}
          initialValues={{
            data: {
              contractAddress,
              description: collectionData?.description ?? '',
              collectionImageUrl: collectionData?.collectionImageUrl ?? '',
              coverImageUrl: collectionData?.coverImageUrl ?? '',
              slug: collectionData?.slug ?? '',
            },
          }}
        >
          <Form>
            <Grid
              css={{ gridRowGap: '$7', paddingX: '$8', paddingBottom: '$7' }}
            >
              <DropzoneFieldV2
                name="data.collectionImageUrl"
                label="Collection Logo"
                bucket={S3AssetBucket.Collections}
                // 10mb in bytes
                maxSize={10000000}
              />
              <DropzoneFieldV2
                name="data.coverImageUrl"
                label="Cover Image"
                bucket={S3AssetBucket.Collections}
                // 10mb in bytes
                maxSize={10000000}
              />
              <TextAreaField
                label="Description"
                name="data.description"
                tip="Use markdown syntax to embed links"
                maxLength={500}
                rows={5}
              />
              <CollectionSlugField label="Collection URL" name="data.slug" />
            </Grid>

            <Divider />

            <Box
              css={{ paddingBottom: '$8', paddingX: '$8', paddingTop: '$6' }}
            >
              <FormikSubmitButton
                label="Save changes"
                submittingLabel="Saving changes…"
                submittedLabel="Saved changes"
              />
            </Box>
          </Form>
        </Formik>
      </ModalContent>
    </ModalContainer>
  );
}

interface CollectionSlugFieldProps {
  label: string;
  name: string;
}

function CollectionSlugField(props: CollectionSlugFieldProps) {
  const { label, name } = props;

  const [, meta] = useField(name);

  const [measureRef, { width }] = useMeasure();

  const hasError = notEmptyOrNil(meta.error);

  return (
    <Box css={{ position: 'relative' }}>
      <TextField
        label={label}
        name={name}
        meta={
          <InputPrefix ref={measureRef}>foundation.app/collection/</InputPrefix>
        }
        css={{
          '& input': {
            paddingLeft: `calc(${width}px + $5)`,
          },
        }}
      />
      {!hasError && (
        <Text
          size={0}
          weight={600}
          css={{ color: '$green100', paddingTop: '$3' }}
        >
          This URL is available
        </Text>
      )}
    </Box>
  );
}

const InputPrefix = styled(Text, {
  pointerEvents: 'none',
  color: '$black40',
  position: 'absolute',
  top: '50%',
  paddingLeft: '$5',
  transform: 'translateY(-50%)',
  zIndex: 2,
});
