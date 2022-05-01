import Box from 'components/base/Box';
import Text from 'components/base/Text';

import { abbreviateValue } from 'utils/formatters';
interface ProfileFollowCountProps {
  followerCount: number;
  label: string;
  className?: string;
}

export default function ProfileFollowCount(
  props: ProfileFollowCountProps
): JSX.Element {
  const { followerCount, label, className } = props;

  return (
    <Box
      className={className}
      css={{
        color: '$black50',
        '@media (hover: hover)': {
          '&:hover': {
            color: '$black100',
          },
        },
      }}
    >
      <Text
        weight={600}
        size={3}
        css={{
          color: '$black100',
          transition: 'color $1 $ease',
        }}
      >
        {abbreviateValue(followerCount)}
      </Text>

      <Text
        weight={600}
        size={{ '@initial': 1, '@bp0': 2 }}
        css={{
          color: 'inherit',
          transition: 'color $1 $ease',
        }}
      >
        {label}
      </Text>
    </Box>
  );
}
