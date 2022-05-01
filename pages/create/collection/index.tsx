/* eslint-disable max-lines */
import { useState, useEffect, useCallback, ReactNode } from 'react';
import { compose } from 'ramda';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import random from 'lodash/random';

import CreateCollectionGridLayout from 'components/collections/CreateCollectionGridLayout';
import MobileNotSupportedModal from 'components/modals/MobileNotSupportedModal';
import CreateCollectionForms, {
  CreateCollectionStep,
} from 'components/collections/CreateCollectionForms';
import UploadGuard from 'components/transactions/generic/UploadGuard';
import TransactionLayoutV2 from 'components/layouts/TransactionLayoutV2';

import useCollectionByContractAddress from 'hooks/queries/hasura/collections/use-collection-by-contract-address';
import useDeployCollection from 'hooks/web3/transactions/use-deploy-collection';
import usePredictCollectionAddress from 'hooks/web3/transactions/use-predict-collection-address';
import useWalletSession from 'hooks/web3/wallet/use-wallet-session';
import useModal from 'hooks/use-modal';

import { CreateCollectionSchema } from 'schemas/collection';

import { ModalKey } from 'types/modal';
import { PageType } from 'types/page';

import { getFirstValue, isAllTrue, isEmptyOrNil } from 'utils/helpers';
import { maybeUpperCase } from 'utils/case';

export interface CreateCollectionValues {
  name: string;
  symbol: string;
}

CreateCollection.getLayout = compose(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  TransactionLayoutV2({
    title: 'Create a Collection',
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

export default function CreateCollection(): JSX.Element {
  const router = useRouter();

  const [step, setStep] = useState(CreateCollectionStep.Create);
  const [contractNonce] = useState(() => random(1, Number.MAX_SAFE_INTEGER));

  const { data: user } = useWalletSession();

  const publicAddress = user?.publicAddress;

  // If a user gets to the step where they have submitted a tx
  // a tx hash param is added to the url, they can reload the page
  // and it will  take them to the correct part of the flow
  const txHashParam = getFirstValue(router.query.txHash);
  const contractAddress = getFirstValue(router.query.contractAddress);
  const nameParam = getFirstValue(router.query.name);
  const symbolParam = getFirstValue(router.query.symbol);

  useEffect(() => {
    if (txHashParam) {
      setStep(CreateCollectionStep.Deploy);
    }
  }, [txHashParam]);

  const handleStartAgain = () => {
    setStep(CreateCollectionStep.Create);
  };

  const { setCurrentModal } = useModal();

  const { mutateAsync: deployCollection, data: collectionData } =
    useDeployCollection({
      // TODO: figure out a more robust way to do this
      onError: (err) => {
        if (err.message === 'No Provider Error') {
          setCurrentModal(ModalKey.AUTH_MAIN);
        }
      },
    });

  // if we have a txHash from deploying we use
  // that otherwise we use the param value
  const mergedTxHash = collectionData?.hash ?? txHashParam;

  const handleSubmit = useCallback(
    async (values: CreateCollectionValues) => {
      if (step === CreateCollectionStep.Create) {
        return setStep(CreateCollectionStep.Deploy);
      }
      const uppercaseSymbol = maybeUpperCase(values.symbol);
      const res = await deployCollection({
        ...values,
        nonce: contractNonce,
        symbol: uppercaseSymbol,
      });
      await router.push({
        pathname: router.pathname,
        query: {
          txHash: res.hash,
          contractAddress,
          name: values.name,
          symbol: values.symbol,
        },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [step, contractNonce, router.isReady, deployCollection]
  );

  usePredictCollectionAddress(
    { nonce: contractNonce, creatorAddress: publicAddress },
    {
      onSuccess: async (contractAddress) => {
        await router.replace({
          pathname: router.pathname,
          query: { ...router.query, contractAddress },
        });
      },
    }
  );

  useCollectionByContractAddress(
    { contractAddress },
    {
      enabled: isAllTrue([txHashParam]),
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchInterval: 2500,
      onSuccess: async (res) => {
        const contractAddress = res?.contractAddress;

        if (contractAddress) {
          await router.push({
            pathname: '/create/collection/success',
            query: { ...router.query, contractAddress },
          });
        }
      },
    }
  );

  return (
    <>
      <MobileNotSupportedModal />

      <>
        <Formik<CreateCollectionValues>
          onSubmit={handleSubmit}
          initialValues={{ name: '', symbol: '' }}
          validationSchema={CreateCollectionSchema}
        >
          {({ values, isSubmitting }) => {
            const nameValue = isEmptyOrNil(values.name)
              ? nameParam
              : values.name;
            const symbolValue = maybeUpperCase(
              isEmptyOrNil(values.symbol) ? symbolParam : values.symbol
            );
            return (
              <Form>
                <CreateCollectionGridLayout
                  name={nameValue}
                  symbol={symbolValue}
                >
                  <CreateCollectionForms
                    step={step}
                    txHash={mergedTxHash}
                    contractAddress={contractAddress}
                    onBackClick={handleStartAgain}
                    isLoading={isSubmitting}
                  />
                </CreateCollectionGridLayout>
              </Form>
            );
          }}
        </Formik>
      </>
    </>
  );
}
