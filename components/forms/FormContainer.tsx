import { ReactNode } from 'react';

import Card from 'components/base/Card';

interface FormContainerProps {
  children: ReactNode;
}

export default function FormContainer(props: FormContainerProps): JSX.Element {
  const { children } = props;
  return (
    <Card
      css={{
        boxShadow: '$0',
        maxWidth: 740,
        borderRadius: '$3',
        paddingX: '$6',
        paddingY: '$6',
        '@bp0': {
          paddingX: '$7',
        },
        '@bp1': {
          width: '100%',
          marginX: 'auto',
          paddingX: '$8',
          paddingY: '$7',
        },
        '@bp2': {
          paddingY: '$8',
        },
      }}
    >
      {children}
    </Card>
  );
}
