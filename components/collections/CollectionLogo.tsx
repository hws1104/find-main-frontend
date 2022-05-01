import Avatar, { AvatarProps } from 'components/base/Avatar';

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function CollectionLogo(props: AvatarProps) {
  return (
    <Avatar
      {...props}
      css={{
        width: 100,
        height: 100,
        '@bp1': {
          width: 160,
          height: 160,
        },
      }}
    />
  );
}
