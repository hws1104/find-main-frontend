import Box from 'components/base/Box';
import Icon from 'components/Icon';

import ExternalLinkIcon from 'assets/icons/external-link.svg';

import { styled } from 'stitches.config';

const A = styled('a', {
  fontFamily: '$body',
  fontWeight: 600,
  color: '$black50',
  textDecoration: 'none',
  display: 'block',
});

interface TransactionIPFSLinkProps {
  ipfsHash: string;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function TransactionIPFSLink(props: TransactionIPFSLinkProps) {
  const { ipfsHash } = props;
  return (
    <A
      css={{
        display: 'inline-flex',
        alignItems: 'center',
        transition: 'color $1 $ease',
        '@hover': {
          '&:hover': { color: '$black100' },
        },
      }}
      href={`https://ipfs.io/ipfs/${ipfsHash}`}
      target="_blank"
    >
      <Box css={{ marginRight: '$2' }}>View proposal on IPFS</Box>
      <Icon icon={ExternalLinkIcon} width={14} height={14} />
    </A>
  );
}
