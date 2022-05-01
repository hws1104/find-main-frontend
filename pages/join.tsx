/* eslint-disable react/jsx-max-depth */
import { styled } from 'stitches.config';
import { useRouter } from 'next/router';
import { isNil } from 'ramda';
import NextLink from 'next/link';
import { useEffect } from 'react';

import Page from 'components/Page';
import Box from 'components/base/Box';
import Button from 'components/base/Button';
import Flex from 'components/base/Flex';
import Grid from 'components/base/Grid';
import Heading from 'components/base/Heading';
import Text from 'components/base/Text';
import LoadingButton from 'components/buttons/LoadingButton';
import Link from 'components/base/Link';
import LoadingPage from 'components/LoadingPage';
import ConnectWalletButton from 'components/headers/ConnectWalletButton';

import useModal from 'hooks/use-modal';
import useWalletSession from 'hooks/web3/wallet/use-wallet-session';
import { useRedeemInviteCode } from 'graphql/server/mutations/redeem-invite-code.generated';
import { useInviteCode } from 'graphql/server/queries/invite-code.generated';

import { PageType } from 'types/page';
import { ModalKey } from 'types/modal';

import {
  getFirstValue,
  isAllTrue,
  isAnyTrue,
  notEmptyOrNil,
} from 'utils/helpers';

export default function MetaMaskLoginWithCode(): JSX.Element {
  const router = useRouter();

  const { setCurrentModal } = useModal();

  const openAuthModal = () => {
    setCurrentModal(ModalKey.AUTH_MAIN);
  };

  const inviteCode = getFirstValue(router.query.code);

  // Note: If the user isn't logged in, we don't want to use this hook
  // but instead we do the mutation directly when they do successfully connect
  // their wallet.
  const { data: user, isLoading: isUserLoading } = useWalletSession();

  const { data: inviteCodeData, error: inviteCodeError } = useInviteCode(
    { inviteCode },
    { enabled: Boolean(user) }
  );

  // so that we don't have to pass through the invite inviteCode
  // to an authed screen that will use it in the
  const { mutateAsync: redeemInvite, isLoading } = useRedeemInviteCode({
    onSuccess: async (res) => {
      console.log('useRedeemInviteCode onSuccess', res);
      await router.push('/profile');
    },
  });

  const canRedeemInvite = isAllTrue([user, inviteCode]);

  useEffect(
    () => {
      if (canRedeemInvite) {
        redeemInvite({ inviteCode });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [canRedeemInvite]
  );

  const inviteCodeObject = inviteCodeData?.inviteCode;
  const redeemedAt = inviteCodeObject?.redeemedAt;

  const isError = isAnyTrue([notEmptyOrNil(redeemedAt), inviteCodeError]);
  const codeIsUsable = isAllTrue([inviteCode, isNil(redeemedAt), user]);

  if (isUserLoading || isLoading) {
    return (
      <Page title="Accept Invite" type={PageType.minimal}>
        <LoadingPage />
      </Page>
    );
  }

  if (!user) {
    return (
      <Page title="Accept Invite" type={PageType.minimal}>
        <Container>
          <GridContainer>
            <Grid css={{ gap: '$8' }}>
              <Heading size={5}>Connect your wallet to accept invite</Heading>
              <Flex css={{ justifyContent: 'center' }}>
                <ConnectWalletButton />
              </Flex>
            </Grid>
          </GridContainer>
        </Container>
      </Page>
    );
  }

  // If user is logged in and the invite code is valid
  // use hook that returns mutation function
  // and call that in a useEffect

  if (isError) {
    return (
      <Page title="Accept Invite" type={PageType.minimal}>
        <Container>
          <GridContainer>
            <Grid css={{ gap: '$8' }}>
              <Heading size={5}>
                This invite code has already been used.
              </Heading>
              <NextLink href="/" passHref>
                <Link
                  css={{
                    display: 'block',
                    maxWidth: 300,
                    width: '100%',
                    marginX: 'auto',
                  }}
                >
                  <Button
                    size="large"
                    shape="regular"
                    color="black"
                    css={{ width: '100%' }}
                  >
                    Back home
                  </Button>
                </Link>
              </NextLink>
            </Grid>
          </GridContainer>
        </Container>
      </Page>
    );
  }

  if (codeIsUsable) {
    return (
      <Page title="Accept Invite" type={PageType.minimal}>
        <Container>
          <GridContainer>
            <Grid css={{ gap: '$7' }}>
              <Grid css={{ gap: '$6' }}>
                <Heading size={5}>Become a creator on Foundation</Heading>
                <Text
                  css={{ textAlign: 'center', maxWidth: 380, marginX: 'auto' }}
                >
                  You’ve been invited to join Foundation as a creator. We can’t
                  wait to see what you create.
                </Text>
              </Grid>
              <Box css={{ maxWidth: 300, width: '100%', marginX: 'auto' }}>
                <LoadingButton
                  onClick={() => redeemInvite({ inviteCode })}
                  isLoading={isLoading}
                >
                  Accept Invite
                </LoadingButton>
              </Box>
            </Grid>
          </GridContainer>
        </Container>
      </Page>
    );
  }

  return (
    <Page title="Accept Invite" type={PageType.minimal}>
      <Container>
        <Grid css={{ gap: '$8' }}>
          <GridContainer>
            <Heading size={5}>Become a creator on Foundation</Heading>
            <Text css={{ textAlign: 'center', maxWidth: 380, marginX: 'auto' }}>
              You’ve been invited to join Foundation as a creator. We can’t wait
              to see what you create.
            </Text>
          </GridContainer>

          <Grid css={{ gap: '$4', maxWidth: 300, marginX: 'auto' }}>
            <Heading size={2} css={{ textAlign: 'center' }}>
              Connect your wallet to join
            </Heading>
            <Button
              size="large"
              color="white"
              shape="regular"
              onClick={openAuthModal}
            >
              Connect Wallet
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}

const Container = styled(Flex, {
  paddingTop: '$8',
  paddingBottom: '$11',
  margin: 'auto',
});

const GridContainer = styled(Grid, {
  maxWidth: 440,
  marginX: 'auto',
  textAlign: 'center',
  gap: '$6',
});
