/* eslint-disable react/jsx-max-depth */
/* eslint-disable max-lines */
import { any } from 'ramda';
import { useState } from 'react';

import Flex from 'components/base/Flex';
import JoinCommunity from 'components/join/JoinCommunity';
import SetupProfile from 'components/join/SetupProfile';
import LoadingPage from 'components/LoadingPage';

import { useValidSocialVerificationByService } from 'hooks/queries/hasura/use-social-verification';
import useUserByPublicKey from 'hooks/queries/use-user-by-public-key';
import useWalletSession from 'hooks/web3/wallet/use-wallet-session';

import { SocialVerifService } from 'types/SocialVerification';

interface InviteOnlyOverlayProps {
  children: JSX.Element;
  enabled: boolean;
}

export default function InviteOnlyOverlay(
  props: InviteOnlyOverlayProps
): JSX.Element {
  const { children, enabled } = props;

  if (!enabled) {
    return children;
  }

  return <InviteOnlyContent />;
}

function InviteOnlyContent(): JSX.Element {
  const [showSetup, setShowSetup] = useState(false);
  const { data: user, isLoading: isLoadingUser } = useWalletSession();

  const publicAddress = user?.publicAddress;
  const token = user?.token;

  const {
    data: twitterSocialVerification,
    isLoading: isLoadingTwitterVerification,
  } = useValidSocialVerificationByService({
    publicKey: user?.publicAddress,
    service: SocialVerifService.TWITTER,
  });

  const {
    data: instagramSocialVerification,
    isLoading: isLoadingInstagramVerification,
  } = useValidSocialVerificationByService({
    publicKey: user?.publicAddress,
    service: SocialVerifService.INSTAGRAM,
  });

  const isLoadingVerification =
    isLoadingTwitterVerification || isLoadingInstagramVerification;

  const { data: userData, isLoading: isLoadingServerUser } = useUserByPublicKey(
    { publicKey: publicAddress },
    { refetchOnWindowFocus: false }
  );

  const currentUser = userData?.user;
  const isApprovedCreator = currentUser?.isApprovedCreator;

  const loadingStates = [
    isLoadingServerUser,
    isLoadingUser,
    isLoadingVerification,
  ];

  const isLoading = any(Boolean, loadingStates);

  if (isLoading) {
    return (
      <LoadingPage
        css={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          zIndex: 999,
          transform: 'translate(-50%, -50%)',
          padding: 0,
        }}
      />
    );
  }

  return (
    <Flex
      css={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginY: 'auto',
      }}
    >
      {showSetup ? (
        <SetupProfile
          token={token}
          isApprovedCreator={isApprovedCreator}
          twitterSocialVerification={twitterSocialVerification}
          instagramSocialVerification={instagramSocialVerification}
          currentUser={currentUser}
        />
      ) : (
        <JoinCommunity onClick={() => setShowSetup(true)} />
      )}
    </Flex>
  );
}
