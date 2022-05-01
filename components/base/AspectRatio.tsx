import { ComponentProps } from '@stitches/react';
import { ReactNode } from 'react';
import Box from './Box';

export type StitchesBoxProps = ComponentProps<typeof Box>;
interface AspectRatioProps {
  children?: ReactNode;
  ratio: number;
  css?: StitchesBoxProps['css'];
}

export default function AspectRatio(props: AspectRatioProps): JSX.Element {
  const { children, ratio = 4 / 3, css } = props;
  return (
    <Box
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      css={{
        ...css,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        css={{
          width: '100%',
          height: 0,
          paddingBottom: 100 / ratio + '%',
        }}
      />
      <Box
        css={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        }}
      >
        {children && children}
      </Box>
    </Box>
  );
}
