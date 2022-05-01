import {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';

import Flex from 'components/base/Flex';
import Page from 'components/Page';
import ArtworkPage from 'components/artworks/ArtworkPage';
import ProfileWarningBlock from 'components/trust-safety/ProfileWarningBlock';
import ArtworkWarningPageBlock from 'components/trust-safety/ArtworkWarningPageBlock';

import useWalletSession from 'hooks/web3/wallet/use-wallet-session';
import useUserByPublicKey from 'hooks/queries/use-user-by-public-key';
import useAddUsernamePrefix from 'hooks/use-add-username-prefix';
import { useArtworkByUuid } from 'graphql/hasura/queries/artwork-by-uuid.generated';

import { buildPageShareUrl, buildPosterUrl } from 'utils/assets';
import { truncateMetaDescription } from 'utils/helpers';
import { isFlaggedForModeration } from 'utils/moderation';

import { getArtworkByUuid } from 'queries/hasura/artworks';
import { ArtworkFragmentExtended } from 'graphql/hasura/hasura-fragments.generated';

export default function ArtworkIndexPage(props: ArtworkPageData): JSX.Element {
  const { artwork: initialArtworkData } = props;

  // If the username is missing the @ prefix add it into the url
  useAddUsernamePrefix();

  const { data: user, isLoading: isCurrentUserLoading } = useWalletSession();

  const { data: artworkData } = useArtworkByUuid(
    { id: initialArtworkData.id },
    {
      initialData: { artwork: initialArtworkData },
      refetchOnWindowFocus: false,
    }
  );

  const artwork = artworkData?.artwork;

  const { data: currentUserData } = useUserByPublicKey(
    { publicKey: user?.publicAddress },
    { refetchOnWindowFocus: false }
  );

  const currentUserIsAdmin = currentUserData?.user?.isAdmin;

  const { name, description, tags } = artwork;

  const openGraphAsset: string = buildPageShareUrl(artwork);
  const posterUrl: string = buildPosterUrl(artwork, { bg: 'F2F2F2' });

  const truncatedDescription = truncateMetaDescription(description);

  const creatorModerationStatus = artwork?.creator?.moderationStatus;
  const isCreatorModerated = isFlaggedForModeration(creatorModerationStatus);

  if (isCreatorModerated && !currentUserIsAdmin) {
    return <ProfileWarningBlock moderationStatus={creatorModerationStatus} />;
  }

  const artworkModerationStatus = artwork?.moderationStatus;
  const isArtworkModerated = isFlaggedForModeration(artworkModerationStatus);

  if (isArtworkModerated && !currentUserIsAdmin) {
    return <ArtworkWarningPageBlock artwork={artwork} />;
  }

  return (
    <>
      <Flex css={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <Page
          title={name}
          description={truncatedDescription}
          image={posterUrl ?? openGraphAsset}
          absolute
        >
          <ArtworkPage
            artwork={artwork}
            tags={tags}
            user={user}
            isCurrentUserLoading={isCurrentUserLoading}
            mintEvent={null}
            currentUserPublicKey={user?.publicAddress}
            percentSplits={[]}
            twitterUsername={null}
            collection={null}
            history={[]}
            currentUserIsAdmin={currentUserIsAdmin}
            pageContext="preview-page"
          />
        </Page>
      </Flex>
    </>
  );
}

type ArtworkPageArgs = {
  username: string;
  contractAddress: string;
  tokenId: string;
};

type ArtworkPageData = {
  artwork: ArtworkFragmentExtended;
};

type PageProps = GetStaticPropsContext<ArtworkPageArgs>;

export async function getStaticPaths(): Promise<
  GetStaticPathsResult<ArtworkPageArgs>
> {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export async function getStaticProps(
  context: PageProps
): Promise<GetStaticPropsResult<ArtworkPageData>> {
  const artworkQuery = await getArtworkByUuid({
    id: context.params.tokenId,
  });

  return {
    props: {
      artwork: artworkQuery.artwork,
    },
    revalidate: 5,
  };
}
