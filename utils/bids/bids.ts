import { ArtworkMeta, buildArtworkPath } from 'utils/artwork/artwork';

import Account from 'types/Account';

interface BuildBidPathProps {
  creator: Account;
  artwork: ArtworkMeta;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export function buildBidPath({ creator, artwork }: BuildBidPathProps) {
  const basePath = buildArtworkPath({ user: creator, artwork });
  return `${basePath}/bid`;
}
