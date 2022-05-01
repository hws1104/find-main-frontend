import { isNil } from 'ramda';
import { GetStaticPathsResult } from 'next';

import Flex from 'components/base/Flex';
import Page from 'components/Page';
import ArtworkPage from 'components/artworks/ArtworkPage';
import GenericError from 'components/GenericError';
import AdminToolsModal from 'components/modals/AdminToolsModal';
import ModerationBanner from 'components/admin/ModerationBanner';
import ReportModal from 'components/modals/ReportModal';

import ArtworkWarningPageBlock from 'components/trust-safety/ArtworkWarningPageBlock';
import ProfileWarningBlock from 'components/trust-safety/ProfileWarningBlock';

import useWalletSession from 'hooks/web3/wallet/use-wallet-session';
import useUserByPublicKey from 'hooks/queries/use-user-by-public-key';
import useAddUsernamePrefix from 'hooks/use-add-username-prefix';
import useSocialVerifications from 'hooks/queries/hasura/use-social-verifications';
import useArtworkPage from 'hooks/queries/hasura/artworks/use-artwork-page';

import { buildPageShareUrl, buildPosterUrl } from 'utils/assets';
import { truncateMetaDescription } from 'utils/helpers';
import { isFlaggedForModeration } from 'utils/moderation';
import { getTwitterUsername } from 'utils/twitter-templates';
import { maybeToString } from 'utils/strings';

import {
  ArtworkPageArgs,
  ArtworkPageData,
  getArtworkPageProps,
} from 'queries/server/artwork-page';

import { ReportType } from 'types/Report';

export default function ArtworkIndexPage(props: ArtworkPageData): JSX.Element {
  const { artwork: initialArtworkData } = props;

  // If the username is missing the @ prefix add it into the url
  useAddUsernamePrefix();

  const { data: user, isLoading: isCurrentUserLoading } = useWalletSession();

  const tokenId = initialArtworkData?.tokenId;
  const contractSlug = initialArtworkData?.collection?.slug;

  const { data: artwork } = useArtworkPage(
    { tokenId, contractSlug: contractSlug },
    {
      initialData: { artworks: [initialArtworkData] },
      refetchOnWindowFocus: false,
    }
  );

  const { data: currentUserData } = useUserByPublicKey(
    { publicKey: user?.publicAddress },
    { refetchOnWindowFocus: false }
  );

  const { data: socialVerificationData } = useSocialVerifications({
    publicKey: artwork?.creator?.publicKey,
  });

  const authToken = user?.token;

  const currentUserIsAdmin = currentUserData?.user?.isAdmin;

  const noArtwork = isNil(artwork);

  if (noArtwork) {
    return <GenericError />;
  }

  const { name, description, tags } = artwork;

  const openGraphAsset = buildPageShareUrl(artwork);
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

  const mintEvent = artwork?.events?.find(
    (event) => event.eventType === 'MINT'
  );

  return (
    <>
      {isArtworkModerated && currentUserIsAdmin && (
        <ModerationBanner
          status={artworkModerationStatus}
          reviewText="This artwork is under review."
          suspendedText="This artwork has been removed."
          takedownText={`This artwork has received a DMCA takedown notice from ${artwork.moderationFrom}.`}
        />
      )}
      {/* checking we have tokenId (as in preview mode it’s not present) */}
      {Boolean(currentUserIsAdmin && tokenId) && (
        <AdminToolsModal
          publicKey={artwork?.creator?.publicKey}
          moderationStatus={artworkModerationStatus}
          moderationFrom={artwork?.moderationFrom}
          entityId={artwork?.id}
          tokenId={maybeToString(tokenId)}
          context="artwork"
        />
      )}

      {tokenId && (
        <ReportModal
          publicAddress={user?.publicAddress}
          authToken={authToken}
          id={tokenId.toString()}
          type={ReportType.Artwork}
        />
      )}

      <Flex
        css={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          position: 'relative',
        }}
      >
        <Page
          title={name}
          description={truncatedDescription}
          image={posterUrl ?? openGraphAsset}
          absolute
          footerStyle={{ display: 'none' }}
        >
          <ArtworkPage
            artwork={artwork}
            tags={tags}
            user={user}
            isCurrentUserLoading={isCurrentUserLoading}
            mintEvent={mintEvent}
            percentSplits={artwork.splitRecipients}
            currentUserPublicKey={user?.publicAddress}
            twitterUsername={getTwitterUsername(socialVerificationData)}
            collection={artwork.collection}
            history={artwork.events}
            currentUserIsAdmin={currentUserIsAdmin}
            otherArtworks={artwork?.otherArtworks}
            pageContext="artwork-page"
          />
        </Page>
      </Flex>
    </>
  );
}

export async function getStaticPaths(): Promise<
  GetStaticPathsResult<ArtworkPageArgs>
> {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export const getStaticProps = getArtworkPageProps;
