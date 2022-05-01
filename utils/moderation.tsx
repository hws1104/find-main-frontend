import React, { ReactNode } from 'react';
import { cond } from 'ramda';

import WarningTermsLink from 'components/trust-safety/WarningTermsLink';
import TextLink from 'components/base/TextLink';

import { ModerationStatus } from 'types/Moderation';
import { BasicArtwork } from 'types/Artwork';

export const isFlaggedForModeration = (status: ModerationStatus): boolean =>
  [
    ModerationStatus.Suspended,
    ModerationStatus.UnderReview,
    ModerationStatus.TakedownRequested,
  ].includes(status);

export const filterNonUserStatuses = (
  statuses: ModerationStatus[]
): ModerationStatus[] =>
  statuses.filter((status) => status !== ModerationStatus.TakedownRequested);

interface ArtworkOrCreatorModerated {
  moderationStatus: ModerationStatus;
  isModerated: boolean;
}

interface ArtworkModeration {
  moderationStatus: ModerationStatus;
  creator?: {
    moderationStatus: ModerationStatus;
  };
}

export const isArtworkOrCreatorModerated = (
  artwork: ArtworkModeration
): ArtworkOrCreatorModerated => {
  const artworkModerationStatus = artwork?.moderationStatus;
  const userModerationStatus = artwork?.creator?.moderationStatus;

  const isArtworkModerated = isFlaggedForModeration(artworkModerationStatus);

  const isCreatorModerated = isFlaggedForModeration(userModerationStatus);

  const moderationStatus = isCreatorModerated
    ? userModerationStatus
    : artworkModerationStatus;

  return {
    moderationStatus,
    isModerated: isArtworkModerated || isCreatorModerated,
  };
};

export const getArtworkModerationTitle = cond<ModerationStatus, string>([
  [
    (status) => status === ModerationStatus.UnderReview,
    () => 'This artwork is under review',
  ],
  [
    (status) => status === ModerationStatus.Suspended,
    () => 'This artwork has been permanently removed.',
  ],
  [
    (status) => status === ModerationStatus.TakedownRequested,
    () => 'This artwork has received a DMCA takedown notice.',
  ],
]);

export const getArtworkModerationDescription = cond<BasicArtwork, ReactNode>([
  [
    (artwork) => artwork.moderationStatus === ModerationStatus.UnderReview,
    () => (
      <>
        This artwork is currently under review by the Foundation team to ensure
        it has not violated the Foundation <WarningTermsLink />.
      </>
    ),
  ],
  [
    (artwork) => artwork.moderationStatus === ModerationStatus.Suspended,
    () => (
      <>
        This artwork was found to be in violation of the Foundation{' '}
        <WarningTermsLink /> and has been permanently removed.
      </>
    ),
  ],
  [
    (artwork) =>
      artwork.moderationStatus === ModerationStatus.TakedownRequested,
    (artwork) => (
      <>
        This artwork has received a DMCA takedown notice from{' '}
        {artwork?.moderationFrom}.{' '}
        <TextLink
          as="a"
          css={{ display: 'inline' }}
          target="_blank"
          rel="noreferrer"
          href="https://help.foundation.app/en/articles/5151857-guide-digital-millennium-copyright-act-or-dmca"
        >
          Learn about the DMCA process →
        </TextLink>
      </>
    ),
  ],
]);

export const getUserModerationTitle = cond<ModerationStatus, string>([
  [
    (status) => status === ModerationStatus.UnderReview,
    () => 'Your profile is under review',
  ],
  [
    (status) => status === ModerationStatus.Suspended,
    () => 'Your profile has been permanently removed.',
  ],
]);

export const getUserModerationDescription = cond<ModerationStatus, ReactNode>([
  [
    (status) => status === ModerationStatus.UnderReview,
    () => (
      <>
        Your profile has been found to be in violation of the Foundation{' '}
        <WarningTermsLink />.
      </>
    ),
  ],
  [
    (status) => status === ModerationStatus.Suspended,
    () => (
      <>
        Your profile has been found to be in violation of the Foundation{' '}
        <WarningTermsLink /> and has been permanently suspended.
      </>
    ),
  ],
]);
