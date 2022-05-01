import { CSS } from 'stitches.config';

import Box from 'components/base/Box';

import { buildImgixUrlNew } from 'utils/assets';
import { getAvatarByPublicKey } from 'utils/users';

interface CircleAvatarProps {
  maxSize?: number;
  publicKey?: string;
  imageUrl?: string;
  css?: CSS;
  statusColor?: string;
}

export default function CircleAvatar(props: CircleAvatarProps): JSX.Element {
  const { maxSize = 32, publicKey, imageUrl, css } = props;

  const avatarBackground = getAvatarByPublicKey(publicKey);

  return (
    <Box
      style={getBackgroundStyle({ imageUrl, size: maxSize })}
      css={{
        background: avatarBackground,
        backgroundColor: '$black5',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '$round',
        width: maxSize,
        height: maxSize,
        ...(css as any),
      }}
      role="image"
    />
  );
}

const getBackgroundStyle = ({ imageUrl, size }) => {
  if (imageUrl) {
    const buildAvatarUrl = buildImgixUrlNew({
      q: 45,
      w: size,
      h: size,
      fit: 'crop',
      auto: 'format,compress',
      dpr: 2,
    });
    return {
      backgroundImage: `url(${buildAvatarUrl(imageUrl)})`,
    };
  }
  return null;
};
