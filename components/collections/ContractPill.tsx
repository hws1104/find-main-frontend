import { styled, css } from 'stitches.config';

import Link from 'components/base/Link';
import Box from 'components/base/Box';

import ExternalLinkIcon from 'assets/icons/external-link.svg';

const Wrapper = styled(Box, {
  paddingY: '$2',
  paddingX: '$5',
  display: 'inline-block',
  background: '$white100',
  color: '$black100',
  boxShadow: '$0',
  borderRadius: '$round',
  variants: {
    frosted: {
      true: {
        color: '$white100',
        background: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(10px)',
        boxShadow: 'none',
      },
    },
  },
});

const WrapperLink = styled(Link, {
  paddingY: '$2',
  paddingX: '$5',
  display: 'inline-block',
  background: '$white100',
  color: '$black100',
  boxShadow: '$0',
  borderRadius: '$round',
  willChange: 'transform',
  transition: 'transform $1 $ease, color $1 $ease, background $1 $ease',
  textDecoration: 'none',
  svg: {
    transition: 'color $1 $ease',
  },
  '@hover': {
    '&:hover': {
      transform: 'translateY(-2px)',
      color: '$black100',
      background: '$white100',
      svg: {
        color: '$black100',
      },
    },
  },
  variants: {
    frosted: {
      true: {
        color: '$white100',
        background: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(10px)',
        boxShadow: 'none',
      },
    },
  },
});

const ContractText = styled('span', {
  fontFamily: '$mono',
  fontSize: '$0',
  letterSpacing: 1,
  textTransform: 'uppercase',
  '@bp2': {
    fontSize: '$2',
  },
});

interface ContractPillProps {
  frosted?: boolean;
  href?: string;
  contract: string;
  hasIcon: boolean;
}

const externalLinkStyles = css({
  width: 10,
  height: 10,
  '@bp2': {
    width: 14,
    height: 14,
  },
});

export default function ContractPill(props: ContractPillProps): JSX.Element {
  const { frosted = false, href, contract, hasIcon } = props;

  if (href) {
    return (
      <WrapperLink
        frosted={frosted}
        href={href}
        target="_blank"
        rel="noreferrer"
      >
        <ContractText>{contract}</ContractText>
        {hasIcon && (
          <Box
            css={{
              color: frosted ? '$white40' : '$black20',
              display: 'inline-block',
              marginLeft: '$2',
              '@hover': { '&:hover': { color: '$black100' } },
            }}
          >
            <ExternalLinkIcon className={externalLinkStyles()} />
          </Box>
        )}
      </WrapperLink>
    );
  }
  return (
    <Wrapper frosted={frosted}>
      <ContractText>{contract}</ContractText>
    </Wrapper>
  );
}
