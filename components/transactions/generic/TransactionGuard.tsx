import { ReactNode } from 'react';

import useWalletSession from 'hooks/web3/wallet/use-wallet-session';
import useUserByPublicKey from 'hooks/queries/use-user-by-public-key';
import useHasSocialVerification from 'hooks/queries/hasura/use-has-social-verification';
import { useArtworkByContractTokenIdFromRouter } from 'hooks/queries/hasura/artworks/use-artwork-by-contract-token-id';
import { useArtworkByUuidFromRouter } from 'hooks/queries/hasura/artworks/use-artwork-by-uuid-from-router';

import Box from 'components/base/Box';
import TransactionProgressPane from './TransactionProgressPane';
import SocialVerificationGuard from 'components/trust-safety/page-guards/SocialVerificationGuard';
import ApprovedCreatorGuard from 'components/trust-safety/page-guards/ApprovedCreatorGuard';
import { PageGuard } from 'types/Moderation';
import UserModeratedGuard from 'components/trust-safety/page-guards/UserModeratedGuard';
import { TransactionActionButton } from './TransactionActionButtons';

import { isAllTrue, isAnyTrue } from 'utils/helpers';
import {
  getArtworkModerationDescription,
  getArtworkModerationTitle,
  isFlaggedForModeration,
} from 'utils/moderation';
import { ArtworkQueryType } from 'types/Artwork';

interface TransactionGuardProps {
  artworkQueryType: ArtworkQueryType;
  pageGuards: PageGuard[];
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function TransactionGuard(
  component: ReactNode,
  options: TransactionGuardProps
) {
  return (
    <RenderTransactionGuard {...options}>{component}</RenderTransactionGuard>
  );
}

interface RenderTransactionGuardProps extends TransactionGuardProps {
  children: ReactNode;
}

function RenderTransactionGuard(props: RenderTransactionGuardProps) {
  const { children, pageGuards, artworkQueryType } = props;

  const { data: user } = useWalletSession();

  const { data: artworkDataUuid } = useArtworkByUuidFromRouter({
    enabled: isAllTrue([
      artworkQueryType === 'uuid',
      pageGuards.includes('artwork-moderated'),
    ]),
  });

  const { data: artworkDataTokenId } = useArtworkByContractTokenIdFromRouter({
    enabled: isAllTrue([
      artworkQueryType === 'tokenId',
      pageGuards.includes('artwork-moderated'),
    ]),
  });

  const artworkData =
    artworkQueryType === 'uuid' ? artworkDataUuid : artworkDataTokenId;

  const { data: currentUser } = useUserByPublicKey(
    { publicKey: user?.publicAddress },
    {
      enabled: isAnyTrue([
        pageGuards.includes('approved-creator'),
        pageGuards.includes('user-moderated'),
      ]),
    }
  );

  const { data: hasSocialVerification } = useHasSocialVerification(
    { publicKey: user?.publicAddress },
    { enabled: pageGuards.includes('social-verification') }
  );

  const hasApprovedCreatorGuard = isAllTrue([
    !currentUser?.user?.isApprovedCreator,
    pageGuards.includes('approved-creator'),
  ]);

  if (hasApprovedCreatorGuard) {
    return <ApprovedCreatorGuard />;
  }

  const hasSocialVerificationGuard = isAllTrue([
    !hasSocialVerification,
    pageGuards.includes('social-verification'),
  ]);

  if (hasSocialVerificationGuard) {
    return <SocialVerificationGuard />;
  }

  const userModerationStatus = currentUser?.user?.moderationStatus;

  const hasUserModerated = isAllTrue([
    isFlaggedForModeration(userModerationStatus),
    pageGuards.includes('user-moderated'),
  ]);

  if (hasUserModerated) {
    return <UserModeratedGuard userModerationStatus={userModerationStatus} />;
  }

  const artworkModerationStatus = artworkData?.moderationStatus;

  const hasArtworkModerated = isAllTrue([
    isFlaggedForModeration(artworkModerationStatus),
    pageGuards.includes('artwork-moderated'),
  ]);

  if (hasArtworkModerated) {
    return (
      <TransactionProgressPane
        key="artwork-moderated"
        status="warning"
        title={getArtworkModerationTitle(artworkModerationStatus)}
        description={getArtworkModerationDescription(artworkData)}
        meta={
          <Box css={{ width: '100%' }}>
            <TransactionActionButton href="/" label="Back home" />
          </Box>
        }
      />
    );
  }

  return <>{children}</>;
}
