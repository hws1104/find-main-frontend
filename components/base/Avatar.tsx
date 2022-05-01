import { VariantProps, ComponentProps } from '@stitches/react';

import { CSS, styled } from 'stitches.config';

import Box from './Box';

const AvatarBackground = styled(Box, {
  display: 'block',
  variants: {
    shape: {
      1: {
        borderRadius: 'calc($1 + $space$1)',
      },
      2: {
        borderRadius: 'calc($2 + $space$2)',
      },
      round: {
        borderRadius: '$round',
      },
    },
    stroke: {
      1: {
        padding: '$1',
      },
      2: {
        padding: '$2',
      },
      3: {
        padding: '$3',
      },
    },
    appearance: {
      normal: {
        background: '$white100',
        boxShadow: '$0',
      },
      frosted: {
        background: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(6px)',
      },
    },
  },
});

const AvatarImage = styled(Box, {
  backgroundColor: '$black5',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  variants: {
    shape: {
      1: {
        borderRadius: '$1',
      },
      2: {
        borderRadius: '$2',
      },
      round: {
        borderRadius: '$round',
      },
    },
  },
});

export type AvatarImageVariants = VariantProps<typeof AvatarImage>;
export type AvatarBackgroundVariants = VariantProps<typeof AvatarBackground>;

interface SharedAvatarProps {
  imageUrl: string;
  alt?: string;
}

export interface AvatarProps
  extends ComponentProps<typeof AvatarImage>,
    AvatarBackgroundVariants,
    SharedAvatarProps {}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function Avatar(props: AvatarProps) {
  const { imageUrl, shape, css, alt, stroke, appearance } = props;

  return (
    <AvatarBackground shape={shape} appearance={appearance} stroke={stroke}>
      <AvatarImage
        style={{
          ...(imageUrl && { backgroundImage: `url(${imageUrl})` }),
        }}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        css={css}
        shape={shape}
        aria-label={alt}
        role="image"
      />
    </AvatarBackground>
  );
}

interface SquareAvatarProps
  extends AvatarImageVariants,
    AvatarBackgroundVariants,
    SharedAvatarProps {
  size: number;
  css?: CSS;
}

export function SquareAvatar(props: SquareAvatarProps) {
  const { imageUrl, alt, size, shape, stroke, appearance, css } = props;
  return (
    <Avatar
      css={{ width: size, height: size, ...(css as any) }}
      imageUrl={imageUrl}
      alt={alt}
      shape={shape}
      stroke={stroke}
      appearance={appearance}
    />
  );
}
