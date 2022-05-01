import { useState, ReactNode } from 'react';

import Box from 'components/base/Box';
import FilterSection from './algolia/FilterSection';
import { FilterHeading, SelectDownIcon } from './artworks/ArtworkSearchFilters';

interface CollapsibleFilterSectionProps {
  title: string;
  children: ReactNode;
  collapsed?: boolean;
  className?: string;
}

export default function CollapsibleFilterSection(
  props: CollapsibleFilterSectionProps
): JSX.Element {
  const { title, children, collapsed = true, className } = props;
  const [isCollapsed, setCollapsed] = useState(collapsed);

  const onKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab' || e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      setCollapsed((isCollapsed) => !isCollapsed);
    }
  };

  return (
    <FilterSection isCollapsed={isCollapsed}>
      <FilterHeading
        className={className}
        isCollapsed={isCollapsed}
        isCollapsible={true}
        onClick={() => setCollapsed((isCollapsed) => !isCollapsed)}
        onKeyPress={onKeyPress}
        role="button"
        tabIndex={0}
        aria-pressed={!collapsed}
      >
        {title} <SelectDownIcon isCollapsed={isCollapsed} />
      </FilterHeading>
      <Box
        as="section"
        aria-expanded={!isCollapsed}
        css={{ display: isCollapsed ? 'none' : 'block' }}
      >
        {children}
      </Box>
    </FilterSection>
  );
}
