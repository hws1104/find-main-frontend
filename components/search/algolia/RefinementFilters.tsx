import {
  connectRefinementList,
  connectToggleRefinement,
} from 'react-instantsearch-dom';
import { RefinementListProvided } from 'react-instantsearch-core';
import { indexOf, sort } from 'ramda';

import Grid from 'components/base/Grid';
import Flex from 'components/base/Flex';
import AlgoliaCheckbox from 'components/forms/fields/algolia/AlgoliaCheckbox';

import { SearchResultHit } from 'types/Algolia';
import { isEmptyOrNil } from 'utils/helpers';
import { FilterHeading } from '../artworks/ArtworkSearchFilters';
import CollapsibleFilterSection from '../CollapsibleFilterSection';

const sortRefinementItems = (
  items: RefinementListProvided['items'],
  sortOrder: string[]
) => {
  return sort((a: SearchResultHit, b: SearchResultHit) => {
    return indexOf(a.label, sortOrder) - indexOf(b.label, sortOrder);
  }, items);
};

const getRefinementItems = (
  items: RefinementListProvided['items'],
  sortOrder: string[]
): RefinementListProvided['items'] => {
  // if there’s no sort order
  return isEmptyOrNil(sortOrder)
    ? // return the items
      items
    : // otherwise sort the items
      sortRefinementItems(items, sortOrder);
};

type RefinementList = RefinementListProvided & {
  title: string;
  sortOrder?: string[];
  collapsed?: boolean;
};

const RefinementFilters = connectRefinementList<RefinementList>((props) => {
  const { items, title, sortOrder, refine, collapsed = true } = props;

  const sortedItems = getRefinementItems(items, sortOrder);

  return (
    <Grid>
      <CollapsibleFilterSection title={title} collapsed={collapsed}>
        <Grid css={{ gap: '$3' }}>
          {sortedItems.map((item) => (
            <AlgoliaCheckbox key={item.label} hit={item} refine={refine} />
          ))}
        </Grid>
      </CollapsibleFilterSection>
    </Grid>
  );
});

export default RefinementFilters;

export const ToggleRefinement = connectToggleRefinement((props) => {
  const { currentRefinement, label, count, refine } = props;

  const algoliaCheckState: SearchResultHit = {
    ...props,
    count: currentRefinement ? count.checked : count.unchecked,
    currentRefinement,
    isRefined: currentRefinement,
    value: !currentRefinement,
    label,
  };

  return <AlgoliaCheckbox hit={algoliaCheckState} refine={refine} />;
});

type RefinementToggleFilter = {
  attribute: string;
  label: string;
  value: boolean;
  defaultRefinement: boolean;
};

interface RefinementToggleFiltersProps {
  filters: RefinementToggleFilter[];
  title: string;
}

export function RefinementToggleFilters(
  props: RefinementToggleFiltersProps
): JSX.Element {
  const { filters, title } = props;

  return (
    <Grid>
      <Flex>
        <FilterHeading role="button" tabIndex={0}>
          {title}
        </FilterHeading>
      </Flex>

      <Grid css={{ gap: '$3' }}>
        {filters.map((item) => (
          <ToggleRefinement key={item.label} {...item} />
        ))}
      </Grid>
    </Grid>
  );
}
