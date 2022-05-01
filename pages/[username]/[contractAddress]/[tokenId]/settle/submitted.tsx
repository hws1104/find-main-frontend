/* eslint-disable max-lines */
/* eslint-disable react/jsx-max-depth */
import { useEffect } from 'react';
import { BigNumber } from '@ethersproject/bignumber';

import useIsWrongNetwork from 'hooks/web3/use-is-wrong-network';
import useWalletSession from 'hooks/web3/wallet/use-wallet-session';
import useUserByPublicKey from 'hooks/queries/use-user-by-public-key';
import useReadOnlyProvider from 'hooks/web3/use-read-only-provider';
import useSocialVerifications from 'hooks/queries/hasura/use-social-verifications';
import useAddUsernamePrefix from 'hooks/use-add-username-prefix';
import useContractEventHandler from 'hooks/web3/transactions/use-contract-event-handler';
import { useArtworkByContractTokenIdFromRouter } from 'hooks/queries/hasura/artworks/use-artwork-by-contract-token-id';
import useTransactionParams from 'hooks/use-transaction-params';
import useEventByTransactionHash from 'hooks/queries/hasura/events/use-event-by-transaction-hash';

import Grid from 'components/base/Grid';
import Flex from 'components/base/Flex';
import Box from 'components/base/Box';

import MetaMaskError from 'components/auth/MetaMaskError';
import { WrappedTransactionLayoutWithCard } from 'components/layouts/TransactionLayoutWithCard';
import SettleCreatorAction from 'components/transactions/settle/SettleCreatorAction';
import SettleCollectorAction from 'components/transactions/settle/SettleCollectorAction';
import TransactionContent from 'components/transactions/TransactionContent';
import TransactionHashLink from 'components/transactions/TransactionHashLink';
import ConfettiCanvas from 'components/ConfettiCanvas';
import TransactionPendingState from 'components/transactions/TransactionPendingState';

import { getNFTMarketContractToRead } from 'lib/contracts';
import { CREATOR_FEE_MULTIPLIER } from 'lib/constants';

import { getUsernameOrAddress, isAnyTrue } from 'utils/helpers';
import {
  getMostRecentAuction,
  isArtworkAuctionWinner,
} from 'utils/auctions/auctions';
import { formatETHWithSuffix } from 'utils/formatters';
import { buildClaimTweet, getTwitterUsername } from 'utils/twitter-templates';
import { areKeysEqual } from 'utils/users';

import { useArtworkSplitsByContractSlugTokenId } from 'graphql/hasura/queries/artwork-splits-by-contract-slug-token-id.generated';

SettleAuction.getLayout = WrappedTransactionLayoutWithCard({
  title: 'Auction settled',
});

export default function SettleAuction(): JSX.Element {
  // If the username is missing the @ prefix add it into the url
  useAddUsernamePrefix();

  const { data: user, isLoading: isUserLoading } = useWalletSession();

  const publicAddress = user?.publicAddress;

  const { data: userData, isLoading: userLoading } = useUserByPublicKey(
    { publicKey: publicAddress },
    { refetchOnWindowFocus: false }
  );

  const [isEventEmitted, setIsEventEmitted] = useContractEventHandler();

  const { tokenId, txHash } = useTransactionParams();

  const { data: artworkData, isLoading: serverArtworkLoading } =
    useArtworkByContractTokenIdFromRouter();

  const { data: socialVerificationsData } = useSocialVerifications({
    publicKey: artworkData?.creator?.publicKey,
  });

  const contractSlug = artworkData?.collection?.slug;

  const { data: artworkSplitsData, isLoading: artworkSplitsLoading } =
    useArtworkSplitsByContractSlugTokenId({
      tokenId: Number(tokenId),
      contractSlug: contractSlug,
    });

  const isWrongNetwork = useIsWrongNetwork();

  const isLoading = isAnyTrue([
    isUserLoading,
    !user,
    userLoading,
    serverArtworkLoading,
    artworkSplitsLoading,
  ]);

  const { provider } = useReadOnlyProvider();

  const nftMarket = getNFTMarketContractToRead(provider);

  const shares = artworkSplitsData?.artworkSplits;

  const shareForThisUser = shares?.find((share) =>
    areKeysEqual([share?.user?.publicKey, publicAddress])
  );

  const percentSplitForThisUser = shareForThisUser?.sharePercent;

  const mostRecentActiveAuction = getMostRecentAuction(artworkData);
  const auctionId = mostRecentActiveAuction?.auctionId;

  const isAuctionCollector = isArtworkAuctionWinner(
    publicAddress,
    mostRecentActiveAuction
  );

  const artwork = artworkData;
  const artworkCreator = artwork?.creator;
  const artworkCreatorName = artworkCreator?.name ?? artworkCreator?.username;

  const twitterShareText = buildClaimTweet({
    artworkName: artwork?.name,
    creatorName: artworkCreatorName,
    usernameOrAddress: getUsernameOrAddress(userData?.user),
    twitterUsername: getTwitterUsername(socialVerificationsData),
  });

  useEventByTransactionHash(
    { transactionHash: txHash },
    { onSuccess: (res) => setIsEventEmitted(Boolean(res)) }
  );

  useEffect(() => {
    if (nftMarket && auctionId) {
      nftMarket.once(
        nftMarket.filters.ReserveAuctionFinalized(
          BigNumber.from(auctionId),
          null,
          null,
          null,
          null,
          null
        ),
        () => {
          // setIsEventEmitted(true)
        }
      );
    }
  }, [nftMarket, auctionId, setIsEventEmitted]);

  if (isWrongNetwork) {
    return <MetaMaskError />;
  }

  const isLoadingState = !isEventEmitted || isLoading;

  // when loading and in the collector context
  if (isLoadingState) {
    return (
      <TransactionContent
        title="This auction is being settled."
        description="This auction is being settled on the Ethereum blockchain. You’re free to leave this page if you like."
      >
        <TransactionPendingState txHash={txHash} />
      </TransactionContent>
    );
  }

  // success in the collector context
  if (isAuctionCollector) {
    return (
      <>
        <ConfettiCanvas fireConfetti={isEventEmitted} />
        <TransactionContent
          title="This NFT is now in your collection!"
          description="This auction has been successfully settled on the Ethereum blockchain, and the NFT is now in your collection."
        >
          <SettleCollectorAction
            twitterShareText={twitterShareText}
            user={userData?.user}
          />
          <Flex
            css={{
              justifyContent: 'center',
              '@bp1': { justifyContent: 'flex-start' },
            }}
          >
            <TransactionHashLink txHash={txHash} />
          </Flex>
        </TransactionContent>
      </>
    );
  }

  const winningBid = mostRecentActiveAuction?.highestBidAmount;

  const amountPaid = percentSplitForThisUser
    ? formatETHWithSuffix(
        (winningBid *
          CREATOR_FEE_MULTIPLIER *
          Number(percentSplitForThisUser)) /
          100
      )
    : formatETHWithSuffix(winningBid * CREATOR_FEE_MULTIPLIER);

  const creatorSuccessCopy = percentSplitForThisUser
    ? `This auction has been successfully settled on the Ethereum blockchain, and your share of ${percentSplitForThisUser}% has been sent to your wallet.`
    : `This auction has been successfully settled on the Ethereum blockchain, and the ETH has been sent to your wallet.`;

  // success in the creator context
  return (
    <>
      <ConfettiCanvas fireConfetti={isEventEmitted} />
      <TransactionContent
        title={
          <Grid css={{ gap: '$4' }}>
            You just got paid!
            <br />
            <Box css={{ display: 'inline', color: '$green100' }}>
              +{amountPaid}
            </Box>
          </Grid>
        }
        description={creatorSuccessCopy}
      >
        <SettleCreatorAction user={userData?.user} />
        <Flex
          css={{
            justifyContent: 'center',
            '@bp1': { justifyContent: 'flex-start' },
          }}
        >
          <TransactionHashLink txHash={txHash} />
        </Flex>
      </TransactionContent>
    </>
  );
}
