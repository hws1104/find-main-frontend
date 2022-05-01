import { ReactNode } from 'react';

import useWalletSession from 'hooks/web3/wallet/use-wallet-session';
import useUserByPublicKey from 'hooks/queries/use-user-by-public-key';
import useUserHasApprovedAction from 'hooks/queries/hasura/use-user-has-approved-action';
import useHasSocialVerification from 'hooks/queries/hasura/use-has-social-verification';

import Flex from 'components/base/Flex';
import AgreeToTOSGuard from 'components/trust-safety/page-guards/AgreeToTOSGuard';
import SocialVerificationGuard from 'components/trust-safety/page-guards/SocialVerificationGuard';
import ApprovedCreatorGuard from 'components/trust-safety/page-guards/ApprovedCreatorGuard';
import UserModeratedGuard from 'components/trust-safety/page-guards/UserModeratedGuard';

import { isAllTrue, isAnyTrue } from 'utils/helpers';
import { isFlaggedForModeration } from 'utils/moderation';
import { PageGuard } from 'types/Moderation';
import { ActionType } from 'types/ActionType';

import { styled } from 'stitches.config';
import SpinnerStroked from 'components/SpinnerStroked';

interface UploadGuardProps {
  pageGuards: PageGuard[];
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function UploadGuard(
  component: ReactNode,
  options: UploadGuardProps
) {
  return <RenderUploadGuard {...options}>{component}</RenderUploadGuard>;
}

interface RenderUploadGuardProps extends UploadGuardProps {
  children: ReactNode;
}

function RenderUploadGuard(props: RenderUploadGuardProps) {
  const { children, pageGuards } = props;

  const { data: user } = useWalletSession();

  const currentUserPublicKey = user?.publicAddress;
  const token = user?.token;

  const { data: currentUser, isLoading: isUserLoading } = useUserByPublicKey(
    { publicKey: user?.publicAddress },
    {
      enabled: isAnyTrue([
        pageGuards.includes('approved-creator'),
        pageGuards.includes('user-moderated'),
      ]),
    }
  );

  const { data: userHasApprovedTerms, isLoading: isApprovedLoading } =
    useUserHasApprovedAction(
      {
        publicKey: currentUserPublicKey,
        actionType: ActionType['AcceptWelcomeScreen1.0'],
      },
      { enabled: pageGuards.includes('agreed-to-tos') }
    );

  const {
    data: hasSocialVerification,
    isLoading: isSocialVerificationLoading,
  } = useHasSocialVerification(
    { publicKey: currentUserPublicKey },
    { enabled: pageGuards.includes('social-verification') }
  );

  const isLoading = isAnyTrue([
    !currentUser,
    isUserLoading,
    isApprovedLoading,
    isSocialVerificationLoading,
  ]);

  if (isLoading) {
    return (
      <GuardContainer css={{ marginY: 'auto' }}>
        <SpinnerStroked />
      </GuardContainer>
    );
  }

  const hasApprovedCreatorGuard = isAllTrue([
    !currentUser?.user?.isApprovedCreator,
    pageGuards.includes('approved-creator'),
  ]);

  if (hasApprovedCreatorGuard) {
    return (
      <GuardContainer>
        <ApprovedCreatorGuard />
      </GuardContainer>
    );
  }

  const hasSocialVerificationGuard = isAllTrue([
    !hasSocialVerification,
    pageGuards.includes('social-verification'),
  ]);

  if (hasSocialVerificationGuard) {
    return (
      <GuardContainer>
        <SocialVerificationGuard />
      </GuardContainer>
    );
  }

  const userModerationStatus = currentUser?.user?.moderationStatus;

  const hasUserModerated = isAllTrue([
    isFlaggedForModeration(userModerationStatus),
    pageGuards.includes('user-moderated'),
  ]);

  if (hasUserModerated) {
    return (
      <GuardContainer>
        <UserModeratedGuard userModerationStatus={userModerationStatus} />
      </GuardContainer>
    );
  }

  const hasUserAgreedToTos = isAllTrue([
    !userHasApprovedTerms,
    pageGuards.includes('agreed-to-tos'),
  ]);

  if (hasUserAgreedToTos) {
    return (
      <AgreeToTOSGuard publicAddress={currentUserPublicKey} token={token} />
    );
  }

  return <>{children}</>;
}

const GuardContainer = styled(Flex, {
  maxWidth: 560,
  marginX: 'auto',
});
