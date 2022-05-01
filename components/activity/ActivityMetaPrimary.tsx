import { ReactNode } from 'react';

import Heading from 'components/base/Heading';
import Box from 'components/base/Box';

import { styled } from 'stitches.config';

export const ActivityMetaTitle = styled(Heading, {
  fontSize: '$body',
  marginBottom: '$2',
});

export const ActivityMetaValue = styled(Heading, {
  fontSize: '$3',
  marginBottom: '$2',
});

export const ActivityMetaLabel = styled(Heading, {
  fontSize: '$2',
  color: '$black60',
});

interface ActivityMetaPrimaryProps {
  title: ReactNode;
  value: ReactNode;
  label: ReactNode;
}

export function ActivityMetaPrimary(props: ActivityMetaPrimaryProps) {
  const { title, value, label } = props;
  return (
    <Box>
      <ActivityMetaTitle>{title}</ActivityMetaTitle>
      <ActivityMetaValue>{value}</ActivityMetaValue>
      <ActivityMetaLabel>{label}</ActivityMetaLabel>
    </Box>
  );
}
