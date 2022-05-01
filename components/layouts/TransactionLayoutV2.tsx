/* eslint-disable react/jsx-max-depth */
import { ReactNode } from 'react';

import Body from 'components/base/Body';
import Page from 'components/Page';
import Grid from 'components/base/Grid';
import Card from 'components/base/Card';
import Layout, { BackgroundColor } from 'components/layouts/Layout';

import { styled } from 'stitches.config';

import { PageType } from 'types/page';

interface TransactionLayoutProps {
  title: string;
  backgroundColor: BackgroundColor;
  pageType?: PageType;
}

type CurriedLayout = (
  arg0: JSX.Element,
  arg1: TransactionLayoutProps
) => JSX.Element;

export default function TransactionLayoutV2(
  props: TransactionLayoutProps
): CurriedLayout {
  return function TransactionLayoutContainer(page: JSX.Element) {
    return <TransactionLayoutRender {...props}>{page}</TransactionLayoutRender>;
  };
}

interface TransactionLayoutRenderProps extends TransactionLayoutProps {
  children: ReactNode;
}

function TransactionLayoutRender(props: TransactionLayoutRenderProps) {
  const { title, backgroundColor, pageType, children } = props;

  return (
    <Layout backgroundColor={backgroundColor}>
      <Page title={title} type={pageType}>
        <Body
          css={{
            display: 'flex',
            flexGrow: 1,
            flexDirection: 'column',
          }}
        >
          {children}
        </Body>
      </Page>
    </Layout>
  );
}

export const TransactionLayoutGrid = styled(Grid, {
  position: 'relative',
  justifyContent: 'center',
  gridTemplateColumns: '560px 340px',
  gap: 60,
  paddingTop: '$6',
  paddingBottom: '$4',
  variants: {
    reversed: {
      true: {
        gridTemplateColumns: '340px 560px',
        gap: '$10',
      },
    },
  },
});

export const TransactionCard = styled(Card, {
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
});
