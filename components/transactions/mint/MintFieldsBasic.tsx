/* eslint-disable react/jsx-max-depth */
/* eslint-disable max-lines */
import { useFormikContext } from 'formik';
import { Dispatch, SetStateAction, useCallback } from 'react';
import { any } from 'ramda';

import { styled } from 'stitches.config';

import Grid from 'components/base/Grid';
import Heading from 'components/base/Heading';
import Flex from 'components/base/Flex';
import TextLink from 'components/base/TextLink';
import Text from 'components/base/Text';
import Box from 'components/base/Box';
import Paragraph from 'components/base/Paragraph';
import Divider from 'components/base/Divider';
import TextField from 'components/forms/fields/TextField';
import SplitsToggle from 'components/transactions/split/SplitsToggle';
import Button from 'components/base/Button';
import CollectionSelectField from 'components/forms/fields/CollectionSelectField';
import GraySquare from 'components/base/GraySquare';
import TextAreaField from 'components/forms/fields/TextAreaField';
import TransitionPane from 'components/animation/TransitionPane';
import TransactionSubmitButton from '../generic/TransactionSubmitButton';
import SpinnerStroked from 'components/SpinnerStroked';
import { TransactionCard } from 'components/layouts/TransactionLayoutV2';

import { UserAvailableCollections } from 'graphql/hasura/queries/user-available-collections.generated';
import { useUpdateDraftArtwork } from 'graphql/server/mutations/update-artwork.generated';

import { MintFormValues } from './types';

import { getNFT721Address } from 'lib/addresses';
import { areKeysEqual } from 'utils/users';
import { notEmptyOrNil } from 'utils/helpers';

type FormStep = 'artwork-info' | 'splits-info';

const FormSection = styled(Box, {
  paddingX: 72,
});

interface MintFieldsBasicProps {
  setFormStep: Dispatch<SetStateAction<FormStep>>;
  collections: UserAvailableCollections['userCollections'];
  artworkId: string;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function MintFieldsBasic(props: MintFieldsBasicProps) {
  const { setFormStep, collections, artworkId } = props;

  // are there any available collections that aren’t the FND contract?
  const hasAvailableCollections = any(
    (collection) =>
      !areKeysEqual([collection.contractAddress, getNFT721Address()]),
    collections
  );

  const hasCollections = notEmptyOrNil(collections);

  return (
    <TransitionPane>
      <TransactionCard css={{ paddingY: 72 }}>
        <FormSection css={{ paddingBottom: '$9' }}>
          <Heading size={4} css={{ marginBottom: '$7' }}>
            Mint an NFT
          </Heading>

          <Text size={3} weight={600} css={{ marginBottom: '$4' }}>
            Add details
          </Text>

          <Paragraph size="sub" css={{ marginBottom: '$7' }}>
            Once your NFT is minted to the Ethereum blockchain, you will not be
            able to edit or update any of its information.
          </Paragraph>

          <Grid css={{ gap: '$6' }}>
            <TextField name="name" placeholder="Name" label="Name" />
            <TextAreaField
              name="description"
              placeholder="Description"
              tip="Use markdown syntax to embed links"
              label="Description"
              maxLength={1000}
              rows={8}
            />
          </Grid>
        </FormSection>

        {hasAvailableCollections && (
          <>
            <Divider />

            <FormSection css={{ paddingY: '$8' }}>
              <Text size={3} weight={600} css={{ marginBottom: '$4' }}>
                Choose collection
              </Text>

              <Paragraph size="sub" css={{ marginBottom: '$6' }}>
                Once an NFT is minted to a collection, it cannot be changed.
              </Paragraph>

              {hasCollections ? (
                <CollectionSelectField
                  collections={collections}
                  name="contractAddress"
                  disabled={!hasAvailableCollections}
                />
              ) : (
                <GraySquare
                  css={{
                    width: '100%',
                    height: 122,
                    borderRadius: '$3',
                    backgroundColor: '$black5',
                  }}
                />
              )}
            </FormSection>
          </>
        )}

        <Divider />

        <FormSection css={{ paddingY: '$8' }}>
          <SplitsToggle name="splitsEnabled" />
        </FormSection>

        <Divider />

        <FormSection css={{ paddingTop: '$8' }}>
          <MintSubmitButton setFormStep={setFormStep} />
          <MintPreviewButton artworkId={artworkId} />
        </FormSection>
      </TransactionCard>
    </TransitionPane>
  );
}

interface MintSubmitButtonProps {
  setFormStep: Dispatch<SetStateAction<FormStep>>;
}

function MintSubmitButton(props: MintSubmitButtonProps) {
  const { setFormStep } = props;

  const { values } = useFormikContext<MintFormValues>();

  return values.splitsEnabled ? (
    <Button
      hoverable
      type="button"
      color="black"
      size="large"
      shape="regular"
      css={{ width: '100%' }}
      onClick={() => setFormStep('splits-info')}
    >
      Continue
    </Button>
  ) : (
    <TransactionSubmitButton
      label="Mint NFT"
      submittingLabel="Minting NFT…"
      submittedLabel="NFT Minted"
    />
  );
}

interface MintPreviewButtonProps {
  artworkId: string;
}

function MintPreviewButton(props: MintPreviewButtonProps) {
  const { artworkId } = props;

  const { values } = useFormikContext<MintFormValues>();

  const { mutateAsync: updateDraftArtwork, isLoading } = useUpdateDraftArtwork({
    onSuccess: (res) => {
      const previewURL = new URL(
        `nft/~/${res.updateDraftArtwork.id}/preview`,
        location.origin
      );
      window.open(previewURL.href);
    },
  });

  const saveDraftArtwork = useCallback(async () => {
    return await updateDraftArtwork({
      data: {
        id: artworkId,
        name: values.name,
        description: values.description,
        contractAddress: values.contractAddress,
      },
    });
  }, [updateDraftArtwork, artworkId, values]);

  return (
    <Flex css={{ paddingTop: '$4', justifyContent: 'center' }}>
      <TextLink
        as="div"
        css={{ marginX: 'auto', minHeight: 20 }}
        onClick={saveDraftArtwork}
      >
        {isLoading ? <SpinnerStroked size={20} /> : 'Preview'}
      </TextLink>
    </Flex>
  );
}
