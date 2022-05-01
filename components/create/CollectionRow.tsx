import NextLink from 'next/link';

import { SquareAvatar } from 'components/base/Avatar';
import Card from 'components/base/Card';
import Flex from 'components/base/Flex';
import Text from 'components/base/Text';
import GraySquare from 'components/base/GraySquare';

import { abbreviateValue } from 'utils/formatters';
import { pluralizeWord } from 'utils/strings';
import { buildAvatarUrl } from 'utils/assets';
import { MintableCollection } from 'hooks/queries/hasura/use-user-collections';
import { CSS } from 'stitches.config';

interface CollectionRowProps {
  data: MintableCollection;
  css?: CSS;
}

export default function CollectionRow(props: CollectionRowProps): JSX.Element {
  const { data, css } = props;

  const collectionImageUrl = buildAvatarUrl(80, data?.collectionImageUrl);

  return (
    <NextLink
      href={`/create/upload?contractAddress=${data?.contractAddress}`}
      passHref
    >
      <Card
        as="a"
        isInteractive
        css={{
          display: 'flex',
          padding: '$4',
          color: 'currentColor',
          textDecoration: 'none',
          width: '100%',
          ...css,
        }}
      >
        <SquareAvatar
          imageUrl={collectionImageUrl}
          alt={data?.name}
          size={80}
          shape={1}
        />
        <Flex
          css={{
            flexDirection: 'column',
            marginLeft: '$4',
            justifyContent: 'center',
          }}
        >
          {!data ? (
            <>
              <GraySquare css={{ marginBottom: '$2', width: 180 }} />
              <GraySquare />
            </>
          ) : (
            <>
              <Text size={2} weight={600} css={{ marginBottom: '$1' }}>
                {data?.name}
              </Text>
              <Text weight={600} css={{ color: '$black60' }}>
                {abbreviateValue(data?.artworkCount?.aggregate?.count)}{' '}
                {pluralizeWord('NFT', data?.artworkCount?.aggregate?.count)}
              </Text>
            </>
          )}
        </Flex>
      </Card>
    </NextLink>
  );
}
