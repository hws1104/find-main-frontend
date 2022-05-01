/* eslint-disable max-lines */
/* eslint-disable react/jsx-max-depth */
import { useRouter } from 'next/router';
import { Form, Formik } from 'formik';
import { useCallback, useState, useEffect, useMemo, ReactNode } from 'react';
import { assocPath, compose, cond } from 'ramda';
import { useQueryClient } from 'react-query';
import { AnimatePresence } from 'framer-motion';
import * as Sentry from '@sentry/nextjs';

import TransactionGuard from 'components/transactions/generic/TransactionGuard';
import TransactionLayoutWithCardV2 from 'components/layouts/TransactionLayoutWithCardV2';
import BackButton from 'components/collections/BackButton';
import MintFieldsSplits from 'components/transactions/mint/MintFieldsSplits';
import MintFieldsBasic from 'components/transactions/mint/MintFieldsBasic';
import MintTransactionPending from 'components/transactions/mint/MintTransactionPending';
import MintTransactionSuccess from 'components/transactions/mint/MintTransactionSuccess';
import MintTransactionAwaiting from 'components/transactions/mint/MintTransactionAwaiting';
import MintTransactionError from 'components/transactions/mint/MintTransactionError';

import useSegmentEvent from 'hooks/use-segment-event';
import useGeneratePinataKey from 'hooks/queries/use-generate-pinata-key';
import useModal from 'hooks/use-modal';
import useWalletSession from 'hooks/web3/wallet/use-wallet-session';
import useMintTransaction from 'hooks/mutations/use-mint-transaction';
import useArtworkByContractTokenId from 'hooks/queries/hasura/artworks/use-artwork-by-contract-token-id';
import { useUserAvailableCollections } from 'hooks/queries/hasura/use-user-collections';
import {
  ArtworkByUuid,
  useArtworkByUuid,
} from 'graphql/hasura/queries/artwork-by-uuid.generated';

import { ArtworkStatus } from 'types/Artwork';
import { PageType } from 'types/page';
import { ModalKey } from 'types/modal';
import { MintFormValues } from 'components/transactions/mint/types';
import { UserAvailableCollections } from 'graphql/hasura/queries/user-available-collections.generated';
import { ArtworkByContractTokenId } from 'graphql/hasura/queries/artwork-by-contract-token-id.generated';

import { getError, getFirstValue, isAllTrue } from 'utils/helpers';
import { isNonUserRejectedError } from 'utils/transactions';
import { areKeysEqual } from 'utils/users';

import { getNFT721Address } from 'lib/addresses';
import { MintArtworkSchema } from 'schemas/mint';

type FormStep = 'artwork-info' | 'splits-info';

type MintEvent = {
  tokenId: number;
  contractAddress: string;
};

MintPageV2.getLayout = compose<JSX.Element, JSX.Element, JSX.Element>(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  TransactionLayoutWithCardV2({
    title: 'Mint an NFT',
    backgroundColor: '$black5',
    pageType: PageType.minimalLoggedIn,
    artworkQueryType: 'uuid',
  }),
  (page: ReactNode) =>
    TransactionGuard(page, {
      artworkQueryType: 'uuid',
      pageGuards: ['approved-creator', 'social-verification', 'user-moderated'],
    })
);

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function MintPageV2() {
  const router = useRouter();

  const { data: user } = useWalletSession();

  const queryClient = useQueryClient();

  const [sendSegmentEvent] = useSegmentEvent<MintEvent>();

  const { setCurrentModal } = useModal();

  const publicAddress = user?.publicAddress;
  const token = user?.token;

  const contractAddressParam = getFirstValue(router.query.contractAddress);
  const txHashParam = getFirstValue(router.query.txHash);
  const artworkId = getFirstValue(router.query.id);

  const { data: artworkData } = useArtworkByUuid(
    { id: artworkId },
    {
      enabled: Boolean(artworkId),
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      onSuccess: (res) => {
        const hasMintedArtwork = isAllTrue([
          res.artwork.tokenId,
          res.artwork.collection,
          res.artwork.isIndexed,
        ]);

        // prime the cache for the contractSlug + tokenId style query
        if (hasMintedArtwork) {
          queryClient.setQueryData<ArtworkByContractTokenId>(
            useArtworkByContractTokenId.getKey({
              tokenId: res.artwork.tokenId,
              contractSlug: res.artwork.collection.slug,
            }),
            { artworks: [res.artwork] }
          );
          // make sure we only track the mint event once
          sendSegmentEvent({
            eventName: 'artwork_minted',
            payload: {
              tokenId: res.artwork.tokenId,
              contractAddress: res.artwork.contractAddress,
            },
          });
        }
      },
      // refetch when a transaction is pending and no tokenId present
      refetchInterval: (res) => {
        const hasTokenId = Boolean(res?.artwork?.tokenId);
        const isIndexed = res?.artwork?.isIndexed;

        // artwork is ready in db when both tokenId && isIndexed === true
        const isArtworkReady = isAllTrue([hasTokenId, isIndexed]);
        // we should refetch is when it’s not ready in the
        // db  and we have a txHashParam from the URL
        const shouldRefetch = isAllTrue([!isArtworkReady, txHashParam]);

        return shouldRefetch ? 2500 : false;
      },
    }
  );

  const { data: availableCollectionsData } = useUserAvailableCollections(
    { publicKey: publicAddress },
    {
      enabled: Boolean(publicAddress),
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      initialData: {
        fndCollections: [],
        userCollections: [],
      },
    }
  );

  // we need to memoize artwork here otherwise it re-renders the form
  const artwork = useMemo(
    () => artworkData?.artwork,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      artworkData?.artwork?.id,
      artworkData?.artwork?.tokenId,
      artworkData?.artwork?.isIndexed,
    ]
  );

  const { data: pinataApiKey, refetch: refetchPinataKey } =
    useGeneratePinataKey({ token });

  const {
    mutateAsync: mintTransaction,
    reset: resetMintTransaction,
    error: mintTransactionError,
  } = useMintTransaction(
    { artwork, pinataApiKey },
    {
      onSuccess: async (transaction) => {
        await router.push({
          pathname: router.pathname,
          query: { ...router.query, txHash: transaction.hash },
        });
      },
      onError: async (err) => {
        if (err.message === 'No Provider Error') {
          setCurrentModal(ModalKey.AUTH_MAIN);
        }
        Sentry.captureException(getError(err), {
          tags: { section: 'mint-flow', mutation: useMintTransaction.getKey() },
        });
      },
    }
  );

  const handleSubmit = useCallback(
    async (values: MintFormValues) => {
      try {
        return await mintTransaction(values);
      } catch (err) {
        refetchPinataKey();
        console.log('catch handleSubmit', err);
      }
    },
    [mintTransaction, refetchPinataKey]
  );

  const [formStep, setFormStep] = useState<FormStep>('artwork-info');

  const onBackClick = useCallback(() => {
    setFormStep('artwork-info');
  }, []);

  return (
    <Formik<MintFormValues>
      enableReinitialize
      initialValues={{
        name: artwork?.name ?? '',
        description: artwork?.description ?? '',
        status: artwork?.status ?? ArtworkStatus.DRAFT,
        contractAddress: contractAddressParam || getNFT721Address(),
        splits: [{ address: publicAddress, shareInPercentage: 100 }],
        splitsEnabled: false,
        hasPinataKey: Boolean(pinataApiKey),
      }}
      validationSchema={MintArtworkSchema}
      onSubmit={handleSubmit}
    >
      {(formikState) => (
        <Form style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <AnimatePresence exitBeforeEnter>
            {cond<boolean, JSX.Element>([
              // when a non-wallet-interaction error occurs
              [
                () => isNonUserRejectedError(mintTransactionError),
                () => (
                  <MintTransactionError
                    onReset={resetMintTransaction}
                    error={mintTransactionError}
                    key="error"
                  />
                ),
              ],
              // mint is successful with presence of tokenId + isIndexed
              [
                () => isAllTrue([artwork?.tokenId, artwork?.isIndexed]),
                () => (
                  <MintTransactionSuccess key="success" artwork={artwork} />
                ),
              ],
              // mint transaction is pending with presence of txHash
              [
                () => Boolean(txHashParam),
                () => (
                  <MintTransactionPending key="pending" txHash={txHashParam} />
                ),
              ],
              // transaction is awaiting confirmation with form submitting
              [
                () => formikState.isSubmitting,
                () => <MintTransactionAwaiting key="awaiting" />,
              ],
              // form is in the splits info step
              [
                () => formStep === 'splits-info',
                () => (
                  <>
                    <BackButton onClick={onBackClick} />
                    <MintFieldsSplits
                      key="splits"
                      publicAddress={publicAddress}
                    />
                  </>
                ),
              ],
              // form is in the basic info step
              [
                () => formStep === 'artwork-info',
                () => (
                  <>
                    {/* hook component to watch the form state and update react-query cache */}
                    <SyncFormState
                      artworkId={artworkId}
                      formValues={formikState.values}
                      collections={availableCollectionsData}
                    />
                    <MintFieldsBasic
                      key="basic"
                      setFormStep={setFormStep}
                      collections={availableCollectionsData}
                      artworkId={artworkId}
                    />
                  </>
                ),
              ],
            ])()}
          </AnimatePresence>
        </Form>
      )}
    </Formik>
  );
}

interface SyncFormStateProps {
  formValues: MintFormValues;
  artworkId: string;
  collections: UserAvailableCollections['userCollections'];
}

// this hook component takes the artwork title from the form and
// syncs it into the artwork card through the react-query cache
function SyncFormState(props: SyncFormStateProps): null {
  const { formValues, artworkId, collections } = props;

  const queryClient = useQueryClient();

  const artworkKey = useArtworkByUuid.getKey({ id: artworkId });

  useEffect(
    () => {
      // update the cache with the new artwork name from the form
      queryClient.setQueryData<ArtworkByUuid>(artworkKey, (cachedArtwork) =>
        assocPath(['artwork', 'name'], formValues.name, cachedArtwork)
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [formValues.name]
  );

  useEffect(
    () => {
      if (collections) {
        const collection = collections.find((collection) =>
          areKeysEqual([collection.contractAddress, formValues.contractAddress])
        );
        // update the cached artwork with the selected collection
        queryClient.setQueryData<ArtworkByUuid>(artworkKey, (cachedArtwork) =>
          assocPath(['artwork', 'collection'], collection, cachedArtwork)
        );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [formValues.contractAddress]
  );

  return null;
}
