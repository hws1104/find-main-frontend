import { useField } from 'formik';
import { useCallback } from 'react';
import { nth, remove } from 'ramda';

import Flex from 'components/base/Flex';
import PercentField from 'components/forms/fields/PercentField';
import Icon from 'components/Icon';
import UserTagV3 from 'components/users/UserTagV3';
import HoverableIcon from 'components/HoverableIcon';

import { areKeysEqual } from 'utils/users';
import { buildPercentToUse } from 'utils/split';

import RemoveIcon from 'assets/icons/remove-icon.svg';

import { UserFragment } from 'graphql/hasura/hasura-fragments.generated';
import { RevenueShare } from 'types/Share';

interface SplitsRowProps {
  user: UserFragment;
  index: number;
  currentUserPublicKey: string;
}

export default function SplitsRow(props: SplitsRowProps): JSX.Element {
  const { index, user, currentUserPublicKey } = props;

  const [{ value: splitsValues }, , helpers] =
    useField<RevenueShare[]>('splits');

  const currentSplit = nth(index, splitsValues);

  const isCurrentUser = areKeysEqual([
    currentSplit?.address,
    currentUserPublicKey,
  ]);

  const removeSplit = useCallback(() => {
    const removedList = remove(index, 1, splitsValues);
    const updatedSplits = removedList.map((split, index) => ({
      ...split,
      shareInPercentage: buildPercentToUse(removedList.length, index),
    }));
    helpers.setValue(updatedSplits);
  }, [helpers, index, splitsValues]);

  return (
    <Flex css={{ alignItems: 'center' }}>
      <Flex css={{ flexGrow: 1 }}>
        <UserTagV3 user={user} hoverable />
      </Flex>

      <Flex css={{ alignItems: 'center' }}>
        <PercentField name={`splits.${index}.shareInPercentage`} />
        <HoverableIcon
          css={{
            cursor: 'pointer',
            marginLeft: '$6',
            pointerEvents: isCurrentUser ? 'none' : 'all',
            opacity: isCurrentUser ? 0 : 1,
          }}
          onClick={removeSplit}
        >
          <Icon icon={RemoveIcon} width={16} height={16} />
        </HoverableIcon>
      </Flex>
    </Flex>
  );
}
