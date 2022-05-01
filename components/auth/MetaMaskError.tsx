import Flex from 'components/base/Flex';

import WalletWrongNetwork from 'components/auth/WalletWrongNetwork';

export default function MetaMaskError(): JSX.Element {
  return (
    <Flex css={{ width: '100%', flex: 'auto' }}>
      <Flex
        css={{
          flex: 'auto',
          justifyContent: 'center',
          alignItems: 'center',
          paddingY: '$6',
          '@bp0': { paddingY: '$7' },
          '@bp1': { paddingY: '$8' },
          '@bp2': { paddingY: '$9' },
        }}
      >
        <WalletWrongNetwork />
      </Flex>
    </Flex>
  );
}
