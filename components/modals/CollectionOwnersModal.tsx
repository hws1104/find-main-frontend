import { isEmpty } from 'ramda';
import { useQueryClient } from 'react-query';

import { ModalKey } from 'types/modal';
import useCollectionOwners, {
  CollectionOwner,
} from 'hooks/queries/hasura/use-collection-owners';

import usePagination from 'hooks/use-pagination';
import useModal from 'hooks/use-modal';
import useInfiniteData from 'hooks/use-infinite-data';
import useWalletSession from 'hooks/web3/wallet/use-wallet-session';

import Paragraph from 'components/base/Paragraph';
import ModalContentVirtualized from 'components/modals/virtualized/ModalContentVirtualized';
import ModalContainer from 'components/modals/common/ModalContainer';
import ModalPaneVirtualized from 'components/modals/virtualized/ModalPaneVirtualized';
import ModalTabs from 'components/modals/common/ModalTabBar';
import LoadingPage from 'components/LoadingPage';

import { isAllTrue } from 'utils/helpers';

interface CollectionOwnersModalProps {
  contractSlug: string;
}

export default function CollectionOwnersModal(
  props: CollectionOwnersModalProps
): JSX.Element {
  const { contractSlug } = props;

  const { data: user, isLoading: userIsLoading } = useWalletSession();

  const currentUserPublicKey = user?.publicAddress;

  const { currentModal } = useModal();

  const queryClient = useQueryClient();

  const isModalOpen = currentModal === ModalKey.OWNED_BY;

  const {
    data,
    fetchNextPage,
    isLoading,
    isFetching,
    hasNextPage,
    isFetchingNextPage,
  } = useCollectionOwners(
    { contractSlug, currentUserPublicKey },
    {
      enabled: isAllTrue([isModalOpen, !userIsLoading]),
      refetchOnWindowFocus: false,
    }
  );

  const collectors = useInfiniteData(data, 'publicKey');

  const { handleNextPage } = usePagination({
    fetchNextPage,
    isFetching,
    hasNextPage,
  });

  const noResults = isEmpty(collectors);

  return (
    <ModalContainer modalKey={ModalKey.OWNED_BY} enableCloseButton={false}>
      <ModalContentVirtualized>
        <ModalTabs
          tabs={[
            {
              onClick: () => void 0,
              isActive: true,
              children: 'Owned by',
            },
          ]}
        />

        {isLoading ? (
          <LoadingPage css={{ paddingBottom: 0 }} />
        ) : noResults ? (
          <Paragraph css={{ margin: 'auto' }}>
            This collection has no owners.
          </Paragraph>
        ) : (
          <ModalPaneVirtualized<CollectionOwner>
            users={collectors}
            handleNextPage={handleNextPage}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
            onFollowUpdate={() => {
              queryClient.invalidateQueries('CollectionOwners');
            }}
          />
        )}
      </ModalContentVirtualized>
    </ModalContainer>
  );
}
