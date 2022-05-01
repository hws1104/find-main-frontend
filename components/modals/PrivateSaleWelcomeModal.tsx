/* eslint-disable react/jsx-max-depth */
import ModalContainer from './common/ModalContainer';
import ModalContent from './common/ModalContent';
import Heading from 'components/base/Heading';
import Paragraph from 'components/base/Paragraph';
import Icon from 'components/Icon';
import Grid from 'components/base/Grid';
import Flex from 'components/base/Flex';
import UserTagV2 from 'components/users/UserTagV2';
import Text from 'components/base/Text';
import Button from 'components/base/Button';

import PrivateSaleIcon from 'assets/icons/private-sale.svg';

import useModal from 'hooks/use-modal';

import { UserFragment } from 'graphql/hasura/hasura-fragments.generated';
import { ModalKey } from 'types/modal';
import { notEmptyOrNil } from 'utils/helpers';

interface PrivateSaleWelcomeModalProps {
  seller: UserFragment;
  buyer: UserFragment;
}

export default function PrivateSaleWelcomeModal(
  props: PrivateSaleWelcomeModalProps
): JSX.Element {
  const { seller, buyer } = props;

  const { resetModal } = useModal();

  const hasUsername = notEmptyOrNil(buyer?.username);

  return (
    <ModalContainer modalKey={ModalKey.PRIVATE_SALE} enableCloseButton={false}>
      <ModalContent
        css={{
          maxWidth: 600,
          paddingY: '$7',
          '@bp1': {
            paddingY: '$9',
          },
        }}
      >
        <Grid
          css={{
            gap: '$7',
            '@bp1': {
              gap: '$8',
            },
          }}
        >
          <Grid css={{ gap: '$6' }}>
            <Flex css={{ marginX: 'auto' }}>
              <Icon icon={PrivateSaleIcon} width={58} height={52} />
            </Flex>

            <Heading
              tracking="tight"
              leading="tight"
              css={{
                fontSize: '$2',
                textAlign: 'center',
                '@bp1': {
                  fontSize: '$4',
                },
              }}
            >
              {hasUsername ? `Hey @${buyer?.username}!` : 'Hey!'}
            </Heading>
            <Paragraph css={{ textAlign: 'center' }}>
              You’ve been sent a private sale proposal.
              <br /> You’re only one step away from owning this NFT.
            </Paragraph>
            <Grid css={{ justifyContent: 'center', gap: '$3' }}>
              <Text
                css={{
                  color: '$black60',
                  fontFamily: '$body',
                  fontWeight: 600,
                  textAlign: 'center',
                }}
              >
                From
              </Text>
              <UserTagV2 user={seller} isLoading={false} />
            </Grid>
          </Grid>
          <Flex css={{ justifyContent: 'center' }}>
            <Button
              size="large"
              shape="round"
              color="black"
              hoverable
              css={{
                width: '100%',
                '&:focus': {
                  outline: 'none',
                },
                '@bp1': {
                  width: 330,
                },
              }}
              onClick={resetModal}
            >
              Open Proposal
            </Button>
          </Flex>
        </Grid>
      </ModalContent>
    </ModalContainer>
  );
}
