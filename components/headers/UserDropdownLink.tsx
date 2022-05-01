import { forwardRef, ReactNode } from 'react';

import ChevronRight from 'assets/icons/right-chevron.svg';

import Link from 'components/links/Link';
import Flex from 'components/base/Flex';
import Box from 'components/base/Box';
import Heading from 'components/base/Heading';

interface UserDropdownLinkProps {
  onClick?: () => void;
  icon: JSX.Element;
  children: ReactNode;
  href?: string;
}

export default function UserDropdownLink(
  props: UserDropdownLinkProps
): JSX.Element {
  const { children, icon, href, onClick } = props;

  if (onClick) {
    return (
      <InnerLink onClick={onClick} icon={icon}>
        {children}
      </InnerLink>
    );
  }
  return (
    <Link href={href}>
      <InnerLink icon={icon}>{children}</InnerLink>
    </Link>
  );
}

interface InnerLinkProps {
  onClick?: () => void;
  icon: JSX.Element;
  children: ReactNode;
}

const InnerLink = forwardRef<HTMLDivElement, InnerLinkProps>(
  (props: InnerLinkProps, ref) => {
    const { onClick, icon, children } = props;
    return (
      <Flex
        ref={ref}
        onClick={onClick}
        css={{
          padding: '$4',
          alignItems: 'center',
          cursor: 'pointer',
          textDecoration: 'none',
          transition: 'background $1 $ease',
          borderRadius: '$1',
          color: '$black100',
          '@hover': {
            '&:hover': {
              background: '$black5',
            },
          },
        }}
      >
        <Flex
          css={{
            flex: 'auto',
            alignItems: 'center',
          }}
          className="icon-label"
        >
          <Box css={{ minWidth: 36 }}>{icon}</Box>
          <Heading size={2} css={{ flex: 1, display: 'flex' }}>
            {children}
          </Heading>
        </Flex>

        <ChevronRight />
      </Flex>
    );
  }
);

InnerLink.displayName = 'InnerLink';
