import { styled } from 'stitches.config';

import ExternalLink from 'assets/icons/external-link.svg';
import Flex from 'components/base/Flex';
import Box from 'components/base/Box';
import Heading from 'components/base/Heading';
import Mono from 'components/base/Mono';

import { formatETHWithSuffix } from 'utils/formatters';
import { truncateStringCenter } from 'utils/helpers';

import { buildEtherscanLink } from 'lib/etherscanAddresses';

import useIsWrongNetwork from 'hooks/web3/use-is-wrong-network';

interface EtherscanLinkProps {
  balance: number;
  publicKey: string;
}

export default function EtherscanLink(props: EtherscanLinkProps): JSX.Element {
  const { publicKey, balance } = props;

  const isWrongNetwork = useIsWrongNetwork();

  const etherscanUrl = buildEtherscanLink(`/address/${publicKey}`);

  return (
    <Box>
      <Flex
        as="a"
        href={etherscanUrl}
        target="_blank"
        css={{
          padding: '$4',
          alignItems: 'center',
          cursor: 'pointer',
          color: '$black100',
          textDecoration: 'none',
          transition: 'background $1 $ease',
          borderRadius: '$1',
          '@hover': {
            '&:hover': {
              background: '$black5',
            },
          },
        }}
      >
        <NetworkIndicator wrongNetwork={isWrongNetwork} />
        <Box>
          {isWrongNetwork ? (
            <Heading size={2} css={{ marginBottom: 2 }}>
              Wrong network
            </Heading>
          ) : (
            <Heading size={2} css={{ marginBottom: 2 }}>
              {formatETHWithSuffix(balance)}
            </Heading>
          )}
          <Mono css={{ textTransform: 'none' }} size={0}>
            {truncateStringCenter(4, publicKey)}
          </Mono>
        </Box>
        <ExternalLink width={15} height={15} style={{ marginLeft: 'auto' }} />
      </Flex>
    </Box>
  );
}

const NetworkIndicator = styled(Box, {
  marginRight: '$5',
  width: 16,
  height: 16,
  backgroundColor: '$green100',
  borderRadius: '$round',
  zIndex: '2',
  variants: {
    wrongNetwork: {
      true: {
        backgroundColor: '$red100',
      },
    },
  },
});
