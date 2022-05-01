import { useField } from 'formik';
import { useState, useRef } from 'react';
import { useClickAway } from 'react-use';
import { VariantProps } from '@stitches/react';

import { styled } from 'stitches.config';

import Box from 'components/base/Box';
import Grid from 'components/base/Grid';
import Card from 'components/base/Card';
import Heading from 'components/base/Heading';
import Mono from 'components/base/Mono';
import Chevron from 'assets/icons/rounded-chevron.svg';
import { SquareAvatar } from 'components/base/Avatar';

import { buildAvatarUrl } from 'utils/assets';
import { truncateStringCenter } from 'utils/helpers';

import { MintableCollection } from 'hooks/queries/hasura/use-user-collections';

interface CollectionSelectFieldProps {
  name: string;
  collections: MintableCollection[];
  disabled: boolean;
}

const AVATAR_SIZE = 76;

export default function CollectionSelectField(
  props: CollectionSelectFieldProps
): JSX.Element {
  const { name, collections, disabled } = props;

  const [isExpanded, setIsExpanded] = useState(false);

  const [field, , helpers] = useField(name);

  const currentValue = collections.find(
    (collection) => collection.contractAddress === field.value
  );

  const handleSelect = (contractAddress: string) => {
    setIsExpanded((isExpanded) => !isExpanded);
    helpers.setValue(contractAddress);
  };

  const sortedCollections = collections.sort((collection) =>
    collection.contractAddress === field.value ? -1 : 1
  );

  const clickAwayRef = useRef(null);

  useClickAway(clickAwayRef, () => {
    setIsExpanded(false);
  });

  // TODO: consolidate with components/artworks/ArtworkCollectionInfo.tsx
  return (
    <Box
      css={{
        position: 'relative',
        zIndex: 2,
        pointerEvents: disabled ? 'none' : 'all',
      }}
      ref={clickAwayRef}
    >
      <SelectedOption
        isInteractive
        css={{
          opacity: isExpanded ? 0 : 1,
        }}
      >
        <SelectOption
          handleClick={() => setIsExpanded(true)}
          collection={currentValue}
          // remove the select dropdown styling when it’s
          // disabled and there are no options available
          type={disabled ? 'option' : 'selected'}
        />
      </SelectedOption>

      {isExpanded && (
        <OptionGroup>
          {sortedCollections.map((collection) => {
            return (
              <SelectOption
                key={collection.contractAddress}
                collection={collection}
                handleClick={() => handleSelect(collection.contractAddress)}
                type="option"
              />
            );
          })}
        </OptionGroup>
      )}
    </Box>
  );
}

type OptionContainerVariants = VariantProps<typeof OptionContainer>;

interface SelectOptionProps extends Required<OptionContainerVariants> {
  collection: MintableCollection;
  handleClick: () => void;
}

function SelectOption(props: SelectOptionProps) {
  const { collection, handleClick, type } = props;

  const collectionImageUrl = buildAvatarUrl(
    AVATAR_SIZE,
    collection.collectionImageUrl
  );

  return (
    <Box css={{ paddingX: '$3' }}>
      <OptionContainer type={type} onClick={() => handleClick()}>
        {collectionImageUrl && (
          <SquareAvatar
            imageUrl={collectionImageUrl}
            alt={collection.name}
            size={AVATAR_SIZE}
            shape={1}
          />
        )}
        <Grid css={{ gap: '$2' }}>
          {collection.name ? (
            <Heading size={2} css={{ lineHeight: 1.3 }}>
              {collection.name}
            </Heading>
          ) : (
            <Mono size={1}>
              {truncateStringCenter(4, collection.contractAddress)}
            </Mono>
          )}
          {collection.symbol && <Mono size={0}>{collection.symbol}</Mono>}
        </Grid>
        {type === 'selected' && <Chevron style={{ marginLeft: 'auto' }} />}
      </OptionContainer>
    </Box>
  );
}

const SelectedOption = styled(Card, {
  border: 'solid 1px $black10',
  borderRadius: '$3',
  paddingY: '$3',
});

const OptionGroup = styled(SelectedOption, {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  zIndex: 2,
  maxHeight: 3 * 112,
  overflow: 'auto',
  display: 'grid',
  gap: '$3',
});

const OptionContainer = styled(Box, {
  cursor: 'pointer',
  display: 'flex',
  paddingX: '$3',
  alignItems: 'center',
  gap: '$6',
  textDecoration: 'none',
  color: '$black100',
  height: 96,
  transition: 'backgroundColor $1 $ease',
  borderRadius: '$2',
  variants: {
    type: {
      selected: {},
      option: {
        '@hover': {
          '&:hover': {
            backgroundColor: '$black5',
          },
        },
      },
    },
  },
});
