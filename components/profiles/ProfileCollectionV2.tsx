/* eslint-disable max-lines */
import { useCallback } from 'react';
import { always, cond, equals, filter, find, path } from 'ramda';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

import ProfileCollectionsPane from './ProfileCollectionsPane';
import ProfileCollectionPane from './ProfileCollectionPane';
import ProfileCollectionTabLabel, {
  lastTabStyles,
} from './ProfileCollectionTabLabel';
import { TabsWithLinks, TabLink } from 'components/tabs/Tabs';

import useUserArtworksCreated from 'hooks/queries/hasura/use-user-artworks-created';
import useUserArtworksCollected from 'hooks/queries/hasura/use-user-artworks-collected';
import useUserArtworksSplits from 'hooks/queries/hasura/use-user-artworks-splits';
import useUserArtworksHidden from 'hooks/queries/hasura/use-user-artworks-hidden';
import useUserArtworksCounts from 'hooks/queries/hasura/use-user-artworks-counts';
import useUserCollections from 'hooks/queries/hasura/use-user-collections';
import useUserByPublicKey from 'hooks/queries/use-user-by-public-key';

import { areKeysEqual } from 'utils/users';
import { getFirstValue, isAllTrue, isEmptyOrNil } from 'utils/helpers';
import { maybeLowerCase } from 'utils/case';

import { getNFT721Address } from 'lib/addresses';

import { UserArtworksCreatedVariables } from 'graphql/hasura/queries/user-artworks-created.generated';
import { UserArtworksCollectedVariables } from 'graphql/hasura/queries/user-artworks-collected.generated';
import { UserArtworksSplitsVariables } from 'graphql/hasura/queries/user-artworks-splits.generated';
import { UserArtworksHiddenVariables } from 'graphql/hasura/queries/user-artworks-hidden.generated';
import { UserCollectionsVariables } from 'graphql/hasura/queries/user-collections.generated';

import WalletUser from 'types/WalletUser';
import { OmitPagination } from 'types/utils';
import { UserFragment } from 'graphql/hasura/hasura-fragments.generated';
import { UserByPublicKey } from 'graphql/hasura/queries/user-by-public-key.generated';
import { ProfileTab } from 'types/Tabs';

interface ProfileCollectionV2Props {
  publicKey: string;
  currentUserPublicKey: string;
  user: UserFragment;
  currentUser: WalletUser;
  isCurrentUserLoading: boolean;
  createdCount: number;
  collectionsCount: number;
  collectedCount: number;
}

interface TabVisibility extends TabLink {
  isVisible: boolean;
  count: number;
}

export default function ProfileCollectionV2(
  props: ProfileCollectionV2Props
): JSX.Element {
  const {
    publicKey,
    currentUserPublicKey,
    user,
    currentUser,
    isCurrentUserLoading,
    createdCount: createdCountInitial,
    collectionsCount: collectionsCountInitial,
    collectedCount: collectedCountInitial,
  } = props;

  const isCurrentUserProfile = areKeysEqual([publicKey, currentUserPublicKey]);

  const { data: currentUserData } = useUserByPublicKey({
    publicKey: currentUserPublicKey,
  });

  const { currentTab, visibleTabs, indexedStates } = useTabParams({
    publicKey,
    createdCountInitial,
    collectionsCountInitial,
    collectedCountInitial,
    isCurrentUserProfile,
    currentUserData,
  });

  const isEmptyCollection = isEmptyOrNil(visibleTabs);

  const sharedPaneProps = {
    variables: {
      publicKey,
      indexedStates,
    },
    isCurrentUserProfile,
    currentUser,
    isCurrentUserLoading,
    publicKey,
  };

  const createdPaneProps = {
    ...sharedPaneProps,
    variables: {
      publicKey,
      indexedStates,
      contractAddress: getNFT721Address(),
    },
  };

  const collectedPaneProps = {
    ...sharedPaneProps,
    variables: {
      publicKey,
      indexedStates,
    },
  };

  if (isEmptyCollection) {
    return null;
  }

  return (
    <>
      <TabsWithLinks<TabVisibility, string> tabs={visibleTabs} isScrollable />

      {cond<string, JSX.Element>([
        [
          equals(maybeLowerCase(ProfileTab.Created)),
          always(
            <ProfileCollectionPane<UserArtworksCreatedVariables>
              {...createdPaneProps}
              collectionQueryHook={useUserArtworksCreated}
            />
          ),
        ],
        [
          equals(maybeLowerCase(ProfileTab.Collected)),
          always(
            <ProfileCollectionPane<UserArtworksCollectedVariables>
              {...collectedPaneProps}
              collectionQueryHook={useUserArtworksCollected}
            />
          ),
        ],
        [
          equals(maybeLowerCase(ProfileTab.Collections)),
          always(
            <ProfileCollectionsPane<OmitPagination<UserCollectionsVariables>>
              {...sharedPaneProps}
              collectionQueryHook={useUserCollections}
            />
          ),
        ],
        [
          equals(maybeLowerCase(ProfileTab.Splits)),
          always(
            <ProfileCollectionPane<UserArtworksSplitsVariables>
              {...sharedPaneProps}
              collectionQueryHook={useUserArtworksSplits}
            />
          ),
        ],
        [
          equals(maybeLowerCase(ProfileTab.Hidden)),
          always(
            <ProfileCollectionPane<UserArtworksHiddenVariables>
              {...sharedPaneProps}
              collectionQueryHook={useUserArtworksHidden}
            />
          ),
        ],
      ])(currentTab)}
    </>
  );
}

interface TabParamsArgs {
  publicKey: string;
  collectionsCountInitial: number;
  createdCountInitial: number;
  collectedCountInitial: number;
  isCurrentUserProfile: boolean;
  currentUserData: UserByPublicKey;
}

function useTabParams({
  publicKey,
  collectionsCountInitial,
  createdCountInitial,
  collectedCountInitial,
  isCurrentUserProfile,
  currentUserData,
}: TabParamsArgs) {
  const router = useRouter();

  const currentUserIsAdmin = currentUserData?.user?.isAdmin;

  // if a user is viewing their own profile or an admin
  // is viewing it then query for non-indexed artworks too
  const indexedStates =
    currentUserIsAdmin || isCurrentUserProfile ? [true, false] : [true];

  const tabParam = getFirstValue(router.query.tab);

  const { data, isLoading: isCountsLoading } = useUserArtworksCounts(
    {
      publicKey,
      indexedStates,
      contractAddress: getNFT721Address(),
    },
    {
      refetchOnWindowFocus: false,
      initialData: {
        artworksCollections: { aggregate: { count: collectionsCountInitial } },
        artworksCreated: { aggregate: { count: createdCountInitial } },
        artworksCollected: { aggregate: { count: collectedCountInitial } },
        artworksCreatedHidden: { aggregate: { count: 0 } },
        artworksCollectedHidden: { aggregate: { count: 0 } },
        userSplits: {
          splitRecipients: [
            { artworks_aggregate: { aggregate: { count: 0 } } },
          ],
        },
        userSplitsHidden: {
          splitRecipients: [
            { artworks_aggregate: { aggregate: { count: 0 } } },
          ],
        },
        artworksHidden: { aggregate: { count: 0 } },
      },
    }
  );

  const collectionsCount = data?.artworksCollections;
  const createdCount = data?.artworksCreated;
  const collectedCount = data?.artworksCollected;
  const splitsCount = data?.artworksSplits;
  const hiddenCount = data?.artworksHidden;

  const buildTabRoute = (tab: string) => {
    return `/${router.query.username}?tab=${maybeLowerCase(tab)}`;
  };

  const isRouteActive = (tab: string) => {
    return router.query.tab === maybeLowerCase(tab);
  };

  const collectionTabs: TabVisibility[] = [
    {
      label: (
        <ProfileCollectionTabLabel
          label={ProfileTab.Collections}
          count={collectionsCount}
          showCount={!isCountsLoading}
        />
      ),
      value: maybeLowerCase(ProfileTab.Collections),
      isVisible: collectionsCount > 0,
      count: collectionsCount,
      href: buildTabRoute(ProfileTab.Collections),
      isActive: isRouteActive(ProfileTab.Collections),
    },
    {
      label: (
        <ProfileCollectionTabLabel
          label={ProfileTab.Created}
          count={createdCount}
          showCount={!isCountsLoading}
        />
      ),
      value: maybeLowerCase(ProfileTab.Created),
      isVisible: createdCount > 0,
      count: createdCount,
      href: buildTabRoute(ProfileTab.Created),
      isActive: isRouteActive(ProfileTab.Created),
    },
    {
      label: (
        <ProfileCollectionTabLabel
          label={ProfileTab.Collected}
          count={collectedCount}
          showCount={!isCountsLoading}
        />
      ),
      value: maybeLowerCase(ProfileTab.Collected),
      isVisible: collectedCount > 0,
      count: collectedCount,
      href: buildTabRoute(ProfileTab.Collected),
      isActive: isRouteActive(ProfileTab.Collected),
    },
    {
      label: (
        <ProfileCollectionTabLabel
          label={ProfileTab.Splits}
          count={splitsCount}
          showCount={!isCountsLoading}
        />
      ),
      value: maybeLowerCase(ProfileTab.Splits),
      isVisible: splitsCount > 0,
      count: splitsCount,
      href: buildTabRoute(ProfileTab.Splits),
      isActive: isRouteActive(ProfileTab.Splits),
    },
    {
      label: (
        <ProfileCollectionTabLabel
          label={ProfileTab.Hidden}
          count={0}
          isActive={isRouteActive(ProfileTab.Hidden)}
          showCount={false}
        />
      ),
      value: maybeLowerCase(ProfileTab.Hidden),
      className: lastTabStyles,
      isVisible: hiddenCount > 0 && isCurrentUserProfile,
      count: hiddenCount,
      href: buildTabRoute(ProfileTab.Hidden),
      isActive: isRouteActive(ProfileTab.Hidden),
    },
  ];

  const visibleTabs = filter(
    (tab: TabVisibility) => Boolean(tab.isVisible),
    collectionTabs
  );

  const currentTabItem = find(
    (tab: TabVisibility) => tab.value === tabParam,
    collectionTabs
  );

  const firstTabValue = path<string>([0, 'value'], visibleTabs);

  const formattedTabs = visibleTabs.map((tab, index) =>
    !tabParam && index === 0 ? { ...tab, isActive: true } : tab
  );

  const currentTabIsHidden = currentTabItem?.isVisible === false;

  const pushTabRoute = useCallback(
    (tab: string) =>
      router.push(`/${router.query.username}?tab=${tab}`, undefined, {
        shallow: true,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.isReady]
  );

  useEffect(
    () => {
      const canPushTab = isAllTrue([currentTabIsHidden, router.isReady]);
      if (canPushTab) {
        pushTabRoute(firstTabValue);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      publicKey,
      firstTabValue,
      currentTabIsHidden,
      collectionsCount,
      router.isReady,
    ]
  );

  return {
    currentTab: tabParam || firstTabValue,
    visibleTabs: formattedTabs,
    indexedStates,
  };
}
