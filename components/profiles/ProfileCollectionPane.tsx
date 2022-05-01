import { ClientError } from 'graphql-request';
import { useState } from 'react';
import {
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  useQueryClient,
} from 'react-query';

import { useSetArtworkUserVisibility } from 'graphql/server/mutations/set-artwork-user-visibility.generated';

import Grid from 'components/base/Grid';
import Flex from 'components/base/Flex';
import LoadingPage from 'components/LoadingPage';
import InfiniteScrollButton from 'components/feed/InfiniteScrollButton';
import ArtworkCard from 'components/cards/artwork/ArtworkCard';
import ExpandCollectionButton from './ExpandCollectionButton';
import ProfileCardGrid from './ProfileCardGrid';

import { ArtworkV2 } from 'types/Artwork';
import WalletUser from 'types/WalletUser';
import useInfiniteData from 'hooks/use-infinite-data';

type QueryHookOptions = UseInfiniteQueryOptions<
  ArtworkV2[],
  ClientError,
  ArtworkV2[]
>;

export interface ProfileCollectionPaneProps<T> {
  collectionQueryHook: (
    variables: T,
    options?: QueryHookOptions
  ) => UseInfiniteQueryResult<ArtworkV2[], ClientError>;
  variables: T;
  options?: QueryHookOptions;
  isCurrentUserProfile: boolean;
  currentUser: WalletUser;
  isCurrentUserLoading: boolean;
  publicKey: string;
}

type DefaultRecord = Record<string, unknown>;

export default function ProfileCollectionPane<T extends DefaultRecord>(
  props: ProfileCollectionPaneProps<T>
): JSX.Element {
  const {
    collectionQueryHook,
    variables,
    isCurrentUserProfile,
    currentUser,
    options,
  } = props;

  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isFetching,
    hasNextPage,
    fetchNextPage,
    refetch: refetchCollection,
  } = collectionQueryHook(variables, {
    ...options,
    refetchOnWindowFocus: false,
  });

  const setArtworkUserVisibility = useSetArtworkUserVisibility({
    onSuccess: () => {
      refetchCollection();
      queryClient.invalidateQueries('UserArtworksCounts');
    },
  });

  // const isExpanded = false;

  const flattenedResults = useInfiniteData(data, 'id');

  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const expandCollection = () => {
    setIsExpanded(true);
  };

  const hasExpandableCollection = flattenedResults.length > 3;

  if (isLoading) {
    return (
      <Flex css={{ paddingTop: '$8' }}>
        <LoadingPage />
      </Flex>
    );
  }

  return (
    <>
      <Grid css={{ gap: '$4', '@bp1': { gap: '$6' } }}>
        <ProfileCardGrid isExpanded={isExpanded}>
          {flattenedResults.map((artwork) => (
            <ArtworkCard
              key={`${artwork.tokenId}-${artwork.contractAddress}`}
              artwork={artwork}
              creator={artwork.creator}
              isCurrentUserProfile={isCurrentUserProfile}
              setArtworkUserVisibility={setArtworkUserVisibility}
              currentUser={currentUser}
            />
          ))}
        </ProfileCardGrid>
        {hasExpandableCollection && !isExpanded && (
          <ExpandCollectionButton
            color="white"
            shape="round"
            size="regular"
            onClick={expandCollection}
          >
            View all
          </ExpandCollectionButton>
        )}
      </Grid>
      <InfiniteScrollButton
        handleNextPage={fetchNextPage}
        isFetching={isFetching}
        hasNextPage={hasNextPage}
      />
    </>
  );
}
