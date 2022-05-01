import Text from 'components/base/Text';
import Flex from 'components/base/Flex';

import { formatDateJoined } from 'utils/dates/dates';

interface ProfileJoinedDateProps {
  dateJoined: string;
}

export default function ProfileJoinedDate(
  props: ProfileJoinedDateProps
): JSX.Element {
  const { dateJoined } = props;

  if (!dateJoined) {
    return null;
  }

  return (
    <Flex
      css={{
        justifyContent: 'space-between',
        borderTop: 'solid 1px $black10',
        borderBottom: 'solid 1px $black10',
        paddingY: '$4',
        alignItems: 'center',
      }}
    >
      <Text weight={600} size={2} css={{ lineHeight: 1 }}>
        Joined
      </Text>
      <Text css={{ lineHeight: 1 }}>{formatDateJoined(dateJoined)}</Text>
    </Flex>
  );
}
