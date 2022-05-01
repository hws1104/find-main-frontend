import React from 'react';
import { useState, useEffect } from 'react';
import { always, cond, equals, pick, T } from 'ramda';

import { ModalKey } from 'types/modal';
import { ModerationStatus } from 'types/Moderation';

import useUserByPublicKey from 'hooks/queries/use-user-by-public-key';
import useWalletSession from 'hooks/web3/wallet/use-wallet-session';

import ModalContainer from 'components/modals/common/ModalContainer';
import ModalTabs from 'components/modals/common/ModalTabBar';
import ModalContent from 'components/modals/common/ModalContent';
import RemoveUsernamePane from 'components/modals/admin-tools/RemoveUsernamePane';
import RemoveCreatorAccessPane from 'components/modals/admin-tools/RemoveCreatorAccessPane';
import RemoveInvitesPane from 'components/modals/admin-tools/RemoveInvitesPane';
import ApproveMigrationPane from './admin-tools/ApproveMigrationPane';
import ChangeStatusPane from './admin-tools/ChangeStatusPane';
import GiveInvitesPane from './admin-tools/GiveInvitesPane';
import TabHeading from 'components/tabs/TabHeading';

import { setArtworkModerationProxy } from 'queries/admin/artwork';
import { setProfileModerationProxy } from 'queries/admin/profile';
import HideArtworkPane from './admin-tools/HideArtworkPane';
import HideCollectionPane from './admin-tools/HideCollectionPane';
import { setCollectionModerationProxy } from 'queries/admin/collection';

interface AdminToolsModalProps {
  publicKey: string;
  context: 'profile' | 'artwork' | 'collection';
  entityId: string;
  moderationStatus: ModerationStatus;
  moderationFrom: string;
  tokenId?: string;
}

enum AdminModalTab {
  RemoveUsername = 'Username',
  RemoveCreatorAccess = 'Creator Access',
  RemoveInvites = 'Invites',
  ApproveMigration = 'Creator Migration',
  ChangeStatus = 'Change Status',
  GiveInvites = 'Give Invites',
  HideArtwork = 'Hide Artwork',
  HideCollection = 'Hide Collection',
}

export default function AdminToolsModal(
  props: AdminToolsModalProps
): JSX.Element {
  const {
    publicKey,
    context,
    entityId,
    moderationStatus,
    moderationFrom,
    tokenId,
  } = props;

  const { data: user } = useWalletSession();

  const currentUserPublicAddress = user?.publicAddress;
  const token = user?.token;

  const [modalTab, setModalTab] = useState(AdminModalTab.RemoveUsername);

  const { data: userData } = useUserByPublicKey({ publicKey });

  const activeTabs = [
    {
      onClick: () => setModalTab(AdminModalTab.RemoveUsername),
      isActive: modalTab === AdminModalTab.RemoveUsername,
      children: AdminModalTab.RemoveUsername,
      enabled: context === 'profile',
    },
    {
      onClick: () => setModalTab(AdminModalTab.RemoveCreatorAccess),
      isActive: modalTab === AdminModalTab.RemoveCreatorAccess,
      children: AdminModalTab.RemoveCreatorAccess,
      enabled: context === 'profile',
    },
    {
      onClick: () => setModalTab(AdminModalTab.RemoveInvites),
      isActive: modalTab === AdminModalTab.RemoveInvites,
      children: AdminModalTab.RemoveInvites,
      enabled: context === 'profile',
    },
    {
      onClick: () => setModalTab(AdminModalTab.ApproveMigration),
      isActive: modalTab === AdminModalTab.ApproveMigration,
      children: AdminModalTab.ApproveMigration,
      enabled: context === 'profile',
    },
    {
      onClick: () => setModalTab(AdminModalTab.GiveInvites),
      isActive: modalTab === AdminModalTab.GiveInvites,
      children: AdminModalTab.GiveInvites,
      enabled: context === 'profile',
    },
    {
      onClick: () => setModalTab(AdminModalTab.ChangeStatus),
      isActive: modalTab === AdminModalTab.ChangeStatus,
      children: AdminModalTab.ChangeStatus,
      enabled: true,
    },
    {
      onClick: () => setModalTab(AdminModalTab.HideArtwork),
      isActive: modalTab === AdminModalTab.HideArtwork,
      children: AdminModalTab.HideArtwork,
      enabled: context === 'artwork',
    },
    {
      onClick: () => setModalTab(AdminModalTab.HideCollection),
      isActive: modalTab === AdminModalTab.HideCollection,
      children: AdminModalTab.HideCollection,
      enabled: context === 'collection',
    },
  ]
    .filter((tab) => tab.enabled)
    .map(pick(['onClick', 'isActive', 'children']));

  const changeStatusMutation = cond([
    [equals('artwork'), always(setArtworkModerationProxy)],
    [equals('collection'), always(setCollectionModerationProxy)],
    [T, always(setProfileModerationProxy)],
  ]);

  const [firstTab] = activeTabs;

  useEffect(() => {
    setModalTab(firstTab.children);
  }, [firstTab.children]);

  return (
    <ModalContainer modalKey={ModalKey.ADMIN_TOOLS}>
      <ModalContent
        css={{
          maxWidth: 640,
          padding: 0,
          [`& ${TabHeading}`]: {
            fontSize: '$0',
            marginRight: '$4',
          },
        }}
      >
        <ModalTabs tabs={activeTabs} enableCloseButton={false} />

        {cond([
          [
            equals(AdminModalTab.RemoveUsername),
            always(<RemoveUsernamePane user={userData?.user} />),
          ],
          [
            equals(AdminModalTab.RemoveCreatorAccess),
            always(<RemoveCreatorAccessPane user={userData?.user} />),
          ],
          [
            equals(AdminModalTab.RemoveInvites),
            always(<RemoveInvitesPane user={userData?.user} />),
          ],
          [
            equals(AdminModalTab.ApproveMigration),
            always(<ApproveMigrationPane user={userData?.user} />),
          ],
          [
            equals(AdminModalTab.GiveInvites),
            always(<GiveInvitesPane publicKey={publicKey} token={token} />),
          ],
          [
            equals(AdminModalTab.ChangeStatus),
            always(
              <ChangeStatusPane
                tokenId={tokenId}
                currentUserPublicAddress={currentUserPublicAddress}
                authToken={token}
                entityId={entityId}
                dmcaEnabled={context === 'artwork'}
                moderationFrom={moderationFrom}
                moderationStatus={moderationStatus}
                mutation={changeStatusMutation(context)}
              />
            ),
          ],
          [
            equals(AdminModalTab.HideArtwork),
            always(
              <HideArtworkPane user={userData?.user} artworkId={entityId} />
            ),
          ],
          [
            equals(AdminModalTab.HideCollection),
            always(<HideCollectionPane collectionId={entityId} />),
          ],
        ])(modalTab)}
      </ModalContent>
    </ModalContainer>
  );
}
