import NextLink from 'next/link';

import Box from 'components/base/Box';
import Button from 'components/base/Button';

import ModalContainer from 'components/modals/common/ModalContainer';
import ModalContent from 'components/modals/common/ModalContent';
import ModalCopy from 'components/modals/common/ModalCopy';
import ModalHeading from 'components/modals/common/ModalHeading';

import { ModalKey } from 'types/modal';

export default function MobileNotSupportedModal(): JSX.Element {
  return (
    <>
      <ModalContainer
        modalKey={ModalKey.MOBILE_NOT_SUPPORTED}
        blockOverlayDismiss
      >
        <ModalContent css={{ maxWidth: 600, flexShrink: 0 }}>
          <ModalHeading css={{ maxWidth: 'none', marginBottom: '$6' }}>
            This action is currently not supported on mobile.
          </ModalHeading>
          <ModalCopy css={{ fontSize: '$0', maxWidth: 280 }}>
            Please use a laptop or desktop while we continue to build out mobile
            support.
          </ModalCopy>
          <Box css={{ marginTop: '$4', textAlign: 'center' }}>
            <NextLink href="/" passHref>
              <Button as="a" size="large" color="black" shape="regular">
                Back to Home
              </Button>
            </NextLink>
          </Box>
        </ModalContent>
      </ModalContainer>
    </>
  );
}
