import Flex from 'components/base/Flex';
import Heading from 'components/base/Heading';
import Button from 'components/base/Button';
import Page, { PageProps } from 'components/Page';

import { ModalKey } from 'types/modal';

import useModal from 'hooks/use-modal';

interface WalletAuthBlockProps {
  pageProps?: PageProps;
}

export default function WalletAuthBlock(
  props: WalletAuthBlockProps
): JSX.Element {
  const { pageProps } = props;

  const { setCurrentModal } = useModal();

  const openAuthModal = () => {
    setCurrentModal(ModalKey.AUTH_MAIN);
  };

  if (pageProps) {
    return (
      <Page {...pageProps}>
        <Flex
          css={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <Heading
            size={5}
            css={{
              maxWidth: 380,
              marginX: 'auto',
              textAlign: 'center',
              marginBottom: '$7',
              lineHeight: 1.1,
            }}
          >
            Connect your wallet to continue.
          </Heading>
          <Button
            size="large"
            color="black"
            shape="round"
            onClick={openAuthModal}
          >
            Connect Wallet
          </Button>
        </Flex>
      </Page>
    );
  }

  return (
    <Flex
      css={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <Heading
        size={5}
        css={{
          maxWidth: 380,
          marginX: 'auto',
          textAlign: 'center',
          marginBottom: '$7',
          lineHeight: 1.1,
        }}
      >
        Connect your wallet to continue.
      </Heading>
      <Button size="large" color="black" shape="round" onClick={openAuthModal}>
        Connect Wallet
      </Button>
    </Flex>
  );
}
