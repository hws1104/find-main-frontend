import { pathOr } from 'ramda';

import PrivateSaleContainer from 'components/transactions/privateSale/PrivateSaleContainer';
import TransactionLoadingPage from 'components/transactions/TransactionLoadingPage';
import WalletAuthBlock from 'components/auth/WalletAuthBlock';
import PrivateSaleWarningAlreadyActive from 'components/transactions/privateSale/PrivateSaleWarningAlreadyActive';
import PrivateSaleWarningNotOwner from 'components/transactions/privateSale/PrivateSaleWarningNotOwner';
import TransactionLayoutV2 from 'components/layouts/TransactionLayoutV2';

import { useApprovalModal } from 'hooks/web3/use-has-approval';
import useTransactionParams from 'hooks/use-transaction-params';
import useWalletSession from 'hooks/web3/wallet/use-wallet-session';
import { useArtworkByContractTokenIdFromRouter } from 'hooks/queries/hasura/artworks/use-artwork-by-contract-token-id';
import {
  ArtworkSplitsByContractSlugTokenId,
  useArtworkSplitsByContractSlugTokenId,
} from 'graphql/hasura/queries/artwork-splits-by-contract-slug-token-id.generated';

import { isAnyTrue } from 'utils/helpers';
import { hasActivePrivateSale } from 'utils/artwork/artwork';
import { areKeysEqual } from 'utils/users';
import { PageType } from 'types/page';

PrivateSaleIndex.getLayout = TransactionLayoutV2({
  title: 'Create a Private Sale',
  backgroundColor: '$black5',
  pageType: PageType.minimalLoggedIn,
});

export default function PrivateSaleIndex(): JSX.Element {
  const { data: user, isLoading: isUserLoading } = useWalletSession();
  const { tokenId } = useTransactionParams();

  const { data: artworkData, isLoading: isArtworkLoading } =
    useArtworkByContractTokenIdFromRouter();

  const contractSlug = artworkData?.collection?.slug;
  const contractAddress = artworkData?.contractAddress;

  const { data: splitsData, isLoading: splitsLoading } =
    useArtworkSplitsByContractSlugTokenId(
      {
        tokenId: Number(tokenId),
        contractSlug: contractSlug,
      },
      { enabled: Boolean(tokenId) }
    );

  const hasPrivateSale = hasActivePrivateSale(artworkData);

  const { data: isApproved, isLoading: isApprovalLoading } = useApprovalModal({
    publicAddress: user?.publicAddress,
    contractAddress,
  });

  const artworkSplits = pathOr<
    ArtworkSplitsByContractSlugTokenId['artworkSplits']
  >([], ['artworkSplits'], splitsData);

  const isOwner = areKeysEqual([
    user?.publicAddress,
    artworkData?.owner?.publicKey,
  ]);

  const isLoading = isAnyTrue([
    isUserLoading,
    isArtworkLoading,
    splitsLoading,
    isApprovalLoading,
  ]);

  if (isLoading) {
    return <TransactionLoadingPage />;
  }

  if (hasPrivateSale) {
    return <PrivateSaleWarningAlreadyActive />;
  }

  if (!user) {
    return <WalletAuthBlock />;
  }

  if (!isOwner) {
    return <PrivateSaleWarningNotOwner />;
  }

  return (
    <PrivateSaleContainer
      isApproved={isApproved}
      artwork={artworkData}
      splits={artworkSplits}
    />
  );
}
