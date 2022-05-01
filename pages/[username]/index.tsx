/* eslint-disable max-lines */
/* eslint-disable react/jsx-max-depth */
import { GetStaticPathsResult } from 'next';
import { css } from 'stitches.config';

import { useFollowModalProfile } from 'hooks/use-follow-modal';
import { useUserProfileByPublicKey } from 'graphql/hasura/queries/user-profile-by-public-key.generated';
import useWalletSession from 'hooks/web3/wallet/use-wallet-session';
import useUserByPublicKey from 'hooks/queries/use-user-by-public-key';
import useAddUsernamePrefix from 'hooks/use-add-username-prefix';

import Page from 'components/Page';
import Body from 'components/base/Body';
import Box from 'components/base/Box';
import Flex from 'components/base/Flex';
import Grid from 'components/base/Grid';

import UserProfileHeader from 'components/profiles/UserProfileHeader';
import ProfileCoverImage from 'components/profiles/ProfileCoverImage';
import ProfileCopyAddress from 'components/profiles/ProfileCopyAddress';

import ProfileAboutBlock, {
  ProfileAboutBlockMobile,
} from 'components/profiles/ProfileAboutBlock';
import ProfileWarningBlock from 'components/trust-safety/ProfileWarningBlock';
import ProfileCollectors from 'components/profiles/ProfileCollectors';
import ProfileCollectionV2 from 'components/profiles/ProfileCollectionV2';
import CollectorsModal from 'components/modals/CollectorsModal';
import AdminToolsModal from 'components/modals/AdminToolsModal';
import ModerationBanner from 'components/admin/ModerationBanner';
import ReportModal from 'components/modals/ReportModal';
import FollowsModal from 'components/modals/FollowsModal';
import ProfileFollowInfo from 'components/profiles/ProfileFollowInfo';

import { isFlaggedForModeration } from 'utils/moderation';
import {
  buildCoverImageUrl,
  buildImgixUrl,
  buildProfileShareImageUrl,
} from 'utils/assets';

import {
  areKeysEqual,
  getAvatarByPublicKey,
  getProfilePageTitle,
} from 'utils/users';

import {
  notEmptyOrNil,
  getFirstValue,
  truncateMetaDescription,
  getArrayOrEmpty,
} from 'utils/helpers';

import { getProfilePageProps } from 'queries/hasura/profile-page';

import { PageColorMode } from 'types/page';
import { ReportType } from 'types/Report';
import { UserProfile } from 'queries/hasura/profile-page';

import { getNFT721Address } from 'lib/addresses';

export default function UserProfilePage(props: UserProfile): JSX.Element {
  const { user: initialUser, profileExists, ensRegistration } = props;

  // If the username is missing the @ prefix add it into the url
  useAddUsernamePrefix();

  const { data: currentUser, isLoading: isCurrentUserLoading } =
    useWalletSession();

  const currentUserPublicAddress = currentUser?.publicAddress;
  const authToken = currentUser?.token;

  const profilePublicKey = initialUser?.publicKey;

  const { data: userData } = useUserProfileByPublicKey(
    { publicKey: profilePublicKey, contractAddress: getNFT721Address() },
    { initialData: { user: initialUser }, refetchOnWindowFocus: false }
  );

  const { data: currentUserData } = useUserByPublicKey(
    { publicKey: currentUserPublicAddress },
    { refetchOnWindowFocus: false }
  );

  const user = userData?.user;

  const currentUserIsAdmin = currentUserData?.user?.isAdmin ?? false;

  useFollowModalProfile(user?.publicKey);

  const coverImageUrl = buildCoverImageUrl(user?.coverImageUrl);
  const avatarUrl = buildImgixUrl(user?.profileImageUrl, { w: 350 });

  const openGraphImageUrl: string = buildProfileShareImageUrl(
    coverImageUrl ?? avatarUrl
  );

  const twitterSocialVerificationProfile = getFirstValue(
    user?.twitSocialVerifs
  );

  const instagramSocialVerificationProfile = getFirstValue(
    user?.instaSocialVerifs
  );

  const isMyProfile = areKeysEqual([currentUserPublicAddress, user?.publicKey]);

  const moderationStatus = user?.moderationStatus;

  const isModerated = isFlaggedForModeration(moderationStatus);

  if (isModerated && !currentUserIsAdmin && !isMyProfile) {
    return <ProfileWarningBlock moderationStatus={moderationStatus} />;
  }

  const ownedArtworks = getArrayOrEmpty(user?.ownedArtworks);

  const userCollectors = ownedArtworks.map((artwork) => artwork.owner);

  const reviewText = isMyProfile
    ? 'Your profile is under review.'
    : 'This profile is under review.';

  const suspendedText = isMyProfile
    ? 'Your profile has been removed.'
    : 'This profile has been removed.';

  const hasCollectors = notEmptyOrNil(userCollectors);

  return (
    <>
      {isModerated && (currentUserIsAdmin || isMyProfile) && (
        <ModerationBanner
          status={moderationStatus}
          reviewText={reviewText}
          suspendedText={suspendedText}
          takedownText=""
        />
      )}
      {currentUserIsAdmin && (
        <AdminToolsModal
          publicKey={profilePublicKey}
          entityId={profilePublicKey}
          context="profile"
          moderationStatus={moderationStatus}
          moderationFrom=""
        />
      )}

      <FollowsModal />
      <CollectorsModal publicKey={profilePublicKey} />
      <ReportModal
        publicAddress={currentUserPublicAddress}
        authToken={authToken}
        id={user?.publicKey}
        type={ReportType.User}
      />

      <Box css={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <Page
          title={getProfilePageTitle(user)}
          description={truncateMetaDescription(user?.bio)}
          image={openGraphImageUrl}
          headerMode={coverImageUrl ? PageColorMode.dark : PageColorMode.light}
          absolute
        >
          <ProfileCoverImage
            creator={user}
            coverImage={coverImageUrl}
            avatarBackground={getAvatarByPublicKey(user?.publicKey)}
            avatar={avatarUrl}
            meta={
              <Flex
                css={{
                  display: 'none',
                  justifyContent: 'flex-end',
                  position: 'relative',
                  zIndex: 4,
                  transform: 'translateY(-50%)',
                  '@bp1': {
                    display: 'flex',
                  },
                }}
              >
                <ProfileCollectors collectors={userCollectors} />
              </Flex>
            }
          />

          <Body
            css={{
              flex: 1,
              display: 'grid',
              gap: '$7',
              '@bp1': {
                gap: '$9',
                gridTemplateColumns: 'minmax(280px, 1fr) 3fr',
              },
              '@bp3': {
                gridTemplateColumns: 'minmax(350px, 1fr) 3fr',
              },
            }}
          >
            <Box>
              <Flex
                css={{
                  justifyContent: 'center',
                  '@bp1': {
                    justifyContent: 'flex-start',
                  },
                }}
              >
                <ProfileCopyAddress
                  publicKey={user?.publicKey}
                  userIndex={user?.userIndex}
                />
              </Flex>

              <Grid>
                <Grid css={{ gap: '$6', '@bp1': { gap: '$7' } }}>
                  <UserProfileHeader user={user} />
                  <Grid css={{ gap: '$7', '@bp1': { gap: '$8' } }}>
                    <Grid css={{ gap: '$7' }}>
                      {hasCollectors && (
                        <Flex
                          css={{
                            justifyContent: 'center',
                            '@bp1': {
                              display: 'none',
                            },
                          }}
                        >
                          <ProfileCollectors collectors={userCollectors} />
                        </Flex>
                      )}

                      {profileExists && (
                        <ProfileFollowInfo
                          publicKey={user.publicKey}
                          userFollowState={{
                            followerCount: user.followerCount,
                            followingCount: user.followingCount,
                            isFollowingUser: { aggregate: { count: 0 } },
                          }}
                        />
                      )}
                    </Grid>

                    <ProfileAboutBlock
                      user={user}
                      currentUser={currentUser}
                      twitterSocialVerification={
                        twitterSocialVerificationProfile
                      }
                      instagramSocialVerification={
                        instagramSocialVerificationProfile
                      }
                      ensRegistration={ensRegistration}
                      className={profileAboutBlockStyles()}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Box>
            <Box>
              <ProfileCollectionV2
                publicKey={profilePublicKey}
                currentUserPublicKey={currentUserPublicAddress}
                isCurrentUserLoading={isCurrentUserLoading}
                user={user}
                currentUser={currentUser}
                createdCount={user.artworksCreatedCount.aggregate.count}
                collectionsCount={user.collectionsCount.aggregate.count}
                collectedCount={user.artworksCollectedCount.aggregate.count}
              />
            </Box>
            <ProfileAboutBlockMobile
              user={user}
              currentUser={currentUser}
              twitterSocialVerification={twitterSocialVerificationProfile}
              instagramSocialVerification={instagramSocialVerificationProfile}
              ensRegistration={ensRegistration}
              className={profileAboutBlockMobileStyles()}
            />
          </Body>
        </Page>
      </Box>
    </>
  );
}

const profileAboutBlockStyles = css({
  display: 'none',
  '@bp1': {
    display: 'block',
  },
});

const profileAboutBlockMobileStyles = css({
  display: 'block',
  '@bp1': {
    display: 'none',
  },
});

type PageArgs = { username: string };
type PathProps = GetStaticPathsResult<PageArgs>;

export async function getStaticPaths(): Promise<PathProps> {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export const getStaticProps = getProfilePageProps;
