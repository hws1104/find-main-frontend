import { stringify } from 'query-string';

export const checkUsernameUniqueness = ({ username, excludedValue }) => {
  return fetch(`/api/username?${stringify({ username, excludedValue })}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
