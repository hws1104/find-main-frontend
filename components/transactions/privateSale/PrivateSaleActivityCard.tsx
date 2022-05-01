/* eslint-disable max-lines */
/* eslint-disable react/jsx-max-depth */
import { isPast } from 'date-fns';

import Box from 'components/base/Box';
import Flex from 'components/base/Flex';
import ETHinUSD from 'components/ETHinUSD';
import PrivateSaleCountdown from './PrivateSaleCountdown';
import ActivityCardHorizontal, {
  ActivityCardHorizontalProps,
  ActivityCardHorizontalHeader,
} from 'components/activity/ActivityCardHorizontal';
import ActivityCardVertical, {
  ActivityCardVerticalHeader,
} from 'components/activity/ActivityCardVertical';
import ActivityButtonLink from 'components/activity/ActivityButtonLink';
import {
  ActivityMetaPrimary,
  ActivityMetaTitle,
} from 'components/activity/ActivityMetaPrimary';
import UserTagInline from 'components/users/UserTagInline';

import { BasicArtwork } from 'types/Artwork';
import { ActivityCardProps } from 'components/activity/types';

import { buildSellerPrivateSalePath } from 'utils/artwork/artwork';
import { formatETHWithSuffix } from 'utils/formatters';

import { PrivateSaleFragment } from 'graphql/hasura/hasura-fragments.generated';

interface BidActivityCardProps {
  privateSale: PrivateSaleFragment;
  artwork: BasicArtwork;
  type?: 'sent' | 'received';
}

export default function PrivateSaleActivityCard(
  props: BidActivityCardProps
): JSX.Element {
  const { privateSale, artwork, type } = props;

  const isBuying = type === 'received';

  if (!artwork) {
    return null;
  }

  const privateSalePath = isBuying
    ? `/sale/${privateSale?.ipfsPath}?hide-welcome=true`
    : buildSellerPrivateSalePath({
        user: privateSale?.seller,
        artwork,
      });

  const saleRecipient = isBuying ? privateSale?.seller : privateSale?.buyer;

  const isExpired = isPast(new Date(`${privateSale?.deadlineAt}Z`));

  const activityCardProps: ActivityCardProps = {
    headerSection: <ActivityCardVerticalHeader artwork={artwork} />,
    priceSection: (
      <Box>
        <ActivityMetaTitle css={{ marginBottom: '$4' }}>
          {isBuying ? 'Owner' : 'Collector'}
        </ActivityMetaTitle>
        <UserTagInline user={saleRecipient} />
      </Box>
    ),
    countdownSection: (
      <Box>
        <ActivityMetaTitle>
          {isExpired ? 'Expired on' : 'Expires in'}
        </ActivityMetaTitle>
        <PrivateSaleCountdown timestamp={privateSale?.deadlineAt} />
      </Box>
    ),
    actionSection: (
      <Flex expandVertical>
        <Box css={{ marginBottom: '$4' }}>
          <ActivityMetaPrimary
            title="Price"
            value={formatETHWithSuffix(privateSale.price)}
            label={<ETHinUSD amount={privateSale.price} />}
          />
        </Box>
        <Flex expandVertical css={{ justifyContent: 'flex-end' }}>
          <ActivityButtonLink href={privateSalePath} color="black">
            View Private Sale
          </ActivityButtonLink>
        </Flex>
      </Flex>
    ),
  };

  const activityCardHorizontalProps: ActivityCardHorizontalProps = {
    ...activityCardProps,
    headerSection: <ActivityCardHorizontalHeader artwork={artwork} />,
    artwork,
    title: artwork.name,
    creator: artwork.creator,
  };

  return (
    <>
      <ActivityCardVertical {...activityCardProps} />
      <ActivityCardHorizontal {...activityCardHorizontalProps} />
    </>
  );
}
