import Text from 'components/base/Text';
import Mono from 'components/base/Mono';

import Account from 'types/Account';

import { getUsernameOrAddressInfo } from 'utils/helpers';
import Heading from 'components/base/Heading';

interface CreatorCardHeadingProps {
  user: Account;
}

export default function CreatorCardHeading(
  props: CreatorCardHeadingProps
): JSX.Element {
  const { user } = props;

  const { isAddress, usernameOrAddress, nameOrUsername, hasName } =
    getUsernameOrAddressInfo(user);

  if (isAddress) {
    return (
      <Mono tight size={3}>
        {usernameOrAddress}
      </Mono>
    );
  }

  if (!hasName) {
    return (
      <Heading size={4}>
        <Text color="rainbow">{usernameOrAddress}</Text>
      </Heading>
    );
  }

  return <Heading size={4}>{nameOrUsername}</Heading>;
}
