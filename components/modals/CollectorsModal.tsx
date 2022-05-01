import { isEmpty } from 'ramda';
import { useQueryClient } from 'react-query';

import { QueryCacheKey } from 'types/Queries';
import { ModalKey } from 'types/modal';
import { UserCollectors } from 'graphql/hasura/queries/user-collectors.generated';

import usePagination from 'hooks/use-pagination';
import useProfileCollectors from 'hooks/queries/hasura/use-profile-collectors';

import Paragraph from 'components/base/Paragraph';
import ModalContentVirtualized from 'components/modals/virtualized/ModalContentVirtualized';
import ModalContainer from 'components/modals/common/ModalContainer';
import ModalPaneVirtualized from 'components/modals/virtualized/ModalPaneVirtualized';
import ModalTabs from 'components/modals/common/ModalTabBar';
import LoadingPage from 'components/LoadingPage';

import useModal from 'hooks/use-modal';
import useInfiniteData from 'hooks/use-infinite-data';
import useWalletSession from 'hooks/web3/wallet/use-wallet-session';

import { isAllTrue } from 'utils/helpers';

type Collector = UserCollectors['collectors'][0];

interface CollectorsModalProps {
  publicKey: string;
}

export default function CollectorsModal(
  props: CollectorsModalProps
): JSX.Element {
  const { publicKey } = props;

  const { data: user, isLoading: userIsLoading } = useWalletSession();

  const currentUserPublicKey = user?.publicAddress;

  const { currentModal } = useModal();

  const queryClient = useQueryClient();

  const isModalOpen = currentModal === ModalKey.COLLECTORS;

  const {
    data,
    fetchNextPage,
    isLoading,
    isFetching,
    hasNextPage,
    isFetchingNextPage,
  } = useProfileCollectors(
    { publicKey, currentUserPublicKey },
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
    <ModalContainer modalKey={ModalKey.COLLECTORS} enableCloseButton={false}>
      <ModalContentVirtualized>
        <ModalTabs
          tabs={[
            {
              onClick: () => void 0,
              isActive: true,
              children: 'Collected by',
            },
          ]}
        />

        {isLoading ? (
          <LoadingPage css={{ paddingBottom: 0 }} />
        ) : noResults ? (
          <Paragraph css={{ margin: 'auto' }}>
            This user has no collectors.
          </Paragraph>
        ) : (
          <ModalPaneVirtualized<Collector>
            users={collectors}
            handleNextPage={handleNextPage}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
            onFollowUpdate={() => {
              queryClient.invalidateQueries(QueryCacheKey.ProfileCollectors);
            }}
          />
        )}
      </ModalContentVirtualized>
    </ModalContainer>
  );
}
