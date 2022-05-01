import { useCallback, useRef, useState } from 'react';
import { useField } from 'formik';
import { uniqBy, prop } from 'ramda';
import { useClickAway } from 'react-use';
import { isAddress } from '@ethersproject/address';

import Box from 'components/base/Box';
import Input from 'components/base/Input';
import Icon from 'components/Icon';
import SearchBarIcon from 'components/search/search-result/SearchBarIcon';
import SplitSearchResults from 'components/forms/fields/SplitSearchResults';
import { ValidationStates } from 'components/forms/FieldMeta';

import SearchIcon from 'assets/icons/search-icon.svg';

import type { RevenueShare } from 'types/Share';

import { stripAtSymbol } from 'utils/strings';
import { buildPercentToUse } from 'utils/split';
import { notEmptyOrNil } from 'utils/helpers';
import { MAX_SPLIT_RECIPIENT_COUNT } from 'lib/constants';

import useAlgoliaUserSearch from 'hooks/queries/algolia/use-algolia-user-search';

interface SplitUserSearchProps {
  publicAddress: string;
  name: string;
}

export default function SplitsUserSearch(
  props: SplitUserSearchProps
): JSX.Element {
  const { publicAddress, name } = props;

  const [field, , helpers] = useField<RevenueShare[]>(name);

  const [currentValue, setCurrentValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const isCurrentValueAddress = isAddress(currentValue);

  const ref = useRef();

  const hasMaxRecipients = MAX_SPLIT_RECIPIENT_COUNT <= field.value.length;

  const hasSearchValue = notEmptyOrNil(currentValue);
  const rawSearchTerm = stripAtSymbol(currentValue);

  const { data: searchData, isLoading: isSearchLoading } = useAlgoliaUserSearch(
    {
      searchTerm: rawSearchTerm,
      options: {
        filters: buildFilterClause(publicAddress, field.value),
        hitsPerPage: 50,
      },
    },
    {
      keepPreviousData: true,
      enabled: notEmptyOrNil(rawSearchTerm),
    }
  );

  const addSplitValue = useCallback(
    (shareData: RevenueShare) => {
      const shares = field.value;

      // just in case the user pastes the same address twice, force uniqueness
      const uniqResults = uniqBy(prop('address'), [...shares, shareData]);

      if (uniqResults.length <= MAX_SPLIT_RECIPIENT_COUNT) {
        // map over unique share results vs. results passed in
        const currentResults = uniqResults.map((share, index) => ({
          ...share,
          // uniqResults.length includes the new addition
          shareInPercentage: buildPercentToUse(uniqResults.length, index),
        }));
        helpers.setValue(currentResults);
      }
      setCurrentValue('');
    },
    [helpers, field, setCurrentValue]
  );

  const handleChange = useCallback(
    (value: string) => {
      const shares = field.value;
      const isPublicKey = isAddress(value);
      if (isPublicKey) {
        setCurrentValue(value);
        setTimeout(() => {
          addSplitValue({
            shareInPercentage: buildPercentToUse(shares.length + 1),
            address: value,
          });
        }, 1000);
      } else {
        setCurrentValue(value);
      }
    },
    [setCurrentValue, addSplitValue, field.value]
  );

  useClickAway(ref, () => {
    setIsFocused(false);
  });

  const resultsVisible = isFocused && hasSearchValue && !isCurrentValueAddress;

  return (
    <Box css={{ position: 'relative' }} ref={ref}>
      <SearchBarIcon
        css={{ left: 20, pointerEvents: 'none' }}
        data-active={isFocused}
        color="black"
      >
        <Icon icon={SearchIcon} width={18} height={18} />
      </SearchBarIcon>

      <Input
        disabled={hasMaxRecipients}
        css={{
          width: '100%',
          transitionDuration: '$3',
          transitionTimingFunction: '$ease',
          transitionProperty: 'background-color, color, box-shadow, border',
          paddingLeft: '$8',
          border: 'none',
        }}
        color="white"
        size="large"
        placeholder="Enter a username or Ethereum address…"
        value={currentValue}
        onFocus={() => setIsFocused(true)}
        onChange={(ev) => {
          handleChange(ev.target.value);
        }}
        onPaste={(ev) => {
          const pastedText = ev.clipboardData.getData('Text');
          handleChange(pastedText);
        }}
      />

      {isCurrentValueAddress && <ValidationStates isValid={true} />}

      {resultsVisible && (
        <SplitSearchResults
          results={searchData?.hits}
          handleClick={addSplitValue}
          isLoading={isSearchLoading}
        />
      )}
    </Box>
  );
}

// formats list of publicKeys to be:
// `NOT objectId:0xtest AND NOT objectId:0xbeef`
function buildFilterClause(
  currentUserPublicKey: string,
  users: RevenueShare[]
) {
  return [...users.map((user) => user.address), currentUserPublicKey]
    .map((publicKey) => `NOT objectID:${publicKey}`)
    .join(' AND ');
}
