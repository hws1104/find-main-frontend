/* eslint-disable max-lines */
/* eslint-disable react/jsx-max-depth */
import { GetStaticPropsResult } from 'next';

import Page from 'components/Page';
import Body from 'components/base/Body';
import FeaturedArtworks from 'components/artworks/FeaturedArtworks';
import FeaturedArticles from 'components/blog/FeaturedArticles';
import FeaturedArtwork from 'components/artworks/featured-artwork/FeaturedArtwork';
import TrendingAuctions from 'components/artworks/TrendingAuctions';
import PreviewMode from 'components/PreviewMode';
import FeaturedCreatorsHome from 'components/creators/FeaturedCreatorsHome';
import FeaturedCollections from 'components/collections/FeaturedCollections';

import { PageType } from 'types/page';
import {
  ArtworkFragmentExtended,
  UserFragment,
  CollectionFragmentExtended,
} from 'graphql/hasura/hasura-fragments.generated';

import { getAllArticles } from 'queries/server/articles';
import { getFeaturedContentIds } from 'queries/server/content';
import {
  getArtworkByContractTokenId,
  getArtworksByContractTokenIds,
} from 'queries/hasura/artworks-v2';
import { getUsersByUsernames } from 'queries/hasura/users-v2';
import { getCollectionsBySlugs } from 'queries/hasura/collections';

import useWalletSession from 'hooks/web3/wallet/use-wallet-session';

import getChainId from 'lib/chainId';

import { getFeaturedArticles } from 'utils/helpers';
import { sortCreatorsByUsernames } from 'utils/creator';
import {
  groupArtworkUrlsByCollection,
  parseArtworkUrl,
  sortFeaturedArtworks,
} from 'utils/urls';

interface IndexPageProps {
  preview: boolean;
  articles: any[];
  featuredCreators: UserFragment[];
  featuredArtwork: ArtworkFragmentExtended;
  featuredArtworks: ArtworkFragmentExtended[];
  collections: CollectionFragmentExtended[];
}

export default function IndexPage(props: IndexPageProps): JSX.Element {
  const {
    preview,
    articles,
    featuredCreators,
    featuredArtworks,
    featuredArtwork,
    collections,
  } = props;

  const { data: user } = useWalletSession();

  const publicAddress = user?.publicAddress;

  return (
    <Page title={false} type={PageType.maximal}>
      {preview && <PreviewMode />}

      {featuredArtwork && (
        <Body>
          <FeaturedArtwork artwork={featuredArtwork} />
        </Body>
      )}

      <Body
        css={{
          display: 'grid',
          paddingY: '$9',
          gap: '$9',
          '@bp1': {
            gap: '$10',
          },
          '@bp2': {
            paddingY: '$10',
            gap: '$11',
          },
          '@bp3': {
            paddingBottom: '$11',
          },
          '@bp4': {
            gap: 160,
          },
        }}
      >
        <TrendingAuctions />
        <FeaturedCollections collections={collections} />
        <FeaturedArtworks
          featuredArtworks={featuredArtworks}
          publicAddress={publicAddress}
        />
        <FeaturedCreatorsHome creators={featuredCreators} />
        <FeaturedArticles articles={articles} />
      </Body>
    </Page>
  );
}

export async function getStaticProps({
  preview = false,
}: {
  preview: boolean;
}): Promise<GetStaticPropsResult<IndexPageProps>> {
  const chainId = getChainId();

  const {
    highlightedNFTId,
    highlightedNFTCollectionSlug,
    featuredNfTs,
    featuredCreatorUsernames,
    featuredCollections,
  } = await getFeaturedContentIds({ preview, chainId });

  const articles = await getAllArticles();

  const featuredArtwork = await getArtworkByContractTokenId({
    tokenId: Number(highlightedNFTId),
    contractSlug: highlightedNFTCollectionSlug,
  });

  const mappedArtworks = featuredNfTs.map(parseArtworkUrl);

  const groupedFeaturedArtworks = groupArtworkUrlsByCollection(featuredNfTs);

  const artworkPromises = groupedFeaturedArtworks.map(
    (groupedFeaturedArtwork) =>
      getArtworksByContractTokenIds({
        contractSlug: groupedFeaturedArtwork.collectionSlug,
        tokenIds: groupedFeaturedArtwork.tokenIds,
      })
  );

  const featuredArtworksQuery = await Promise.all(artworkPromises);
  const featuredArtworks = featuredArtworksQuery.flat();

  const featuredCreatorsQuery = await getUsersByUsernames({
    usernames: featuredCreatorUsernames,
  });

  const collectionSlugs = featuredCollections.map(
    (x) => x.split('collection/')[1]
  );

  const collections = await getCollectionsBySlugs({
    limit: 12,
    offset: 0,
    slugs: collectionSlugs,
  });

  const sortedCollections = collections.sort((a, b) => {
    return collectionSlugs.indexOf(a.slug) - collectionSlugs.indexOf(b.slug);
  });

  return {
    props: {
      preview,
      featuredArtwork: featuredArtwork || null,
      featuredArtworks: sortFeaturedArtworks(mappedArtworks, featuredArtworks),
      featuredCreators: sortCreatorsByUsernames(
        featuredCreatorUsernames,
        featuredCreatorsQuery
      ),
      articles: getFeaturedArticles(articles),
      collections: sortedCollections,
    },
    // refresh every 15 mins
    revalidate: 60 * 15,
  };
}
