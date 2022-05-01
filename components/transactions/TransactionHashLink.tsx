import Text from 'components/base/Text';
import Link from 'components/base/Link';

import ExternalLinkIcon from 'assets/icons/external-link.svg';

import { buildEtherscanLink } from 'lib/etherscanAddresses';

interface TransactionHashLinkProps {
  txHash: string | string[];
  href?: string;
}

export default function TransactionHashLink(
  props: TransactionHashLinkProps
): JSX.Element {
  const { txHash, href } = props;

  const etherscanLink = buildEtherscanLink(`/tx/${txHash}`);

  return (
    <Link
      href={href || etherscanLink}
      css={{
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textDecoration: 'none',
        color: '$black60',
        transition: 'color $2 $ease',
        '@hover': {
          '&:hover': {
            color: '$black100',
          },
        },
      }}
      target="_blank"
      rel="noreferrer"
    >
      <ExternalLinkIcon sx={{ display: 'block' }} width={16} height={16} />
      <Text
        weight={600}
        css={{ marginLeft: '$4', position: 'relative', top: -1 }}
      >
        View on Etherscan
      </Text>
    </Link>
  );
}
