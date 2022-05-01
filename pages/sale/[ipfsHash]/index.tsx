/* eslint-disable react/jsx-max-depth */
/* eslint-disable max-lines */
import { useRouter } from 'next/router';
import { isAfter } from 'date-fns';
import { useFormik } from 'formik';
import { useCallback, useEffect } from 'react';
import { head } from 'ramda';
import {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';

import { styled } from 'stitches.config';

import Button from 'components/base/Button';
import Box from 'components/base/Box';
import Text from 'components/base/Text';
import Flex from 'components/base/Flex';
import Link from 'components/links/Link';
import UserTagV2 from 'components/users/UserTagV2';
import TransactionSplitPane from 'components/transactions/TransactionSplitPane';
import TransactionPane from 'components/transactions/TransactionPane';
import PrivateSaleCountdown from 'components/transactions/privateSale/PrivateSaleCountdown';
import PrivateSaleWarningInvalid from 'components/transactions/privateSale/PrivateSaleWarningInvalid';
import PrivateSaleWarningUnauthorized from 'components/transactions/privateSale/PrivateSaleWarningUnauthorized';
import ArtworkCard from 'components/cards/artwork/ArtworkCard';
import LoadingPage from 'components/LoadingPage';
import TransactionLayoutV2 from 'components/layouts/TransactionLayoutV2';
import { TransactionFormContainer } from 'components/transactions/TransactionContainerV2';
import { TransactionError } from 'components/transactions/TransactionError';
import FieldHeading from 'components/forms/FieldHeading';
import TransactionSection from 'components/transactions/TransactionSection';
import TransactionHeading from 'components/transactions/TransactionHeading';
import DisabledButton from 'components/forms/transactions/DisabledButton';
import WalletAuthBlock from 'components/auth/WalletAuthBlock';
import PrivateSaleWelcomeModal from 'components/modals/PrivateSaleWelcomeModal';
import TransactionIPFSLink from 'components/transactions/TransactionIPFSLink';
import FollowPopover from 'components/follows/FollowPopover';
import PrivateSalePageMeta from 'components/transactions/privateSale/PrivateSalePageMeta';
import TransactionContainerV2 from 'components/transactions/TransactionContainerV2';
import TransactionConfirm from 'components/transactions/generic/TransactionConfirm';

import {
  getFirstValue,
  isAllTrue,
  isAnyTrue,
  notEmptyOrNil,
} from 'utils/helpers';
import { buildUserProfilePath } from 'utils/artwork/artwork';

import { parseDateToUnix } from 'utils/dates/dates';
import { isNonUserRejectedError } from 'utils/transactions';
import { areKeysEqual } from 'utils/users';

import { ModalKey } from 'types/modal';

import useModal from 'hooks/use-modal';
import usePrivateSaleByIpfs from 'hooks/queries/hasura/use-private-sale-by-ipfs';
import {
  PrivateSaleByIpfsVariables,
  PrivateSaleByIpfs,
  PrivateSaleByIpfsDocument,
} from 'graphql/hasura/queries/private-sale-by-ipfs.generated';
import { PrivateSaleFragment } from 'graphql/hasura/hasura-fragments.generated';
import useWalletSession from 'hooks/web3/wallet/use-wallet-session';
import useArtworkByContractTokenId from 'hooks/queries/hasura/artworks/use-artwork-by-contract-token-id';
import useBuyPrivateSale, {
  BuyPrivateSaleVariables,
} from 'hooks/web3/transactions/use-buy-private-sale';
import { useSecurePrivateSaleByIpfs } from 'graphql/server/queries/private-sale-by-ipfs.generated';

import { fndHasuraClient } from 'lib/clients/graphql';

import { PageType } from 'types/page';

const BodyText = styled(Text, { fontFamily: '$body', lineHeight: 1.8 });

SalePage.getLayout = TransactionLayoutV2({
  title: 'Private Sale',
  backgroundColor: '$black5',
  pageType: PageType.minimalLoggedIn,
});

export default function SalePage(props: PrivateSaleData): JSX.Element {
  const { privateSale } = props;

  const router = useRouter();

  const { data: user } = useWalletSession();

  const { setCurrentModal } = useModal();

  const ipfsHash = getFirstValue(router.query.ipfsHash);
  const hideWelcomeModal = getFirstValue(router.query['hide-welcome']);

  const { data: privateSaleData, isLoading: isPrivateSaleDataLoading } =
    usePrivateSaleByIpfs(
      { ipfsHash },
      { initialData: { privateSale: [privateSale] } }
    );

  const {
    data: securePrivateSaleByIpfsData,
    isLoading: securePrivateSaleByIpfsLoading,
  } = useSecurePrivateSaleByIpfs(
    { ipfsHash },
    { enabled: isAllTrue([user?.token, ipfsHash]) }
  );

  const securePrivateSale = securePrivateSaleByIpfsData?.privateSale;
  const personalMessage = securePrivateSale?.personalMessage;
  const salePrice = Number(privateSaleData?.price);

  const tokenId = privateSaleData?.artwork?.tokenId;
  const contractAddress = privateSaleData?.artwork?.contractAddress;
  const contractSlug = privateSaleData?.artwork?.collection?.slug;

  const { data: artworkData, isLoading: isArtworkLoading } =
    useArtworkByContractTokenId({
      tokenId,
      contractSlug: contractSlug,
    });

  const isLoading = isAnyTrue([
    !artworkData,
    !privateSaleData,
    isArtworkLoading,
    isPrivateSaleDataLoading,
    securePrivateSaleByIpfsLoading,
  ]);

  const isBuyerCurrentUser = areKeysEqual([
    privateSaleData?.buyer?.publicKey,
    user?.publicAddress,
  ]);

  const isSellerCurrentUser = areKeysEqual([
    privateSaleData?.seller?.publicKey,
    user?.publicAddress,
  ]);

  useEffect(() => {
    if (!isLoading && isBuyerCurrentUser && !hideWelcomeModal) {
      setCurrentModal(ModalKey.PRIVATE_SALE);
    }
  }, [isLoading, isBuyerCurrentUser, hideWelcomeModal, setCurrentModal]);

  const {
    mutateAsync: buyPrivateSale,
    isLoading: buyPrivateSaleIsLoading,
    error: buyPrivateSaleError,
    reset: resetBuyPrivateSale,
  } = useBuyPrivateSale({
    onError: (err) => {
      if (err.message === 'No Provider Error') {
        setCurrentModal(ModalKey.AUTH_MAIN);
      }
    },
  });

  const submitPrivateSale = useCallback(
    async (values: BuyPrivateSaleVariables) => {
      try {
        const res = await buyPrivateSale(values);
        await router.push({
          pathname: `/sale/${ipfsHash}/submitted`,
          query: {
            txHash: res.hash,
            // so the page layout can detect the artwork id
            slug: `nft-${tokenId}`,
          },
        });
      } catch (err) {
        console.log(err);
      }
    },
    [buyPrivateSale, router, tokenId, ipfsHash]
  );

  const { isSubmitting, handleSubmit } = useFormik<BuyPrivateSaleVariables>({
    initialValues: {
      tokenId,
      contractAddress,
      deadline: parseDateToUnix(privateSaleData?.deadlineAt),
      buyerAddress: privateSaleData?.buyer?.publicKey,
      signature: securePrivateSale?.signature,
      price: salePrice,
    },
    enableReinitialize: true,
    onSubmit: submitPrivateSale,
  });

  if (isLoading) {
    return (
      <>
        {/* included for the SEO render with OG tags */}
        <PrivateSalePageMeta artwork={privateSale?.artwork} />
        <LoadingPage />
      </>
    );
  }

  if (!user) {
    return <WalletAuthBlock />;
  }

  const isUnauthorized = isAllTrue([!isBuyerCurrentUser, !isSellerCurrentUser]);

  if (isUnauthorized) {
    return <PrivateSaleWarningUnauthorized />;
  }

  const isExpired = isAfter(
    Date.now(),
    new Date(`${privateSaleData?.deadlineAt}Z`)
  );
  const isInvalid = isAnyTrue([isExpired, privateSaleData?.soldAt]);

  if (isInvalid) {
    return <PrivateSaleWarningInvalid />;
  }

  const error = buyPrivateSaleError;

  if (error && isNonUserRejectedError(error)) {
    return (
      <TransactionContainerV2 artwork={artworkData}>
        <TransactionError
          error={error}
          resetTransaction={resetBuyPrivateSale}
        />
      </TransactionContainerV2>
    );
  }

  const isTxLoading = isSubmitting || buyPrivateSaleIsLoading;

  if (isTxLoading) {
    return <TransactionConfirm artwork={artworkData} />;
  }

  const hasPersonalMessage = notEmptyOrNil(personalMessage);

  return (
    <>
      <PrivateSalePageMeta artwork={privateSale?.artwork} />
      <PrivateSaleWelcomeModal
        seller={privateSaleData?.seller}
        buyer={privateSaleData?.buyer}
      />
      <TransactionFormContainer>
        <TransactionSplitPane
          css={{
            display: 'block',
            '@bp1': {
              display: 'grid',
              gridTemplateColumns: '340px 600px',
            },
          }}
        >
          <Box css={{ display: 'none', '@bp1': { display: 'block' } }}>
            <ArtworkCard
              artwork={artworkData}
              creator={artworkData?.creator}
              currentUser={null}
            />
          </Box>
          <TransactionPane css={{ display: 'block', paddingY: '$8' }}>
            <>
              <TransactionSection css={{ marginBottom: '$8' }}>
                <TransactionHeading css={{ marginBottom: '$6' }}>
                  Complete the private sale
                </TransactionHeading>
                <BodyText css={{ marginBottom: '$4', maxWidth: 360 }}>
                  Once you confirm the transaction, funds will be sent to the
                  creator and the NFT will be added to your collection.
                </BodyText>

                <TransactionIPFSLink ipfsHash={ipfsHash} />
              </TransactionSection>

              <TransactionSection
                css={{
                  marginBottom: '$8',
                  display: 'grid',
                  gap: '$6',
                  '@bp0': {
                    gap: 0,
                    display: 'flex',
                  },
                }}
              >
                <Box
                  css={{
                    '@bp0': {
                      borderRight: '1px solid $black5',
                      paddingRight: '$7',
                    },
                  }}
                >
                  <FieldHeading>Sold by</FieldHeading>
                  <Flex css={{ alignItems: 'center' }}>
                    <FollowPopover
                      publicKey={privateSaleData?.seller?.publicKey}
                    >
                      <Link
                        href={buildUserProfilePath({
                          user: privateSaleData?.seller,
                        })}
                      >
                        <a
                          style={{ textDecoration: 'none' }}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <UserTagV2
                            user={privateSaleData?.seller}
                            isLoading={isPrivateSaleDataLoading}
                            hoverable
                          />
                        </a>
                      </Link>
                    </FollowPopover>
                  </Flex>
                </Box>
                <Box css={{ '@bp0': { paddingLeft: '$7' } }}>
                  <FieldHeading>
                    {isExpired ? 'Expired on' : 'Expires in'}
                  </FieldHeading>
                  <PrivateSaleCountdown
                    timestamp={privateSaleData?.deadlineAt}
                  />
                </Box>
              </TransactionSection>

              {hasPersonalMessage && (
                <TransactionSection css={{ marginBottom: '$9' }}>
                  <FieldHeading>Message</FieldHeading>
                  <Box
                    css={{
                      fontFamily: '$body',
                      fontSize: '$1',
                      background: '$black5',
                      borderRadius: '$3',
                      whiteSpace: 'pre-wrap',
                      paddingX: '$5',
                      paddingY: '$4',
                    }}
                  >
                    {personalMessage}
                  </Box>
                </TransactionSection>
              )}

              <TransactionSection>
                <FieldHeading css={{ marginBottom: '$2' }}>Price</FieldHeading>

                <Text
                  css={{ fontFamily: '$body', fontWeight: 600, fontSize: '$4' }}
                >
                  {salePrice} ETH
                </Text>
              </TransactionSection>

              <TransactionSection css={{ paddingTop: '$8' }}>
                {isSellerCurrentUser ? (
                  <DisabledButton>
                    You’re the owner of this artwork
                  </DisabledButton>
                ) : (
                  <Button
                    shape="regular"
                    color="black"
                    size="large"
                    css={{ width: '100%' }}
                    hoverable
                    onClick={() => handleSubmit()}
                  >
                    Complete Private Sale
                  </Button>
                )}
              </TransactionSection>
            </>
          </TransactionPane>
        </TransactionSplitPane>
      </TransactionFormContainer>
    </>
  );
}

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

interface PrivateSaleData {
  privateSale: PrivateSaleFragment;
}

type PageProps = GetStaticPropsContext<{ ipfsHash: string }>;
type PageData = GetStaticPropsResult<PrivateSaleData>;

export const getStaticProps = async ({
  params,
}: PageProps): Promise<PageData> => {
  const { ipfsHash } = params;

  const client = fndHasuraClient();
  const query = await client.request<
    PrivateSaleByIpfs,
    PrivateSaleByIpfsVariables
  >(PrivateSaleByIpfsDocument, { ipfsHash });

  return {
    props: {
      privateSale: head(query.privateSale),
    },
    // 1 hour
    revalidate: 3600,
  };
};
