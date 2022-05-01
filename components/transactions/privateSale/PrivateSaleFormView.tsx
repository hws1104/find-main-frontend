/* eslint-disable max-lines */
/* eslint-disable react/jsx-max-depth */
import { styled } from 'stitches.config';
import { useField, useFormikContext } from 'formik';
import Toggle from 'react-toggle';
import { curry, partition, prepend } from 'ramda';

import Box from 'components/base/Box';
import Flex from 'components/base/Flex';
import Text from 'components/base/Text';
import ExternalLink from 'components/links/ExternalLink';
import ETHField from 'components/forms/fields/ETHField';
import ETHinUSDField from 'components/forms/fields/ETHinUSDField';
import UserSearch from 'components/forms/fields/UserSearch';
import UserSearchResult from 'components/forms/fields/UserSearchResult';
import TextAreaField from 'components/forms/fields/TextAreaField';
import CharacterCounter from 'components/forms/CharacterCounter';
import Button from 'components/base/Button';
import TransactionSection from 'components/transactions/TransactionSection';
import ItemisedTable, { ItemisedItem } from 'components/ItemisedTable';
import TransactionHeading from 'components/transactions/TransactionHeading';

import useWalletSession from 'hooks/web3/wallet/use-wallet-session';
import useUserByPublicKey from 'hooks/queries/use-user-by-public-key';
import { ArtworkSplitsByContractSlugTokenId } from 'graphql/hasura/queries/artwork-splits-by-contract-slug-token-id.generated';

import { formatETHRounded } from 'utils/formatters';
import { getUsernameOrTruncatedAddress, notEmptyOrNil } from 'utils/helpers';
import { areKeysEqual } from 'utils/users';

const getFeeFn = curry((price, percent) =>
  formatETHRounded((Number(price) / 100) * percent)
);

const BodyText = styled(Text, {
  fontFamily: '$body',
  lineHeight: 1.8,
  maxWidth: 410,
});

interface PrivateSaleFormViewProps {
  onContinueClick: () => void;
  isSecondarySale: boolean;
  splits: ArtworkSplitsByContractSlugTokenId['artworkSplits'];
}

export default function PrivateSaleFormView(
  props: PrivateSaleFormViewProps
): JSX.Element {
  const { onContinueClick, isSecondarySale, splits } = props;

  const { data: user } = useWalletSession();
  const publicAddress = user?.publicAddress;

  const { isValid, dirty } = useFormikContext();

  const [buyerAddressField, , helpers] = useField('buyerAddress');
  const [priceField] = useField('price');
  const [personalMessageToggle] = useField('enablePersonalMessage');

  const isBuyerSet = notEmptyOrNil(buyerAddressField.value);
  const hasSplits = notEmptyOrNil(splits);

  const { data: userData } = useUserByPublicKey(
    { publicKey: buyerAddressField.value },
    { refetchOnWindowFocus: false, refetchOnMount: false }
  );

  // split the splits into two arrays based on whether the splits
  // belong to the current user
  const [currentUserSplits, userSplits] = partition(
    (split) => areKeysEqual([split.publicKey, publicAddress]),
    splits
  );

  // if the user isn’t in our db, provide a fallback
  const fallbackUser = { publicKey: buyerAddressField.value };

  const serviceFeePercent = isSecondarySale ? 5 : 15;

  const serviceFeeMultiplier = isSecondarySale ? 0.95 : 0.85;

  const getFeeByPercent = getFeeFn(priceField.value);
  const getSplitFee = getFeeFn(Number(priceField.value) * serviceFeeMultiplier);

  const serviceFee = getFeeByPercent(serviceFeePercent);

  const itemisedItems: ItemisedItem[] = [
    {
      label: `Service fee (${serviceFeePercent}%)`,
      value: `${serviceFee} ETH`,
    },
    {
      label: `You'll receive`,
      value: `${getFeeByPercent(85)} ETH`,
      type: 'total',
    },
  ];

  const secondaryItems = prepend(
    {
      label: 'Creator royalty (10%)',
      value: `${getFeeByPercent(10)} ETH`,
    },
    itemisedItems
  );

  const itemsWithSplits: ItemisedItem[] = [
    {
      label: `Service fee (${serviceFeePercent}%)`,
      value: `${serviceFee} ETH`,
    },
    ...userSplits.map((split) => ({
      label: `Split with ${getUsernameOrTruncatedAddress(split.user)} (${
        split.sharePercent
      }%)`,
      value: `${getSplitFee(split.sharePercent)} ETH`,
    })),
    ...currentUserSplits.map((split) => ({
      label: `You’ll receive (${split.sharePercent}%)`,
      value: `${getSplitFee(split.sharePercent)} ETH`,
      type: 'total',
    })),
  ];

  return (
    <>
      <TransactionSection
        css={{
          borderBottom: '1px solid $black10',
          paddingBottom: '$8',
        }}
      >
        <TransactionHeading>Create a private sale</TransactionHeading>
        <BodyText css={{ marginBottom: '$4' }}>
          By creating a private sale, you can sell your NFT directly to a
          collector without listing it for auction.
        </BodyText>
        <ExternalLink
          rel="noopener noreferrer"
          target="_blank"
          href="https://help.foundation.app/en/collections/3094229-private-sales"
        >
          Learn how private sales work.
        </ExternalLink>
      </TransactionSection>
      <TransactionSection
        css={{
          borderBottom: '1px solid $black10',
          paddingBottom: '$8',
          paddingTop: '$8',
        }}
      >
        <TransactionHeading
          css={{ fontSize: '$3', letterSpacing: -0.2, marginBottom: '$4' }}
        >
          Who are you selling this NFT to?
        </TransactionHeading>
        <BodyText css={{ marginBottom: '$4' }}>
          Private sales can only be accepted by the collector you select at this
          step.
        </BodyText>
        {userData && isBuyerSet ? (
          <UserSearchResult
            user={userData?.user ?? fallbackUser}
            onRemove={() => helpers.setValue('')}
          />
        ) : (
          <UserSearch name="buyerAddress" publicAddress={publicAddress} />
        )}
      </TransactionSection>

      <TransactionSection
        css={{
          borderBottom: '1px solid $black10',
          paddingBottom: '$9',
          paddingTop: '$9',
        }}
      >
        <TransactionHeading size="small">Set your price</TransactionHeading>
        <ETHField placeholder="" name="price" />
        <Text
          css={{
            fontFamily: '$body',
            fontWeight: 600,
            color: '$black60',
            marginTop: '$3',
            marginBottom: '$8',
          }}
        >
          <ETHinUSDField name="price" />
        </Text>

        <ItemisedTable
          items={
            isSecondarySale
              ? secondaryItems
              : hasSplits
              ? itemsWithSplits
              : itemisedItems
          }
        />
      </TransactionSection>
      <TransactionSection
        css={{
          borderBottom: '1px solid $black10',
          paddingBottom: '$8',
          paddingTop: '$8',
        }}
      >
        <Flex>
          <Box>
            <TransactionHeading size="small">
              Add a personal message
            </TransactionHeading>
            <BodyText>
              Send a short message that the collector will see when they receive
              your private sale proposal.
            </BodyText>
          </Box>
          <Box css={{ marginLeft: 'auto' }}>
            <Toggle
              {...personalMessageToggle}
              value={personalMessageToggle.name}
              checked={personalMessageToggle.value}
            />
          </Box>
        </Flex>
        {personalMessageToggle.value && (
          <Box css={{ paddingTop: '$4' }}>
            <TextAreaField placeholder="" name="personalMessage" rows={4} />
            <CharacterCounter name="personalMessage" maxLength={200} />
          </Box>
        )}
      </TransactionSection>
      <TransactionSection css={{ paddingTop: '$7' }}>
        <Button
          type="button"
          size="large"
          color={!dirty || !isValid ? 'gray' : 'black'}
          shape="regular"
          disabled={!dirty || !isValid}
          css={{ width: '100%' }}
          onClick={onContinueClick}
        >
          Continue
        </Button>
      </TransactionSection>
    </>
  );
}
