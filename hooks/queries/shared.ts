import { UseQueryOptions } from 'react-query';

export const isQueryEnabled = <T extends Pick<UseQueryOptions, 'enabled'>>(
  options: T
) => options?.enabled ?? true;
