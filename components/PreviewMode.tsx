import NextLink from 'next/link';
import { useRouter } from 'next/router';

import Box from 'components/base/Box';
import Button from 'components/base/Button';

export default function PreviewMode(): JSX.Element {
  const router = useRouter();

  return (
    <Box css={{ position: 'fixed', bottom: 24, left: 24, zIndex: 999999 }}>
      <NextLink
        href={`/api/preview/disable?redirect=${router.asPath}`}
        passHref
      >
        <Button as="a" size="large" shape="round" color="black">
          Exit Preview Mode
        </Button>
      </NextLink>
    </Box>
  );
}
