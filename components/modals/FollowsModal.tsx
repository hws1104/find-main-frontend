import { isEmpty } from 'ramda';
import { useEffect } from 'react';
import { useQueryClient } from 'react-query';

import { ModalKey, ModalMode } from 'types/modal';

import useWalletSession from 'hooks/web3/wallet/use-wallet-session';
import usePagination from 'hooks/use-pagination';
import useUserFollowing, {
  UserFollows,
} from 'hooks/queries/hasura/use-user-following';
import useUserFollowers from 'hooks/queries/hasura/use-user-followers';
import useModal from 'hooks/use-modal';
import useInfiniteData from 'hooks/use-infinite-data';

import FollowsEmptyState from 'components/follows/FollowsEmptyState';
import LoadingPage from 'components/LoadingPage';
import ModalContainer from 'components/modals/common/ModalContainer';
import ModalTabs from 'components/modals/common/ModalTabBar';
import ModalContentVirtualized from 'components/modals/virtualized/ModalContentVirtualized';
import ModalPaneVirtualized from 'components/modals/virtualized/ModalPaneVirtualized';

import { isAllTrue } from 'utils/helpers';

type ModalFollow = UserFollows[0]['user'];

export default function FollowsModal(): JSX.Element {
  const queryClient = useQueryClient();

  const {
    modalEntity: publicKey,
    currentModal,
    modalMode,
    setModalMode,
  } = useModal();

  const { data: user, isLoading: isUserLoading } = useWalletSession();

  const currentUserPublicKey = user?.publicAddress;

  const isModalOpen = currentModal === ModalKey.FOLLOWS;

  const modalHook =
    modalMode === ModalMode.Following ? useUserFollowing : useUserFollowers;

  const {
    data,
    isLoading,
    isFetching,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = modalHook(
    { publicKey, currentUserPublicKey: currentUserPublicKey },
    {
      enabled: isAllTrue([isModalOpen, !isUserLoading]),
      refetchOnWindowFocus: false,
    }
  );

  const followedUsers = useInfiniteData(data, 'id');

  const users = followedUsers.map((follow) => follow.user);

  const { handleNextPage, setCurrentPage } = usePagination({
    fetchNextPage,
    isFetching,
    hasNextPage,
  });

  // reset the infinite scroll to 0 when the modal changes
  useEffect(
    () => {
      setCurrentPage(0);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentModal, modalMode]
  );

  const noResults = isEmpty(followedUsers);

  return (
    <ModalContainer modalKey={ModalKey.FOLLOWS} enableCloseButton={false}>
      <ModalContentVirtualized>
        <ModalTabs
          tabs={[
            {
              onClick: () => setModalMode(ModalMode.Following),
              isActive: modalMode === ModalMode.Following,
              children: 'Following',
            },
            {
              onClick: () => setModalMode(ModalMode.Followers),
              isActive: modalMode === ModalMode.Followers,
              children: 'Followers',
            },
          ]}
        />

        {isLoading ? (
          <LoadingPage css={{ paddingBottom: 0 }} />
        ) : noResults ? (
          <FollowsEmptyState modalMode={modalMode} />
        ) : (
          <ModalPaneVirtualized<ModalFollow>
            modalMode={modalMode}
            users={users}
            handleNextPage={handleNextPage}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
            onFollowUpdate={() => {
              const queryKey = modalHook.getKey({
                publicKey,
                currentUserPublicKey: currentUserPublicKey,
              });
              queryClient.invalidateQueries(queryKey);
            }}
          />
        )}
      </ModalContentVirtualized>
    </ModalContainer>
  );
}
