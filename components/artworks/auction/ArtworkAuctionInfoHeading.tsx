import Heading from 'components/base/Heading';
import { ReactNode } from 'react';

interface ArtworkAuctionInfoHeadingProps {
  children: ReactNode;
}

export default function ArtworkAuctionInfoHeading(
  props: ArtworkAuctionInfoHeadingProps
): JSX.Element {
  const { children } = props;
  return (
    <Heading
      size={{ '@initial': 3, '@bp3': 4 }}
      css={{
        marginBottom: '$2',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </Heading>
  );
}
