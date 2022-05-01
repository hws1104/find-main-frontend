import Box from 'components/base/Box';
import Text from 'components/base/Text';
import Flex from 'components/base/Flex';
import SearchResultsGrid from 'components/search/SearchResultsGrid';
import SearchHitSplitUser from 'components/search/SearchHitSplitUser';
import SearchEmptyState from 'components/search/SearchEmptyState';
import SpinnerStroked from 'components/SpinnerStroked';

import { AlgoliaUser } from 'types/Algolia';

import { notEmptyOrNil } from 'utils/helpers';

interface UserSearchResultsProps {
  results: AlgoliaUser[];
  handleClick: (address: string) => void;
  isLoading: boolean;
}

export default function UserSearchResults(
  props: UserSearchResultsProps
): JSX.Element {
  const { results, handleClick, isLoading } = props;

  const hasResults = notEmptyOrNil(results);

  return (
    <Box
      css={{
        position: 'absolute',
        top: 'calc(100% + $5)',
        boxShadow: '$2',
        zIndex: 999,
        width: '100%',
        marginBottom: '$8',
        borderRadius: '$2',
        overflow: 'hidden',
      }}
    >
      <Box css={{ maxHeight: 480, overflow: 'scroll' }}>
        <SearchResultsGrid css={{ boxShadow: 'none' }}>
          <Text
            css={{
              color: '$black50',
              fontWeight: 600,
              fontFamily: '$body',
            }}
          >
            People
          </Text>

          {isLoading ? (
            <Flex center css={{ minHeight: 340 }}>
              <SpinnerStroked size={32} />
            </Flex>
          ) : hasResults ? (
            <SearchResultsList results={results} handleClick={handleClick} />
          ) : (
            <Flex center css={{ minHeight: 340 }}>
              <SearchEmptyState
                headingSize="$3"
                heading="No results found."
                description="No one by that username was found."
              />
            </Flex>
          )}
        </SearchResultsGrid>
      </Box>
    </Box>
  );
}

type SearchResultsListProps = Omit<UserSearchResultsProps, 'isLoading'>;

function SearchResultsList(props: SearchResultsListProps): JSX.Element {
  const { results, handleClick } = props;

  return (
    <>
      {results.map((result) => (
        <Box
          css={{ cursor: 'pointer' }}
          key={result.publicKey}
          onClick={() => {
            handleClick(result.publicKey);
          }}
        >
          <SearchHitSplitUser hit={result} />
        </Box>
      ))}
    </>
  );
}
