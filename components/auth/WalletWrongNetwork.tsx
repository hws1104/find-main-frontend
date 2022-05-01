import getChainId from 'lib/chainId';

import ChangeNetworkIcon from 'assets/icons/change-network.svg';

import Heading from 'components/base/Heading';
import Paragraph from 'components/base/Paragraph';
import Box from 'components/base/Box';
import Flex from 'components/base/Flex';
import Icon from 'components/Icon';

const rightChain = getChainId();

export default function WalletWrongNetwork(): JSX.Element {
  const networkName =
    rightChain === 1
      ? 'Ethereum mainnet'
      : rightChain === 3
      ? 'Ropsten testnet'
      : rightChain === 4
      ? 'Rinkeby testnet'
      : 'Goerli testnet';

  return (
    <Box>
      <Flex css={{ marginBottom: '$6', justifyContent: 'center' }}>
        <Icon icon={ChangeNetworkIcon} width={48} height={48} />
      </Flex>

      <Heading size={4} css={{ marginBottom: '$4', textAlign: 'center' }}>
        Wrong network
      </Heading>

      <Paragraph size="regular" css={{ textAlign: 'center' }}>
        Your wallet is currently connected to a different network. Please change
        it to the {networkName} to continue.
      </Paragraph>
    </Box>
  );
}
