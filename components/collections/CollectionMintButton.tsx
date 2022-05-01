import Link from 'next/link';

import Box from 'components/base/Box';
import Button from 'components/base/Button';

import { CollectionFragmentExtended } from 'graphql/hasura/hasura-fragments.generated';

interface CollectionMintButtonProps {
  collection: CollectionFragmentExtended;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function CollectionMintButton(props: CollectionMintButtonProps) {
  const { collection } = props;

  return (
    <Box css={{ position: 'relative' }}>
      <Box
        css={{
          display: 'none',
          position: 'absolute',
          top: 0,
          right: 0,
          transform: 'translateY(calc(-100% + 28px))',
          zIndex: 2,
          '@bp1': {
            display: 'block',
          },
        }}
      >
        <Link
          passHref
          href={{
            pathname: '/create/upload',
            query: {
              contractAddress: collection.contractAddress,
            },
          }}
        >
          <Button as="a" shape="regular" color="black" size="large" hoverable>
            Mint NFT
          </Button>
        </Link>
      </Box>
    </Box>
  );
}
