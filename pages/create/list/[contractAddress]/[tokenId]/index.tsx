/* eslint-disable max-lines */
/* eslint-disable react/jsx-max-depth */
import { Form, Formik } from 'formik';
import { useCallback, ReactNode } from 'react';
import { compose, cond, T } from 'ramda';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

import TransactionGuard from 'components/transactions/generic/TransactionGuard';
import TransactionLayoutWithCardV2 from 'components/layouts/TransactionLayoutWithCardV2';
import ListFieldsPrimary from 'components/transactions/list/ListFieldsPrimary';
import ListFieldsSecondary from 'components/transactions/list/ListFieldsSecondary';
import ListTransactionAwaiting from 'components/transactions/list/ListTransactionAwaiting';
import ListTransactionPending from 'components/transactions/list/ListTransactionPending';
import ListTransactionSuccess from 'components/transactions/list/ListTransactionSuccess';
import ListTransactionError from 'components/transactions/list/ListTransactionError';
import ListTransactionAlreadyListed from 'components/transactions/list/ListTransactionAlreadyListed';

import { PageGuard } from 'types/Moderation';
import { MarketType } from 'types/Auction';
import { ModalKey } from 'types/modal';
import { PageType } from 'types/page';
import { ListFormValues } from 'components/transactions/list/types';

import { ListArtworkSchema } from 'schemas/list';

import useModal from 'hooks/use-modal';
import useWalletSession from 'hooks/web3/wallet/use-wallet-session';
import useSegmentEvent, { SegmentAuctionEvent } from 'hooks/use-segment-event';
import useCreateReserveAuction from 'hooks/web3/transactions/use-create-reserve-auction';
import { useApprovalModal } from 'hooks/web3/use-has-approval';
import { useArtworkByContractTokenIdFromRouter } from 'hooks/queries/hasura/artworks/use-artwork-by-contract-token-id';

import { getFirstValue, isAllTrue } from 'utils/helpers';
import { isNonUserRejectedError } from 'utils/transactions';
import { isAuctionOpenV2 } from 'utils/auctions/auctions';
import { toBNFixed } from 'utils/numbers';

type ListEvent = SegmentAuctionEvent & {
  marketType: string;
};

ListPageV2.getLayout = compose<JSX.Element, JSX.Element, JSX.Element>(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  TransactionLayoutWithCardV2({
    title: 'List your NFT',
    backgroundColor: '$black5',
    pageType: PageType.minimalLoggedIn,
    artworkQueryType: 'tokenId',
  }),
  WithTransactionGuard
);

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function ListPageV2() {
  const router = useRouter();

  const { setCurrentModal } = useModal();

  const [sendSegmentEvent] = useSegmentEvent<ListEvent>();

  const txHashParam = getFirstValue(router.query.txHash);
  const marketType = getFirstValue(router.query.type);

  const {
    mutateAsync: createReserveAuction,
    reset: resetCreateReserveAuction,
    error: createReserveAuctionError,
  } = useCreateReserveAuction({
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
    },
  });

  const { data: artwork } = useArtworkByContractTokenIdFromRouter({
    refetchOnWindowFocus: false,
    refetchInterval: (res) => {
      const isAuctionOpen = isAuctionOpenV2(res);
      return isAllTrue([!isAuctionOpen, txHashParam]) ? 5000 : null;
    },
  });

  const isAuctionOpen = isAuctionOpenV2(artwork);

  useEffect(
    () => {
      if (isAuctionOpen) {
        const auction = getFirstValue(artwork.auctions);
        sendSegmentEvent({
          eventName: 'artwork_listed',
          payload: {
            marketType,
            tokenId: artwork.tokenId,
            contractAddress: artwork.contractAddress,
            auctionId: auction.auctionId,
          },
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isAuctionOpen]
  );

  const { data: user } = useWalletSession();

  useApprovalModal({
    contractAddress: artwork?.contractAddress,
    publicAddress: user?.publicAddress,
  });

  const handleSubmit = useCallback(
    async (values: ListFormValues) => {
      try {
        const tx = await createReserveAuction({
          reservePrice: toBNFixed(values.price),
          tokenId: values.tokenId,
          contractAddress: values.contractAddress,
        });
      } catch (err) {
        console.log('catch handleSubmit', err);
      }
    },
    [createReserveAuction]
  );

  return (
    <Formik<ListFormValues>
      enableReinitialize
      initialValues={{
        price: '',
        tokenId: artwork?.tokenId,
        contractAddress: artwork?.contractAddress,
      }}
      validationSchema={ListArtworkSchema}
      onSubmit={handleSubmit}
    >
      {(formikState) => (
        <Form style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <AnimatePresence exitBeforeEnter>
            {cond<boolean, JSX.Element>([
              // when a non-wallet-interaction error occurs
              [
                () => isNonUserRejectedError(createReserveAuctionError),
                () => (
                  <ListTransactionError
                    onReset={resetCreateReserveAuction}
                    error={createReserveAuctionError}
                    key="error"
                  />
                ),
              ],
              // mint is successful with presence of tokenId + isIndexed
              [
                () => isAllTrue([txHashParam, isAuctionOpen]),
                () => (
                  <ListTransactionSuccess
                    key="success"
                    artwork={artwork}
                    marketType={
                      marketType === 'secondary' ? 'secondary' : 'primary'
                    }
                  />
                ),
              ],
              // artwork has already been listed
              [
                () => isAuctionOpen,
                () => <ListTransactionAlreadyListed artwork={artwork} />,
              ],
              // mint transaction is pending with presence of txHash
              [
                () => Boolean(txHashParam),
                () => (
                  <ListTransactionPending key="pending" txHash={txHashParam} />
                ),
              ],
              [
                () => formikState.isSubmitting,
                () => <ListTransactionAwaiting key="awaiting" />,
              ],
              // when a non-wallet-interaction error occurs
              [
                () => marketType === 'secondary',
                () => <ListFieldsSecondary key="secondary" />,
              ],
              // when a non-wallet-interaction error occurs
              [T, () => <ListFieldsPrimary key="primary" />],
            ])()}
          </AnimatePresence>
        </Form>
      )}
    </Formik>
  );
}

function WithTransactionGuard(page: ReactNode) {
  const router = useRouter();
  const marketType: MarketType =
    getFirstValue(router.query.type) === 'secondary' ? 'secondary' : 'primary';

  return TransactionGuard(page, {
    artworkQueryType: 'tokenId',
    pageGuards: getPageGuards(marketType),
  });
}

const getPageGuards = cond<MarketType, PageGuard[]>([
  [
    (type) => type === 'secondary',
    () => ['user-moderated', 'artwork-moderated'],
  ],
  [
    T,
    () => [
      'approved-creator',
      'social-verification',
      'user-moderated',
      'artwork-moderated',
    ],
  ],
]);
