import Box from 'components/base/Box';
import Link from 'components/base/Link';
import Button from 'components/base/Button';
import NextLink from 'next/link';

export default function HeaderCreatorUploadLink(): JSX.Element {
  return (
    <Box
      css={{
        marginLeft: '$6',
        display: 'none',
        '@bp2': { display: 'block' },
      }}
    >
      <NextLink href="/create" passHref>
        <Link
          css={{
            textDecoration: 'none',
            color: 'inherit',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Button
            shape="round"
            color="black"
            css={{
              fontSize: '$2',
              minHeight: 54,
              maxHeight: 54,
              paddingX: '$6',
              boxShadow: '$0',
              '@hover': {
                '&:hover': {
                  boxShadow: '$1',
                  transform: 'translateY(-2px)',
                },
                '&:active': {
                  boxShadow: '$0',
                  transform: 'translateY(0)',
                },
              },
            }}
          >
            Create
          </Button>
        </Link>
      </NextLink>
    </Box>
  );
}
