import { useField } from 'formik';

import Grid from 'components/base/Grid';
import Heading from 'components/base/Heading';
import Flex from 'components/base/Flex';
import Icon from 'components/Icon';
import Text from 'components/base/Text';
import SplitsRow from 'components/transactions/split/SplitsRow';
import SplitIcon from 'assets/icons/split-icon.svg';

import { areKeysEqual } from 'utils/users';
import { maybeGetAddress } from 'utils/users';

import type { RevenueShare } from 'types/Share';
import { useUsersByPublicKeys } from 'graphql/hasura/queries/users-by-public-keys.generated';
import { UserFragment } from 'graphql/hasura/hasura-fragments.generated';

import { MAX_SPLIT_RECIPIENT_COUNT } from 'lib/constants';

interface SplitsSectionProps {
  currentUserPublicAddress: string;
  name: string;
}

// Note: This component assumes values.shares being defined
// It's the role of the consuming component to ensure that
export default function SplitsSection(props: SplitsSectionProps): JSX.Element {
  const { currentUserPublicAddress, name } = props;

  const [field] = useField<RevenueShare[]>(name);

  const splitValues = field.value;
  const splitsCount = splitValues.length;

  const userPublicKeys = splitValues.map((split) =>
    maybeGetAddress(split.address)
  );

  const { data: usersData } = useUsersByPublicKeys(
    { publicKeys: userPublicKeys },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      keepPreviousData: true,
      initialData: {
        users: [],
      },
      select: (res) => res.users,
    }
  );

  const hasSplits = splitsCount > 1;
  const splitsCountCopy = `${splitsCount}/${MAX_SPLIT_RECIPIENT_COUNT}`;

  return (
    <Grid css={{ gap: '$4' }}>
      <Flex css={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Flex css={{ alignItems: 'center', gap: '$3' }}>
          <Icon icon={SplitIcon} width={24} height={20} />
          <Heading size={1}>Edit Split</Heading>
        </Flex>
        {hasSplits && (
          <Text weight={600} css={{ color: '$black50' }}>
            {splitsCountCopy}
          </Text>
        )}
      </Flex>
      {splitValues.map((share, index) => {
        const matchedUser = usersData.find((user) =>
          areKeysEqual([user.publicKey, share.address])
        );
        const fallbackUser = buildFallbackUser(share.address);
        return (
          <SplitsRow
            key={index}
            index={index}
            user={matchedUser || fallbackUser}
            currentUserPublicKey={currentUserPublicAddress}
          />
        );
      })}
    </Grid>
  );
}

function buildFallbackUser(publicKey: string): UserFragment {
  return {
    publicKey,
    moderationStatus: null,
    isApprovedCreator: null,
    isAdmin: null,
    createdAt: null,
    links: null,
  };
}
