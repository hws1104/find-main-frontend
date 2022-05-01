import { ReactNode } from 'react';
import Link from 'next/link';

import Heading from 'components/base/Heading';

import { styled } from 'stitches.config';

const ActivityCardTitleText = styled(Heading, {
  marginBottom: '$3',
  fontSize: '$2',
  color: '$black100',
  '@bp0': {
    marginBottom: '$4',
    fontSize: '$3',
  },
});

interface ActivityCardTitleProps {
  href: string;
  children: ReactNode;
}

export default function ActivityCardTitle(props: ActivityCardTitleProps) {
  const { href, children } = props;
  return (
    <Link href={href} passHref>
      <a style={{ display: 'block', textDecoration: 'none' }}>
        <ActivityCardTitleText>{children}</ActivityCardTitleText>
      </a>
    </Link>
  );
}
