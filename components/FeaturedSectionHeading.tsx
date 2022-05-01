import { ReactNode } from 'react';
import NextLink from 'next/link';

import Box from './base/Box';
import Text from './base/Text';
import Flex from './base/Flex';
import TextLink from './base/TextLink';
import { CSS } from 'stitches.config';

type SectionLink = {
  href?: string;
  text?: string;
};

interface FeaturedSectionHeadingProps {
  children: ReactNode;
  link?: SectionLink;
  css?: CSS;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function FeaturedSectionHeading(
  props: FeaturedSectionHeadingProps
) {
  const { children, link, css } = props;
  return (
    <Box
      css={{
        borderBottom: 'solid 1px $black10',
        marginBottom: '$6',
        paddingBottom: '$4',
        ...(css as any),
      }}
    >
      <Flex css={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Text
          weight={600}
          size={{
            '@initial': 2,
            '@bp1': 3,
          }}
        >
          {children}
        </Text>
        {link && (
          <NextLink href={link.href} passHref prefetch={false}>
            <TextLink
              css={{
                fontSize: '$1',
                '@bp1': {
                  fontSize: '$2',
                },
              }}
            >
              {link.text}
            </TextLink>
          </NextLink>
        )}
      </Flex>
    </Box>
  );
}
