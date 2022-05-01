import React from 'react';
import NextLink, { LinkProps } from 'next/link';

// TODO: eventually deprecate this
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function Link(props: React.PropsWithChildren<LinkProps>) {
  return <NextLink {...props} passHref={true} />;
}
