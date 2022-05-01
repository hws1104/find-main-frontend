import TwitterShareButtonLink from 'components/links/TwitterShareButtonLink';
import TransactionProgressPane from 'components/transactions/generic/TransactionProgressPane';
import { TransactionActionButtonsExternal } from '../generic/TransactionActionButtons';

import { useSocialVerificationByService } from 'hooks/queries/hasura/use-social-verification';

import { ArtworkFragmentExtended } from 'graphql/hasura/hasura-fragments.generated';
import { MarketType } from 'types/Auction';
import { SocialVerifService } from 'types/SocialVerification';

import { buildArtworkPath } from 'utils/artwork/artwork';
import {
  buildListTweet,
  buildSecondaryListTweet,
  getTwitterUsername,
} from 'utils/twitter-templates';

interface ListTransactionSuccessProps {
  artwork: ArtworkFragmentExtended;
  marketType: MarketType;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function ListTransactionSuccess(
  props: ListTransactionSuccessProps
) {
  const { artwork, marketType } = props;

  const artworkPath = buildArtworkPath({ artwork, user: artwork?.creator });

  const { data: socialVerificationData } = useSocialVerificationByService({
    publicKey: artwork?.creator?.publicKey,
    service: SocialVerifService.TWITTER,
  });

  const twitterShareText: Record<MarketType, string> = {
    primary: buildListTweet({
      artworkName: artwork?.name,
      artworkPath,
    }),
    secondary: buildSecondaryListTweet({
      artworkName: artwork?.name,
      artworkPath,
      twitterUsername: getTwitterUsername({
        socialVerifications: socialVerificationData
          ? [socialVerificationData]
          : null,
      }),
    }),
  };

  return (
    <TransactionProgressPane
      title="Your NFT has been listed!"
      description="Your NFT has been successfully listed on our marketplace."
      status="success"
      meta={
        <TransactionActionButtonsExternal
          buttons={[
            <TwitterShareButtonLink
              twitterShareText={twitterShareText[marketType]}
              key="button"
            />,
            { href: artworkPath, label: 'View NFT' },
          ]}
        />
      }
      fireConfetti={true}
    />
  );
}
