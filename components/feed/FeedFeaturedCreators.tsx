import { useQueryClient } from 'react-query';

import useCreatorsFeed from 'hooks/queries/hasura/use-creators-feed';

import CreatorResults from './CreatorResults';

import { AccountFeed } from 'types/Account';
import { QueryCacheKey } from 'types/Queries';
import { getCreators } from 'utils/users';

interface FeedFeaturedCreatorsProps {
  publicAddress: string;
  creatorIds: string[];
  enableHeader?: boolean;
  hideBiosOnMobile?: boolean;
}

export default function FeedFeaturedCreators(
  props: FeedFeaturedCreatorsProps
): JSX.Element {
  const {
    publicAddress,
    creatorIds,
    enableHeader = true,
    hideBiosOnMobile = false,
  } = props;

  const queryClient = useQueryClient();

  const onFollowUpdate = () => {
    queryClient.invalidateQueries(QueryCacheKey.FeedFeaturedCreators);
    queryClient.invalidateQueries(QueryCacheKey.UserFollowCounts);
    queryClient.invalidateQueries(QueryCacheKey.FollowsByUserPublicKeys);
  };

  const {
    data: creatorsData,
    isLoading: creatorsLoading,
    fetchNextPage,
    isFetching,
  } = useCreatorsFeed({
    publicKey: publicAddress,
    userIds: creatorIds,
  });

  const creators: AccountFeed[] = getCreators(creatorsData?.pages ?? []);

  return (
    <CreatorResults
      publicAddress={publicAddress}
      isFetching={isFetching}
      isLoading={creatorsLoading}
      creators={creators}
      handleNextPage={fetchNextPage}
      enableHeader={enableHeader}
      onFollowUpdate={onFollowUpdate}
      noMoreResults={true}
      hideBiosOnMobile={hideBiosOnMobile}
    />
  );
}
