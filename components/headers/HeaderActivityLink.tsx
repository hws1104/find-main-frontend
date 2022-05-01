import { useRouter } from 'next/router';

import NextLink from 'next/link';
import Box from 'components/base/Box';
import Text from 'components/base/Text';
import HeaderActivityCount from './HeaderActivityCount';
import NavLink from './NavLink';

interface HeaderActivityLinkProps {
  activityCount: number;
  isDark: boolean;
}

export default function HeaderActivityLink(
  props: HeaderActivityLinkProps
): JSX.Element {
  const { isDark, activityCount } = props;

  const router = useRouter();
  const currentPath = router.pathname;
  const href = '/activity';

  return (
    <Box>
      <NextLink href={href} passHref>
        <NavLink
          isDark={isDark}
          isActive={currentPath === href}
          css={{
            display: 'flex',
            alignItems: 'center',
            '@hover': {
              '&:hover': {
                '& .number-bg': {
                  background: '$black100',
                },
                '& .number': {
                  color: '$white100',
                },
              },
            },
          }}
        >
          <Text weight={600} size={2}>
            Activity
          </Text>
          {activityCount > 0 && <HeaderActivityCount count={activityCount} />}
        </NavLink>
      </NextLink>
    </Box>
  );
}
