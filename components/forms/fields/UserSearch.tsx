import { useCallback, useEffect, useRef, useState } from 'react';
import { useField } from 'formik';
import useAlgolia from 'use-algolia';
import { useClickAway } from 'react-use';
import { isAddress } from '@ethersproject/address';

import Box from 'components/base/Box';
import Input from 'components/base/Input';
import Icon from 'components/Icon';
import SearchBarIcon from 'components/search/search-result/SearchBarIcon';
import { ValidationStates } from 'components/forms/FieldMeta';

import SearchIcon from 'assets/icons/search-icon.svg';

import type { AlgoliaUser } from 'types/Algolia';

import { stripAtSymbol } from 'utils/strings';
import { notEmptyOrNil } from 'utils/helpers';
import UserSearchResults from './UserSearchResults';

// formats list of publicKeys to be:
// `NOT objectId:0xtest AND NOT objectId:0xbeef`
function buildFilterClause(currentUserPublicKey: string) {
  return [currentUserPublicKey]
    .map((publicKey) => `NOT objectID:${publicKey}`)
    .join(' AND ');
}

interface UserSearchProps {
  publicAddress: string;
  name: string;
}

export default function UserSearch(props: UserSearchProps): JSX.Element {
  const { publicAddress, name } = props;

  const [field, , helpers] = useField(name);

  const [currentValue, setCurrentValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const isCurrentValueAddress = isAddress(currentValue);

  const ref = useRef();

  const hasSearchValue = notEmptyOrNil(currentValue);

  const [searchState, requestDispatch] = useAlgolia<AlgoliaUser>(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY,
    'users'
  );

  const filterClause = buildFilterClause(publicAddress);

  useEffect(
    () => {
      requestDispatch({
        query: stripAtSymbol(currentValue),
        filters: filterClause,
        hitsPerPage: 50,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        facetFilters: [
          'moderationStatus:ACTIVE',
          'isHidden:false',
          [
            'socialVerificationFacet:INSTAGRAM',
            'socialVerificationFacet:TWITTER',
          ],
        ],
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentValue, requestDispatch]
  );

  const handleResultClick = (address: string) => {
    helpers.setValue(address);
    setIsFocused(false);
  };

  const handleChange = useCallback(
    (value: string) => {
      const isPublicKey = isAddress(value);
      if (isPublicKey) {
        helpers.setValue(value);
        setIsFocused(false);
      }
      setCurrentValue(value);
    },
    [setCurrentValue, helpers]
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
        <UserSearchResults
          results={searchState.hits ?? []}
          handleClick={handleResultClick}
          isLoading={searchState.loading}
        />
      )}
    </Box>
  );
}
