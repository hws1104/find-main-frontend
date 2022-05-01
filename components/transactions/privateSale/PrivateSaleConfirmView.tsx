/* eslint-disable max-lines */
/* eslint-disable react/jsx-max-depth */
import { styled } from 'stitches.config';
import { useFormikContext } from 'formik';
import Link from 'next/link';

import Box from 'components/base/Box';
import Flex from 'components/base/Flex';
import Text from 'components/base/Text';
import Button from 'components/base/Button';
import ETHinUSDField from 'components/forms/fields/ETHinUSDField';
import UserTagV2 from 'components/users/UserTagV2';
import FormikSubmitButton from 'components/forms/FormikSubmitButton';
import FollowPopover from 'components/follows/FollowPopover';
import FieldHeading from 'components/forms/FieldHeading';
import TransactionSection from 'components/transactions/TransactionSection';
import TransactionHeading from 'components/transactions/TransactionHeading';

import useUserByPublicKey from 'hooks/queries/use-user-by-public-key';

import { formatETHRounded } from 'utils/formatters';
import { buildUserProfilePath } from 'utils/artwork/artwork';
import { publicKeyOrIdOrAddress } from 'utils/helpers';

import { PrivateSaleFormValues } from './types';

const BodyText = styled(Text, { fontFamily: '$body', lineHeight: 1.8 });

const EditButton = styled(Button, {
  backgroundColor: 'transparent',
  color: '$black60',
  fontSize: '$2',
  marginBottom: '$6',
  paddingX: 0,
  '@hover': {
    '&:hover': {
      color: '$black100',
    },
  },
});

interface PrivateSaleConfirmViewProps {
  onEditClick: (arg: boolean) => void;
}

export default function PrivateSaleConfirmView(
  props: PrivateSaleConfirmViewProps
): JSX.Element {
  const { onEditClick } = props;

  const { values } = useFormikContext<PrivateSaleFormValues>();

  const { data: userData, isLoading: userLoading } = useUserByPublicKey(
    { publicKey: values.buyerAddress },
    { refetchOnWindowFocus: false, refetchOnMount: false }
  );

  // if the user isn’t in our db, provide a fallback
  const fallbackUser = { publicKey: values.buyerAddress };
  const buyerUser = userData?.user ?? fallbackUser;

  return (
    <>
      <TransactionSection css={{ paddingBottom: '$5', position: 'relative' }}>
        <TransactionHeading css={{ maxWidth: 320 }}>
          Confirm your private sale details
        </TransactionHeading>
        <BodyText css={{ marginBottom: '$4', maxWidth: 380 }}>
          Make sure the price and recipient are correct. Once submitted, the
          collector will have 24 hours to accept the sale price before your
          proposal expires.
        </BodyText>

        <EditButton onClick={() => onEditClick(false)}>Edit details</EditButton>
      </TransactionSection>

      <TransactionSection
        css={{
          display: 'flex',
          paddingBottom: '$6',
        }}
      >
        <Box css={{ borderRight: '1px solid $black5', paddingRight: '$8' }}>
          <FieldHeading>Collector</FieldHeading>
          <Flex css={{ alignItems: 'center' }}>
            <Link href={buildUserProfilePath({ user: buyerUser })} passHref>
              <a
                style={{ textDecoration: 'none' }}
                target="_blank"
                rel="noreferrer"
              >
                <FollowPopover publicKey={publicKeyOrIdOrAddress(buyerUser)}>
                  <UserTagV2
                    user={buyerUser}
                    isLoading={userLoading}
                    hoverable
                  />
                </FollowPopover>
              </a>
            </Link>
          </Flex>
        </Box>

        <Box css={{ paddingLeft: '$8' }}>
          <FieldHeading>Price</FieldHeading>
          <TransactionHeading css={{ marginBottom: '$2', paddingRight: 0 }}>
            {formatETHRounded(Number(values.price))} ETH
          </TransactionHeading>
          <Text
            css={{
              fontFamily: '$body',
              fontWeight: 600,
              color: '$black60',
            }}
          >
            <ETHinUSDField name="price" />
          </Text>
        </Box>
      </TransactionSection>

      {values.enablePersonalMessage && (
        <TransactionSection>
          <FieldHeading>Message</FieldHeading>
          <Box
            css={{
              fontFamily: '$body',
              fontSize: '$1',
              background: '$black5',
              borderRadius: '$3',
              whiteSpace: 'pre-wrap',
              paddingX: '$5',
              paddingY: '$4',
            }}
          >
            {values.personalMessage}
          </Box>
        </TransactionSection>
      )}

      <TransactionSection css={{ paddingTop: '$6' }}>
        <FormikSubmitButton
          label="Confirm Private Sale"
          submittingLabel="Sign message via wallet..."
          submittedLabel="Confirmed"
        />
      </TransactionSection>
    </>
  );
}
