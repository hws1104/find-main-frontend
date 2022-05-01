import { ReactNode } from 'react';
import { CSS } from 'stitches.config';

import Flex from 'components/base/Flex';

export type BackgroundColor = CSS['backgroundColor'];

interface LayoutProps {
  backgroundColor: BackgroundColor;
  children: ReactNode;
}

interface WithLayoutProps {
  backgroundColor: BackgroundColor;
}

type CurriedLayout = (arg0: JSX.Element, arg1: WithLayoutProps) => JSX.Element;

export default function Layout(props: LayoutProps): JSX.Element {
  const { children, backgroundColor } = props;
  return (
    <Flex
      css={{
        backgroundColor,
        flexGrow: 1,
        flexDirection: 'column',
      }}
    >
      {children}
    </Flex>
  );
}

export function WithLayout(props: WithLayoutProps): CurriedLayout {
  return function LayoutContainer(page: JSX.Element) {
    return <Layout {...props}>{page}</Layout>;
  };
}
