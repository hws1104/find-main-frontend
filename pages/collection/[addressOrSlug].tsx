/* eslint-disable react/jsx-max-depth */
/* eslint-disable max-lines */
import {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import { useEffect, useState } from 'react';
import { cond } from 'ramda';
import { useRouter } from 'next/router';

import Page from 'components/Page';
import Body from 'components/base/Body';
import Flex from 'components/base/Flex';
import Text from 'components/base/Text';
import Box from 'components/base/Box';
import CollectionLogo from 'components/collections/CollectionLogo';
import CollectionMintButton from 'components/collections/CollectionMintButton';
import ContractPill from 'components/collections/ContractPill';
import CollectionHeroContainer from 'components/collections/CollectionHeroContainer';
import CollectionTitle from 'components/collections/CollectionTitle';
import InfiniteScrollButton, {
  ActivityIndicator,
} from 'components/feed/InfiniteScrollButton';
import EditCollectionModal from 'components/modals/EditCollectionModal';
import {
  CollectionFilter,
  CollectionFilters,
  CollectionSort,
  HandleSetFilterAndSortArgs,
} from 'components/collections/CollectionFilters';
import CollectionOwnersModal from 'components/modals/CollectionOwnersModal';
import CollectionNotAdded from 'components/collections/CollectionNotAdded';
import CollectionArtworks from 'components/collections/CollectionArtworks';
import CollectionAdminPopover from 'components/collections/CollectionAdminPopover';
import CollectionWarningBlock from 'components/trust-safety/CollectionWarningBlock';
import EditCollectionButton from 'components/collections/EditCollectionButton';
import UserTagV3 from 'components/users/UserTagV3';
import ReportModal from 'components/modals/ReportModal';
import AdminToolsModal from 'components/modals/AdminToolsModal';
import ModerationBanner from 'components/admin/ModerationBanner';
import MarkdownText from 'components/base/MarkdownText';
import CollectionSalesHistory from 'components/collections/CollectionSalesHistory';
import { Tab, TabsWithLabels } from 'components/tabs/Tabs';

import { buildEtherscanLink } from 'lib/etherscanAddresses';

import { PageColorMode } from 'types/page';
import { ModalKey } from 'types/modal';
import { ReportType } from 'types/Report';

import { CollectionFragmentExtended } from 'graphql/hasura/hasura-fragments.generated';
import { CollectionStats } from 'graphql/hasura/queries/collection-stats.generated';
import { useCollectionArtworkCounts } from 'graphql/hasura/queries/collection-artwork-counts.generated';

import useWalletSession from 'hooks/web3/wallet/use-wallet-session';
import useCollectionArtworksWithFilters from 'hooks/queries/hasura/use-collection-artworks';
import useCollectionByContractSlug from 'hooks/queries/hasura/collections/use-collection-by-contract-slug';
import useInfiniteData from 'hooks/use-infinite-data';
import useModal from 'hooks/use-modal';
import useUserByPublicKey from 'hooks/queries/use-user-by-public-key';

import {
  getCollectionByContractSlug,
  getCollectionStats,
} from 'queries/hasura/collections';

import {
  getUsernameOrAddress,
  isAnyTrue,
  isEmptyOrNil,
  notEmptyOrNil,
} from 'utils/helpers';
import { buildAvatarUrl, buildCoverImageUrl } from 'utils/assets';
import { areKeysEqual } from 'utils/users';
import { buildCollectionTweet } from 'utils/twitter-templates';
import { buildCollectionPath } from 'utils/collections';
import { isFlaggedForModeration } from 'utils/moderation';

enum TabEnum {
  Artworks = 'Artworks',
  Description = 'Description',
  Activity = 'Activity',
}
interface PageProps {
  collection: CollectionFragmentExtended;
  collectionStats: CollectionStats;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function CollectionPage(props: PageProps) {
  const { collection: initialCollectionData, collectionStats } = props;

  const { setCurrentModal } = useModal();

  const router = useRouter();

  const [currentTab, setCurrentTab] = useState<string>(TabEnum.Artworks);

  // change to artworks tab when navigating away
  useEffect(() => {
    setCurrentTab(TabEnum.Artworks);
  }, [router.asPath]);

  const [filter, setFilter] = useState<CollectionFilter>(CollectionFilter.All);
  const [sort, setSort] = useState<CollectionSort>(
    CollectionSort.DateMintedDesc
  );

  const contractSlug = initialCollectionData?.slug;

  const { data: collection } = useCollectionByContractSlug(
    { contractSlug: contractSlug },
    {
      refetchOnWindowFocus: false,
      initialData: { collections: [initialCollectionData] },
    }
  );

  const emptyState = isEmptyOrNil(collection?.coverImageUrl);
  const colorState = emptyState ? 'dark' : 'light';

  const { data: currentUser, isLoading: isUserLoading } = useWalletSession();

  const { data: userData } = useUserByPublicKey(
    { publicKey: currentUser?.publicAddress },
    { refetchOnWindowFocus: false }
  );

  const currentUserIsAdmin = userData?.user?.isAdmin;

  const {
    data: collectionArtworksData,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading: isCollectionLoading,
  } = useCollectionArtworksWithFilters(
    { contractSlug, filterKey: filter, sortKey: sort },
    { refetchOnWindowFocus: false, enabled: Boolean(contractSlug) }
  );

  const { data: artworkCounts, isLoading: isArtworkCountsLoading } =
    useCollectionArtworkCounts(
      { contractSlug },
      { refetchOnWindowFocus: false, enabled: Boolean(contractSlug) }
    );

  const isLoading = isAnyTrue([
    isUserLoading,
    isCollectionLoading,
    isArtworkCountsLoading,
  ]);

  const collectionArtworks = useInfiniteData(collectionArtworksData, 'id');

  const handleSetFilterAndSort = (args: HandleSetFilterAndSortArgs) => {
    const { filter, sort } = args;
    setFilter(filter);
    setSort(sort);
  };

  const coverImageUrl = buildCoverImageUrl(collection?.coverImageUrl);

  const hasArtworks = notEmptyOrNil(collectionArtworks);

  if (!collection) {
    return <CollectionNotAdded />;
  }

  const isOwnerOnCollection = areKeysEqual([
    collection?.creatorAddress,
    currentUser?.publicAddress,
  ]);

  const artworksTotalCount =
    artworkCounts?.artworksTotalCount?.aggregate?.count;
  const availableCount = artworkCounts?.availableCount?.aggregate?.count;
  const soldCount = artworkCounts?.soldCount?.aggregate?.count;

  const unstyledCollection =
    !collection.coverImageUrl ||
    !collection.collectionImageUrl ||
    !collection.name;

  const tabs = [
    {
      label: <Text>Artworks</Text>,
      value: TabEnum.Artworks,
      enabled: true,
    },
    {
      label: <Text>Description</Text>,
      value: TabEnum.Description,
      enabled: collection.description,
    },
    {
      label: <Text>Activity</Text>,
      value: TabEnum.Activity,
      enabled: true,
    },
  ];

  const visibleTabs = tabs.filter((tab) => tab.enabled);

  const emptyCollection = artworksTotalCount === 0;

  const collectionTweetText = buildCollectionTweet({
    creatorName: getUsernameOrAddress(collection.creator),
    collectionPath: buildCollectionPath(collection),
  });

  const collectionModerationStatus = collection?.moderationStatus;
  const isCollectionModerated = isFlaggedForModeration(
    collectionModerationStatus
  );

  const isMyCollection = areKeysEqual([
    currentUser?.publicAddress,
    collection?.creatorAddress,
  ]);

  if (isCollectionModerated && !currentUserIsAdmin) {
    return <CollectionWarningBlock collection={collection} />;
  }

  const reviewText = isMyCollection
    ? 'Your collection is under review.'
    : 'This collection is under review.';

  const suspendedText = isMyCollection
    ? 'Your collection has been removed.'
    : 'This collection has been removed.';

  return (
    <>
      {isCollectionModerated && (currentUserIsAdmin || isMyCollection) && (
        <ModerationBanner
          status={collectionModerationStatus}
          reviewText={reviewText}
          suspendedText={suspendedText}
          takedownText=""
        />
      )}
      {currentUserIsAdmin && (
        <AdminToolsModal
          publicKey={currentUser?.publicAddress}
          entityId={collection.id}
          context="collection"
          moderationStatus={collectionModerationStatus}
          moderationFrom=""
        />
      )}
      {/* TODO: do we put this at the top scope or is better
        coupled with the component that triggers it? */}
      <CollectionOwnersModal contractSlug={collection.slug} />
      <EditCollectionModal contractAddress={collection.contractAddress} />
      <ReportModal
        publicAddress={currentUser?.publicAddress}
        authToken={currentUser?.token}
        id={collection.contractAddress}
        type={ReportType.Collection}
      />
      <Page
        headerMode={collection.coverImageUrl && PageColorMode.dark}
        image={coverImageUrl}
        title={collection.name}
        description={collection.description}
        absolute
      >
        <CollectionHeroContainer
          contractSlug={contractSlug}
          coverImage={coverImageUrl}
          collectionStats={collectionStats}
          collectionTweet={collectionTweetText}
          currentUser={userData?.user}
        >
          <Flex
            css={{
              justifyContent: 'space-between',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              paddingY: '$10',
              '@bp2': {
                paddingY: 0,
                flexDirection: 'row',
                alignItems: 'flex-end',
                textAlign: 'left',
              },
            }}
          >
            <Flex
              css={{
                flexDirection: 'column',
                alignItems: 'center',
                '@bp2': { alignItems: 'flex-start' },
              }}
            >
              {collection.collectionImageUrl && (
                <CollectionLogo
                  imageUrl={buildAvatarUrl(160, collection.collectionImageUrl)}
                  alt={collection.name}
                  appearance="frosted"
                  stroke={{ '@initial': 2, '@bp1': 3 }}
                  shape={2}
                />
              )}
              <Box
                css={{
                  marginTop: '$6',
                  marginBottom: '$7',
                  '@bp2': {
                    marginTop: '$8',
                    marginBottom: '$7',
                  },
                }}
              >
                <ContractPill
                  hasIcon={true}
                  frosted={!emptyState}
                  contract={collection.symbol}
                  href={buildEtherscanLink(
                    `/address/${collection.contractAddress}`
                  )}
                />
              </Box>
              <CollectionTitle
                color={colorState}
                css={{ marginBottom: '$7' }}
                size={{ '@bpxs': 4, '@initial': 5, '@bp2': 8 }}
              >
                {collection.name}
              </CollectionTitle>
              <Flex>
                {collection.creator && (
                  <Box css={{ marginRight: '$4' }}>
                    <UserTagV3
                      appearance={colorState === 'dark' ? 'normal' : 'frosted'}
                      user={collection.creator}
                    />
                  </Box>
                )}
                {isOwnerOnCollection && (
                  <EditCollectionButton
                    color={colorState === 'dark' ? 'white' : 'black'}
                    openModal={() => setCurrentModal(ModalKey.EDIT_COLLECTION)}
                  >
                    Edit Collection
                  </EditCollectionButton>
                )}
              </Flex>
            </Flex>
          </Flex>
        </CollectionHeroContainer>
        <Body
          css={{
            paddingTop: '$11',
          }}
        >
          {isOwnerOnCollection && (
            <CollectionMintButton collection={collection} />
          )}

          <Flex
            css={{
              justifyContent: 'flex-end',
              marginBottom: '$3',
              display: 'flex',
              '@bp1': {
                display: 'none',
              },
            }}
          >
            <CollectionAdminPopover
              currentUserIsAdmin={userData?.user?.isAdmin}
            />
          </Flex>

          <TabsWithLabels<Tab, string>
            tabs={visibleTabs}
            setCurrentView={setCurrentTab}
            currentView={currentTab}
          />

          {cond([
            [
              (tab) => tab === TabEnum.Artworks,
              () => (
                <>
                  {!emptyCollection && (
                    <CollectionFilters
                      onChange={handleSetFilterAndSort}
                      defaultFilter={filter}
                      defaultSort={sort}
                      artworksTotalCount={artworksTotalCount}
                      availableCount={availableCount}
                      soldCount={soldCount}
                    />
                  )}

                  <CollectionArtworks
                    isLoading={isLoading}
                    emptyCollection={emptyCollection}
                    hasArtworks={hasArtworks}
                    collectionArtworks={collectionArtworks}
                    currentUser={currentUser}
                    isOwnerOnCollection={isOwnerOnCollection}
                    unstyledCollection={unstyledCollection}
                    setCurrentModal={setCurrentModal}
                    contractAddress={collection.contractAddress}
                  />
                </>
              ),
            ],
            [
              (tab) => tab === TabEnum.Description,
              () => (
                <Box
                  css={{
                    maxWidth: 640,
                    minHeight: 400,
                    paddingY: '$1',
                    '@bp1': { paddingY: '$8', minHeight: 600 },
                  }}
                >
                  <MarkdownText
                    css={{
                      lineHeight: 1.5,
                      fontSize: '$2',
                      '@bp0': {
                        fontSize: '$3',
                      },
                    }}
                  >
                    {collection.description}
                  </MarkdownText>
                </Box>
              ),
            ],
            [
              (tab) => tab === TabEnum.Activity,
              () => (
                <CollectionSalesHistory
                  contractAddress={initialCollectionData?.contractAddress}
                />
              ),
            ],
          ])(currentTab)}

          <ActivityIndicator isActive={isFetching} />
          <InfiniteScrollButton
            handleNextPage={fetchNextPage}
            isFetching={isFetching}
            hasNextPage={hasNextPage}
          />
        </Body>
      </Page>
    </>
  );
}

type PageParams = {
  addressOrSlug: string;
};

export async function getStaticPaths(): Promise<
  GetStaticPathsResult<PageParams>
> {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export async function getStaticProps({
  params,
}: GetStaticPropsContext<PageParams>): Promise<
  GetStaticPropsResult<PageProps>
> {
  const [collection, collectionStats] = await Promise.all([
    getCollectionByContractSlug({
      contractSlug: params.addressOrSlug,
    }),
    getCollectionStats({ contractSlug: params.addressOrSlug }),
  ]);

  return {
    props: {
      collection: collection ?? null,
      collectionStats: collectionStats ?? null,
    },
    // 1 hour
    revalidate: 3600,
  };
}
