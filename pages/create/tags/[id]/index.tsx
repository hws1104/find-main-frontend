import { any } from 'ramda';
import { useRouter } from 'next/router';

import useWalletSession from 'hooks/web3/wallet/use-wallet-session';
import useUserModerationState from 'hooks/queries/hasura/use-user-moderation-state';

import { useSuggestedTags } from 'graphql/server/queries/suggested-tags.generated';
import { useArtworkByUuid } from 'graphql/hasura/queries/artwork-by-uuid.generated';

import TransactionLayoutWithCardV2 from 'components/layouts/TransactionLayoutWithCardV2';
import TransactionWarningBlock from 'components/trust-safety/TransactionWarningBlock';
import TransactionLoadingPage from 'components/transactions/TransactionLoadingPage';
import WalletAuthBlock from 'components/auth/WalletAuthBlock';
import TagsTransaction from 'components/transactions/tags/TagsTransaction';
import { formatTagOptions } from 'components/transactions/tags/TagsTextarea';

import { PageType } from 'types/page';

import { buildArtworkListPath, buildArtworkPath } from 'utils/artwork/artwork';
import { getFirstValue, notEmptyOrNil } from 'utils/helpers';

TagsPage.getLayout = TransactionLayoutWithCardV2({
  title: 'Mint an NFT',
  backgroundColor: '$black5',
  pageType: PageType.minimalLoggedIn,
  artworkQueryType: 'uuid',
});

export default function TagsPage(): JSX.Element {
  const router = useRouter();

  const artworkUuid = getFirstValue(router.query.id);

  const { data: user, isLoading: isUserLoading } = useWalletSession();

  const { data: suggestedTags } = useSuggestedTags();

  const options = formatTagOptions(suggestedTags?.getSuggestedTags ?? []);

  const publicAddress = user?.publicAddress;

  const { data: artworkData, isLoading: isServerArtworkLoading } =
    useArtworkByUuid({ id: artworkUuid }, { enabled: Boolean(artworkUuid) });

  const artwork = artworkData?.artwork;
  const tags = artwork?.tags;
  const hasTags = notEmptyOrNil(tags);

  const {
    isUserModerated,
    isLoading: isModerationStateLoading,
    moderationStatus,
  } = useUserModerationState(publicAddress);

  const loadingStates = [
    isUserLoading,
    isServerArtworkLoading,
    isModerationStateLoading,
  ];

  const isLoading = any(Boolean, loadingStates);

  const isInCreatorFlow = !router.query.redirect;

  const artworkPath = buildArtworkPath({ artwork, user: artwork?.creator });

  const listArtworkPath = buildArtworkListPath(artwork, 'primary');

  if (isLoading) {
    return <TransactionLoadingPage />;
  }

  if (!user) {
    return <WalletAuthBlock />;
  }

  if (isUserModerated) {
    return <TransactionWarningBlock moderationStatus={moderationStatus} />;
  }

  return (
    <TagsTransaction
      isInCreatorFlow={isInCreatorFlow}
      title={hasTags ? 'Edit tags' : 'Add tags'}
      artwork={artwork}
      // if coming via the profile we redirect back there
      listArtworkPath={isInCreatorFlow ? listArtworkPath : artworkPath}
      options={options}
    />
  );
}
