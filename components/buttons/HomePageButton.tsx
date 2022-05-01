import { ReactNode } from 'react';
import NextLink from 'next/link';
import Flex from 'components/base/Flex';
import Button from 'components/base/Button';

interface ViewAllButtonProps {
  href: string;
  children: ReactNode;
}

export default function HomePageButton(props: ViewAllButtonProps): JSX.Element {
  const { href, children } = props;
  return (
    <Flex css={{ justifyContent: 'center' }}>
      <NextLink href={href} passHref prefetch={false}>
        <Button
          hoverable
          as="a"
          href={href}
          shape="round"
          size="large"
          color="white"
          appearance="ghost"
          css={{ fontSize: '$2', color: '$black100' }}
        >
          {children}
        </Button>
      </NextLink>
    </Flex>
  );
}
