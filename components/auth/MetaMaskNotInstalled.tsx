import Grid from 'components/base/Grid';
import Button from 'components/base/Button';

import ModalCopy from 'components/modals/common/ModalCopy';
import ModalHeading from 'components/modals/common/ModalHeading';

export default function MetaMaskNotInstalled(): JSX.Element {
  return (
    <>
      <ModalHeading css={{ maxWidth: 'none', marginBottom: '$4' }}>
        Install MetaMask.
      </ModalHeading>
      <Grid css={{ gap: '$5', width: '100%' }}>
        <ModalCopy css={{ maxWidth: 280 }}>
          Install MetaMask to connect to Foundation.
        </ModalCopy>
        <a
          href="https://metamask.io"
          target="_blank"
          rel="noreferrer"
          style={{ display: 'block', textDecoration: 'none' }}
        >
          <Button
            shape="regular"
            color="black"
            size="large"
            hoverable
            css={{ width: '100%' }}
          >
            Go to MetaMask's website
          </Button>
        </a>
      </Grid>
    </>
  );
}
