import { ClientError } from 'graphql-request';
import { useState } from 'react';
import { UseInfiniteQueryOptions, UseInfiniteQueryResult } from 'react-query';

import Grid from 'components/base/Grid';
import Flex from 'components/base/Flex';
import LoadingPage from 'components/LoadingPage';
import InfiniteScrollButton from 'components/feed/InfiniteScrollButton';
import ExpandCollectionButton from './ExpandCollectionButton';
import ProfileCardGrid from './ProfileCardGrid';

import { CollectionFragmentExtended } from 'graphql/hasura/hasura-fragments.generated';
import WalletUser from 'types/WalletUser';
import CollectionCard from 'components/cards/collections/CollectionCard';
import useInfiniteData from 'hooks/use-infinite-data';

type Collection = CollectionFragmentExtended;

type QueryHookOptions = UseInfiniteQueryOptions<
  Collection[],
  ClientError,
  Collection[]
>;

export interface ProfileCollectionPaneProps<T> {
  collectionQueryHook: (
    variables: T,
    options?: QueryHookOptions
  ) => UseInfiniteQueryResult<Collection[], ClientError>;
  variables: T;
  options?: QueryHookOptions;
  isCurrentUserProfile: boolean;
  currentUser: WalletUser;
  isCurrentUserLoading: boolean;
  publicKey: string;
}

type DefaultRecord = Record<string, unknown>;

export default function ProfileCollectionsPane<T extends DefaultRecord>(
  props: ProfileCollectionPaneProps<T>
): JSX.Element {
  const { collectionQueryHook, variables, options } = props;

  const { data, isLoading, isFetching, hasNextPage, fetchNextPage } =
    collectionQueryHook(variables, {
      ...options,
      refetchOnWindowFocus: false,
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
          {flattenedResults.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              creator={collection.creator}
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
