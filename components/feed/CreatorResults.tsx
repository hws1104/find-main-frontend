import Box from 'components/base/Box';

import CreatorCard from 'components/cards/creator/CreatorCard';
import CardGrid from 'components/CardGrid';
import FeaturedSectionHeading from 'components/FeaturedSectionHeading';
import CreatorSkeletonArray from './CreatorSkeletonArray';
import InfiniteScrollButton from './InfiniteScrollButton';

import { AccountFeed } from 'types/Account';

interface CreatorResultsProps {
  creators: AccountFeed[];
  handleNextPage: () => void;
  noMoreResults: boolean;
  isLoading: boolean;
  enableHeader: boolean;
  onFollowUpdate: () => void;
  isFetching: boolean;
  publicAddress: string;
  hideBiosOnMobile?: boolean;
}

export default function CreatorResults(
  props: CreatorResultsProps
): JSX.Element {
  const {
    creators,
    handleNextPage,
    noMoreResults,
    isLoading,
    enableHeader,
    isFetching,
    hideBiosOnMobile,
  } = props;

  if (isLoading) {
    return (
      <Box>
        {enableHeader && (
          <FeaturedSectionHeading
            link={{ href: '/profiles', text: 'View all creators' }}
          >
            Featured creators
          </FeaturedSectionHeading>
        )}

        <CardGrid>
          <CreatorSkeletonArray />
        </CardGrid>
      </Box>
    );
  }

  return (
    <Box>
      {enableHeader && (
        <FeaturedSectionHeading
          link={{ href: '/profiles', text: 'View all creators' }}
        >
          Featured creators
        </FeaturedSectionHeading>
      )}

      <CardGrid>
        {creators.map((creator) => {
          return (
            <CreatorCard
              creator={creator}
              key={creator.publicKey}
              hideBiosOnMobile={hideBiosOnMobile}
            />
          );
        })}
      </CardGrid>

      <InfiniteScrollButton
        handleNextPage={handleNextPage}
        isFetching={isFetching}
        hasNextPage={!noMoreResults}
      />
    </Box>
  );
}
