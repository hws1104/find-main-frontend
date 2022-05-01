/* eslint-disable max-lines */
/* eslint-disable react/jsx-max-depth */
import { useEffect } from 'react';
import { GetStaticPropsResult } from 'next';
import { useRouter } from 'next/router';
import { is } from 'ramda';

import Page from 'components/Page';
import Body from 'components/base/Body';
import Box from 'components/base/Box';
import Heading from 'components/base/Heading';
import FeedFeaturedCreators from 'components/feed/FeedFeaturedCreators';
import FeedArtworks from 'components/feed/FeedArtworks';
import FeedFollowCounter from 'components/feed/FeedFollowCounter';
import LoadingPage from 'components/LoadingPage';
import { WithLayout } from 'components/layouts/Layout';

import { sortCreatorsByUsernames } from 'utils/creator';
import { maybeGetAddress } from 'utils/users';
import getChainId from 'lib/chainId';

import { getFeaturedContentIds } from 'queries/server/content';
import { getHasuraUsersByUsernames } from 'queries/hasura/users';

import useWalletSession from 'hooks/web3/wallet/use-wallet-session';
import useFollowCounts from 'hooks/queries/hasura/use-follow-counts';

import Account from 'types/Account';
import { MIN_FOLLOWS_COUNT } from 'lib/constants';

interface FeedPageProps {
  featuredCreators: Account[];
  featuredCreatorUsernames: string[];
}

export default function Feed(props: FeedPageProps): JSX.Element {
  const { featuredCreators } = props;

  const { data: user } = useWalletSession();

  const router = useRouter();

  const publicAddress = user?.publicAddress;

  const { data: followCountData, isLoading: followCountLoading } =
    useFollowCounts({
      publicKey: publicAddress,
    });

  const followingCount = followCountData?.followingCount?.aggregate?.count;

  const creatorIds = featuredCreators.map((creator) =>
    maybeGetAddress(creator.publicKey)
  );

  const isLoading = !followCountData || followCountLoading;

  const isNumber = is(Number);

  const needsMoreFollows = Boolean(
    isNumber(followingCount) && followingCount < MIN_FOLLOWS_COUNT
  );

  useEffect(
    () => {
      if (needsMoreFollows) {
        router.push('/feed?follow=true', '/feed?follow=true', {
          shallow: true,
          scroll: false,
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [needsMoreFollows]
  );

  const inFollowMode = Boolean(router.query.follow);

  return (
    <Page
      title="Feed"
      footerStyle={{ display: inFollowMode ? 'none' : 'block' }}
    >
      <RenderFeed
        creatorIds={creatorIds}
        followingCount={followingCount}
        publicAddress={publicAddress}
        isLoading={isLoading}
        inFollowMode={inFollowMode}
      />
    </Page>
  );
}

interface RenderFeedProps {
  isLoading: boolean;
  followingCount: number;
  creatorIds: string[];
  publicAddress: string;
  inFollowMode: boolean;
}

function RenderFeed(props: RenderFeedProps): JSX.Element {
  const { isLoading, followingCount, creatorIds, publicAddress, inFollowMode } =
    props;

  if (isLoading) {
    return <LoadingPage />;
  }

  if (inFollowMode) {
    return (
      <>
        <Body
          css={{
            flex: 1,
            flexDirection: 'column',
            paddingTop: '$9',
            display: isLoading ? 'none' : 'flex',
            '@bp1': {
              paddingTop: '$10',
            },
            '@bp2': {
              paddingTop: '$11',
            },
          }}
        >
          <Box
            css={{
              paddingBottom: '$9',
              '@bp1': {
                paddingBottom: '$10',
              },
              '@bp2': {
                paddingBottom: '$11',
              },
            }}
          >
            <Heading
              size="4"
              css={{ maxWidth: 460, marginX: 'auto', textAlign: 'center' }}
            >
              Follow at least five creators to build your feed…
            </Heading>
          </Box>
          <FeedFeaturedCreators
            creatorIds={creatorIds}
            publicAddress={publicAddress}
          />
        </Body>
        <FeedFollowCounter followingCount={followingCount} />
      </>
    );
  }

  return (
    <Body css={{ display: 'flex', flexDirection: 'column' }}>
      <FeedArtworks publicAddress={publicAddress} />
    </Body>
  );
}

export async function getStaticProps(): Promise<
  GetStaticPropsResult<FeedPageProps>
> {
  const chainId = getChainId();

  const { featuredCreatorUsernames } = await getFeaturedContentIds({
    preview: false,
    chainId,
  });

  const { users } = await getHasuraUsersByUsernames(featuredCreatorUsernames);

  const sortedCreators = sortCreatorsByUsernames(
    featuredCreatorUsernames,
    users
  );

  return {
    props: {
      featuredCreators: sortedCreators,
      featuredCreatorUsernames,
    },
    revalidate: 60,
  };
}

Feed.getLayout = WithLayout({ backgroundColor: '$black5' });
