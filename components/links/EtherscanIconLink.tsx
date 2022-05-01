import { styled, CSS } from 'stitches.config';
import Link from 'components/base/Link';
import OpenLinkIcon from 'assets/icons/open-link-icon.svg';
interface EtherscanIconLinkProps {
  href: string;
  css?: CSS;
}

export default function EtherscanIconLink(
  props: EtherscanIconLinkProps
): JSX.Element {
  const { href, css } = props;
  return (
    <EtherscanLink
      css={{ ...(css as any) }}
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="View on Etherscan"
    >
      <OpenLinkIcon style={{ display: 'block' }} width={16} height={16} />
    </EtherscanLink>
  );
}

const EtherscanLink = styled(Link, {
  overflow: 'hidden',
  color: '$black30',
  cursor: 'pointer',
  transition: 'color $1 $ease',
  position: 'absolute',
  right: 20,
  bottom: 20,
  '@bp1': {
    position: 'relative',
    right: 0,
    bottom: 0,
    marginLeft: '$6',
  },
  '@hover': {
    '&:hover': {
      color: '$black100',
    },
  },
});
