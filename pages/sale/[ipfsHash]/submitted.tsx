import React from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { BigNumber } from '@ethersproject/bignumber';

import { styled } from 'stitches.config';

import useIsWrongNetwork from 'hooks/web3/use-is-wrong-network';
import useWalletSession from 'hooks/web3/wallet/use-wallet-session';
import useUserByPublicKey from 'hooks/queries/use-user-by-public-key';
import useReadOnlyProvider from 'hooks/web3/use-read-only-provider';
import useSocialVerifications from 'hooks/queries/hasura/use-social-verifications';
import useContractEventHandler from 'hooks/web3/transactions/use-contract-event-handler';
import usePrivateSaleByIpfs from 'hooks/queries/hasura/use-private-sale-by-ipfs';
import useArtworkByContractTokenId from 'hooks/queries/hasura/artworks/use-artwork-by-contract-token-id';
import useEventByTransactionHash from 'hooks/queries/hasura/events/use-event-by-transaction-hash';

import Flex from 'components/base/Flex';
import MetaMaskError from 'components/auth/MetaMaskError';
import SettleCollectorAction from 'components/transactions/settle/SettleCollectorAction';
import TransactionContent from 'components/transactions/TransactionContent';
import TransactionHashLink from 'components/transactions/TransactionHashLink';
import ConfettiCanvas from 'components/ConfettiCanvas';
import TransactionPendingState from 'components/transactions/TransactionPendingState';
import TransactionContainerV2 from 'components/transactions/TransactionContainerV2';
import TransactionLayoutV2 from 'components/layouts/TransactionLayoutV2';

import { getNFTMarketContractToRead } from 'lib/contracts';

import { buildClaimTweet, getTwitterUsername } from 'utils/twitter-templates';
import {
  getFirstValue,
  getUsernameOrAddress,
  isAllTrue,
  isAnyTrue,
} from 'utils/helpers';

import { PageType } from 'types/page';

const FlexMobileCenter = styled(Flex, {
  justifyContent: 'center',
  '@bp1': {
    justifyContent: 'flex-start',
  },
});

PrivateSaleSubmitted.getLayout = TransactionLayoutV2({
  title: 'Private Sale Accepted',
  backgroundColor: '$black5',
  pageType: PageType.minimalLoggedIn,
});

export default function PrivateSaleSubmitted(): JSX.Element {
  const { data: user, isLoading: isUserLoading } = useWalletSession();

  const router = useRouter();

  const publicAddress = user?.publicAddress;

  const { data: userData, isLoading: userLoading } = useUserByPublicKey(
    { publicKey: publicAddress },
    { refetchOnWindowFocus: false }
  );

  const [isEventEmitted, setIsEventEmitted] = useContractEventHandler();

  // here the ipfsHash param is the tokenId
  // we don’t need the ipfsHash for the submitted page
  const ipfsHash = getFirstValue(router.query.ipfsHash);
  const txHash = getFirstValue(router.query.txHash);

  const { data: privateSaleData, isLoading: privateSaleLoading } =
    usePrivateSaleByIpfs({ ipfsHash }, { refetchInterval: 5000 });

  const artwork = privateSaleData?.artwork;
  const artworkCreator = artwork?.creator;
  const artworkCreatorName = artworkCreator?.name ?? artworkCreator?.username;
  const tokenId = artwork?.tokenId;
  const contractSlug = privateSaleData?.artwork?.collection?.slug;
  const contractAddress = privateSaleData?.artwork?.contractAddress;

  const { data: artworkData, isLoading: isArtworkLoading } =
    useArtworkByContractTokenId({
      contractSlug: contractSlug,
      tokenId,
    });

  const hasSoldAt = Boolean(privateSaleData?.soldAt);

  const isWrongNetwork = useIsWrongNetwork();

  const { provider } = useReadOnlyProvider();

  const nftMarket = getNFTMarketContractToRead(provider);

  const { data: socialVerificationsData } = useSocialVerifications({
    publicKey: artwork?.creator?.publicKey,
  });

  const twitterShareText = buildClaimTweet({
    artworkName: artwork?.name,
    creatorName: artworkCreatorName,
    usernameOrAddress: getUsernameOrAddress(userData?.user),
    twitterUsername: getTwitterUsername(socialVerificationsData),
  });

  const canFireContractEvent = isAllTrue([
    router.isReady,
    nftMarket,
    tokenId,
    contractAddress,
  ]);

  useEventByTransactionHash(
    { transactionHash: txHash },
    { onSuccess: (res) => setIsEventEmitted(Boolean(res)) }
  );

  useEffect(
    () => {
      if (canFireContractEvent) {
        nftMarket.once(
          nftMarket.filters.PrivateSaleFinalized(
            contractAddress,
            BigNumber.from(tokenId),
            null,
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
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [canFireContractEvent, setIsEventEmitted]
  );

  if (isWrongNetwork) {
    return <MetaMaskError />;
  }

  const isLoading = isAnyTrue([
    !user,
    !router.isReady,
    !isEventEmitted,
    !hasSoldAt,
    isUserLoading,
    userLoading,
    privateSaleLoading,
    isArtworkLoading,
  ]);

  if (isLoading) {
    return (
      <TransactionContainerV2 artwork={artworkData}>
        <TransactionContent
          title="Confirming private sale…"
          description="Once confirmed on the blockchain, the NFT will be added to your collection."
        >
          <TransactionPendingState txHash={txHash} />
        </TransactionContent>
      </TransactionContainerV2>
    );
  }

  return (
    <>
      <ConfettiCanvas fireConfetti={isEventEmitted} />
      <TransactionContainerV2 artwork={artworkData}>
        <TransactionContent
          title="This NFT is now in your collection!"
          description="Congratulations! You’ve completed the private sale, and the NFT is now in your collection."
        >
          <SettleCollectorAction
            twitterShareText={twitterShareText}
            user={userData?.user}
          />
          <FlexMobileCenter>
            <TransactionHashLink txHash={txHash} />
          </FlexMobileCenter>
        </TransactionContent>
      </TransactionContainerV2>
    </>
  );
}
