import { config } from 'stitches.config';
import { useCallback, useEffect, useRef } from 'react';
import { useVirtual } from 'react-virtual';
import { useMedia } from 'react-use';

import Box from 'components/base/Box';
import ModalRowVirtualized from './ModalRowVirtualized';

import { ModalMode } from 'types/modal';

import useFetchVirtualizedData from 'hooks/use-fetch-virtualized-data';

interface ModalPaneVirtualizedProps<T> {
  users: T[];
  modalMode?: ModalMode;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  handleNextPage: () => void;
  onFollowUpdate: () => void;
}

type ModalUser = {
  isFollowingUser: {
    aggregate?: { count?: number };
  };
};

export default function ModalPaneVirtualized<T extends ModalUser>(
  props: ModalPaneVirtualizedProps<T>
): JSX.Element {
  const {
    handleNextPage,
    onFollowUpdate,
    isFetchingNextPage,
    hasNextPage,
    modalMode,
    users,
  } = props;

  const parentRef = useRef();

  const isMobileBreakpoint = !useMedia(config.media.bp0);

  // set the row size to 67px on mobile and 105px otherwise
  const estimateSize = useCallback(
    () => (isMobileBreakpoint ? 60 : 105),
    [isMobileBreakpoint]
  );

  const rowVirtualizer = useVirtual({
    size: users.length,
    parentRef,
    // height of the individual elements
    estimateSize,
    // buffer to keep extra items below the fold
    overscan: 20,
  });

  useFetchVirtualizedData({
    data: users,
    virtualItems: rowVirtualizer.virtualItems,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage: handleNextPage,
  });

  // when changing tabs in the modal, scroll results to the top
  useEffect(
    () => {
      rowVirtualizer.scrollToIndex(0);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [modalMode]
  );

  return (
    <Box
      ref={parentRef}
      css={{
        paddingY: '$4',
        maxWidth: 760,
        // desired height minus the header height
        minHeight: 640 - 66,
        maxHeight: 640 - 66,
        overflow: 'auto',
        position: 'relative',
        '@bp0': { paddingX: '$6', paddingY: '$6' },
      }}
    >
      <Box
        style={{
          height: `${rowVirtualizer.totalSize}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.virtualItems.map((virtualRow) => {
          const userRow = users[virtualRow.index];

          return (
            <Box
              key={virtualRow.index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
                display: 'flex',
              }}
            >
              <ModalRowVirtualized
                user={userRow}
                isFollowing={userRow.isFollowingUser.aggregate.count > 0}
                onFollowUpdate={onFollowUpdate}
                isLoading={false}
              />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
