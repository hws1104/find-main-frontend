import { useUserByPublicKey } from 'graphql/hasura/queries/user-by-public-key.generated';

import UserTag from './UserTagV3';
import { UserFragment } from 'graphql/hasura/hasura-fragments.generated';

interface UserTagProps {
  publicKey: string;
  frosted?: boolean;
}

export default function UserTagDynamic(props: UserTagProps): JSX.Element {
  const { publicKey } = props;

  const { data } = useUserByPublicKey(
    { publicKey },
    { refetchOnWindowFocus: false }
  );

  const fallbackUser: Pick<UserFragment, 'publicKey'> = { publicKey };

  return <UserTag user={data?.user ?? fallbackUser} />;
}
