/* eslint-disable react/jsx-max-depth */
import { ReactNode } from 'react';
import NextLink from 'next/link';

import { getUsernameOrAddress, truncateString } from 'utils/helpers';
import { getCreatorCardHero } from 'utils/assets';

import Account from 'types/Account';

import AspectRatio from 'components/base/AspectRatio';
import Box from 'components/base/Box';
import Grid from 'components/base/Grid';
import Image from 'components/base/Image';
import Card from 'components/base/Card';
import Link from 'components/base/Link';
import Paragraph from 'components/base/Paragraph';

import CircleAvatar from 'components/avatars/CircleAvatar';
import CreatorCardHeading from './CreatorCardHeading';
import CreatorCardSubheading from './CreatorCardSubheading';

interface CreatorCardProps {
  creator: Account;
  meta?: ReactNode;
  hideBiosOnMobile?: boolean;
}

export default function CreatorCard(props: CreatorCardProps): JSX.Element {
  const { creator, meta, hideBiosOnMobile } = props;

  const coverImageUrl = getCreatorCardHero(creator);
  const avatarUrl = creator?.profileImageUrl;

  const usernameOrAddress = getUsernameOrAddress(creator);

  return (
    <Card
      isInteractive
      css={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        overflow: 'hidden',
      }}
    >
      <NextLink href={`/${usernameOrAddress}`} passHref prefetch={false}>
        <Link
          css={{
            display: 'block',
            textDecoration: 'none',
            color: '$black100',
          }}
        >
          <Box css={{ position: 'relative' }}>
            <AspectRatio
              ratio={1.75}
              css={{ backgroundColor: '$black5', display: 'flex' }}
            >
              {coverImageUrl && (
                <Image
                  loading="lazy"
                  src={coverImageUrl}
                  css={{
                    display: 'block',
                    objectFit: 'cover',
                    minHeight: '100%',
                    minWidth: '100%',
                  }}
                />
              )}
            </AspectRatio>
            <Box css={{ marginX: '$6', position: 'relative' }}>
              <Box
                css={{
                  padding: '$2',
                  backgroundColor: '$white100',
                  width: 96,
                  height: 96,
                  position: 'absolute',
                  left: 0,
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  borderRadius: '$round',
                }}
              >
                <CircleAvatar
                  maxSize={80}
                  css={{ width: 80, height: 80 }}
                  imageUrl={avatarUrl}
                  publicKey={creator?.publicKey}
                />
              </Box>
            </Box>
          </Box>
          <Box css={{ paddingX: '$6', paddingTop: '$9', paddingBottom: '$8' }}>
            <Grid css={{ gap: 5, marginBottom: '$4' }}>
              <CreatorCardHeading user={creator} />
              <CreatorCardSubheading user={creator} />
            </Grid>
            <Paragraph
              css={{
                display: hideBiosOnMobile ? 'none' : 'block',
                '@bp0': {
                  display: 'block',
                },
              }}
            >
              {truncateString(120, creator?.bio)}
            </Paragraph>
          </Box>
        </Link>
      </NextLink>
      {meta}
    </Card>
  );
}
