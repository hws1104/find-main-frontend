import Box from 'components/base/Box';
import Flex from 'components/base/Flex';
import Mono from 'components/base/Mono';
import Heading from 'components/base/Heading';
import { isEmptyOrNil } from 'utils/helpers';
import { styled } from 'stitches.config';

interface CollectionCardBlueprintProps {
  symbol: string;
  name: string;
}

export default function CollectionCardBlueprint(
  props: CollectionCardBlueprintProps
): JSX.Element {
  const { symbol, name } = props;

  const isNameEmpty = isEmptyOrNil(name);

  return (
    <Flex
      css={{
        flexDirection: 'column',
        width: 340,
        minHeight: 490,
        borderRadius: '$2',
        border: '3px solid $black10',
        paddingX: '$7',
        paddingY: '$7',
        position: 'relative',
      }}
    >
      <DraftLine orientation="vertical" css={{ left: -3 }} />
      <DraftLine orientation="vertical" css={{ left: '100%' }} />
      <DraftLine orientation="horizontal" css={{ top: -3 }} />
      <DraftLine orientation="horizontal" css={{ top: '100%' }} />
      <Flex css={{ alignItems: 'flex-start' }}>
        <GrayPlaceholder
          css={{
            width: 87,
            height: 87,
            marginRight: '$3',
          }}
        />

        <Flex
          css={{
            alignItems: 'center',
            background: '$black10',
            borderRadius: '$round',
            minWidth: 100,
            height: 46,
            marginLeft: 'auto',
            paddingX: '$3',
          }}
        >
          <Mono
            size={2}
            css={{
              marginX: 'auto',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {symbol}
          </Mono>
        </Flex>
      </Flex>

      <Box css={{ marginTop: 'auto' }}>
        {isNameEmpty ? (
          <>
            <GrayPlaceholder
              css={{
                minHeight: 50,
                marginBottom: '$3',
                width: '70%',
              }}
            />
            <GrayPlaceholder
              css={{
                minHeight: 50,
                marginBottom: '$3',
              }}
            />
          </>
        ) : (
          <Heading
            size={5}
            css={{
              marginBottom: '$5',
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 3,
              overflow: 'hidden',
              wordBreak: 'break-word',
            }}
          >
            {name}
          </Heading>
        )}

        <Heading size={2} css={{ color: '$black30' }}>
          0 Artworks
        </Heading>
      </Box>
    </Flex>
  );
}

const GrayPlaceholder = styled(Box, {
  background: '$black10',
  borderRadius: '$2',
  flexShrink: 0,
});

const DraftLine = styled(Box, {
  position: 'absolute',
  backgroundColor: '$black10',
  opacity: 0.5,
  variants: {
    orientation: {
      horizontal: {
        height: 3,
        width: 'calc(100% + 32px)',
        left: -16,
      },
      vertical: {
        width: 3,
        height: 'calc(100% + 32px)',
        top: -16,
      },
    },
  },
});
