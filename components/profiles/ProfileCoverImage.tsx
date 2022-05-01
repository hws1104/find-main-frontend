import { ReactNode } from 'react';

import Body from 'components/base/Body';
import Box from 'components/base/Box';
import Flex from 'components/base/Flex';
import CircleAvatar from 'components/avatars/CircleAvatar';
import Overlay from 'components/base/Overlay';

import Account from 'types/Account';

interface ProfileCoverImageProps {
  coverImage: string;
  avatar: string;
  avatarBackground: string;
  creator: Account;
  meta: ReactNode;
}

export default function ProfileCoverImage(
  props: ProfileCoverImageProps
): JSX.Element {
  const { coverImage, avatar, creator, meta } = props;

  return (
    <Box
      css={{
        position: 'relative',
        marginBottom: 72,
        '@bp1': {
          marginBottom: 105,
        },
      }}
    >
      <Box css={{ position: 'relative' }}>
        {coverImage && <Overlay />}
        <Box
          css={{
            height: 180,
            backgroundImage: coverImage ? `url(${coverImage})` : null,
            backgroundColor: '$black5',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            '@bp1': { height: 280 },
          }}
        />
      </Box>
      <Body css={{ height: 0 }}>
        <Flex
          css={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            zIndex: 3,
            transform: 'translate(-50%, 50%)',
            '@bp1': {
              left: 'auto',
              transform: 'translateY(56px)',
            },
          }}
        >
          <CircleAvatar
            maxSize={180}
            css={{
              width: 120,
              height: 120,
              border: 'solid 10px $white100',
              '@bp1': { width: 180, height: 180 },
            }}
            imageUrl={avatar}
            publicKey={creator?.publicKey}
          />
        </Flex>

        {meta}
      </Body>
    </Box>
  );
}
