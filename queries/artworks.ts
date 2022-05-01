const NUM_BIDS_MULTIPLE = 5;
const BID_VOL_MULTIPLE = 1;

interface TrendingArtwork {
  numberOfBids: number;
  bidVolumeInETH: number;
  dateEnding: number;
  tokenId: number;
}
/**
 * This logic should eventually live in the backend.
 * Doing it client side for now since it's easier to iterate on.
 *
 * Dampens num bids based on how much time left is in the auction.
 */
export function scoreTrendingArtwork(artwork: TrendingArtwork): number {
  const numBidsFactor =
    Math.max(Number(artwork.numberOfBids) - 1, 0) * NUM_BIDS_MULTIPLE;
  const bidVolFactor = Number(artwork.bidVolumeInETH) * BID_VOL_MULTIPLE;
  const timeLeftFactor =
    (Number(artwork.dateEnding) - Math.floor(Date.now() / 1000)) / 3600; // Hours left
  return numBidsFactor / Math.max(1, timeLeftFactor ** 2) + bidVolFactor;
}
