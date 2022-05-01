/* eslint-disable max-lines */
/* eslint-disable react/jsx-max-depth */
import NextLink from 'next/link';

import Box from 'components/base/Box';
import Flex from 'components/base/Flex';
import Text from 'components/base/Text';
import Heading from 'components/base/Heading';
import Body from 'components/base/Body';
import Link from 'components/base/Link';
import Button from 'components/base/Button';

import { MIN_FOLLOWS_COUNT } from 'lib/constants';

interface FollowCounterProps {
  followingCount: number;
}

export default function FeedFollowCounter(
  props: FollowCounterProps
): JSX.Element {
  const { followingCount } = props;

  const needsMoreFollows = followingCount < MIN_FOLLOWS_COUNT;

  const percentProgress = (followingCount / MIN_FOLLOWS_COUNT) * 100;

  return (
    <Box
      css={{
        position: 'sticky',
        bottom: 0,
        left: 0,
        paddingY: '$6',
        backgroundColor: '$white100',
        boxShadow: '0px -10px 20px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Body
        css={{
          display: 'grid',
          gridTemplateColumns: '1fr 250px 1fr',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Flex css={{ alignItems: 'center' }}>
          <Heading size="3" css={{ marginRight: '$7' }}>
            {followingCount}/{MIN_FOLLOWS_COUNT}
          </Heading>
          <Text
            weight={600}
            css={{ lineHeight: 1.3, color: '$black50', maxWidth: 180 }}
          >
            Follow at least {MIN_FOLLOWS_COUNT} creators to continue
          </Text>
        </Flex>
        <Flex
          css={{
            width: 250,
            height: 5,
            backgroundColor: '$black5',
            borderRadius: 4,
          }}
        >
          <Box
            css={{
              width: 250,
              height: 5,
              backgroundColor: '$black100',
              borderRadius: 4,
              transition: 'width $1 $ease',
            }}
            style={{ width: `${percentProgress}%` }}
          />
        </Flex>

        <Box
          css={{
            marginLeft: 'auto',
            pointerEvents: needsMoreFollows ? 'none' : 'all',
          }}
        >
          <NextLink href="/feed" passHref>
            <Link css={{ textDecoration: 'none', display: 'block' }}>
              <Button
                size="medium"
                shape="regular"
                color="black"
                css={{ minWidth: 180 }}
                disabled={needsMoreFollows}
              >
                Continue
              </Button>
            </Link>
          </NextLink>
        </Box>
      </Body>
    </Box>
  );
}
