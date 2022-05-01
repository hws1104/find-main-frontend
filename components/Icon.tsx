import { FunctionComponent, SVGAttributes, CSSProperties } from 'react';

export interface IconProps {
  width: number;
  height: number;
  icon: FunctionComponent<SVGAttributes<SVGElement>>;
  style?: CSSProperties;
}

export default function Icon(props: IconProps): JSX.Element {
  const { icon: IconComponent, height, width, style } = props;
  return (
    <IconComponent
      width={width}
      height={height}
      style={{ ...style, display: 'block', position: 'relative' }}
    />
  );
}
