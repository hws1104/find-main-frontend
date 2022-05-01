export enum ModerationStatus {
  Active = 'ACTIVE',
  UnderReview = 'UNDER_REVIEW',
  Suspended = 'SUSPENDED',
  TakedownRequested = 'TAKEDOWN_REQUESTED',
}

export type PageGuard =
  | 'approved-creator'
  | 'social-verification'
  | 'user-moderated'
  | 'creator-moderated'
  | 'artwork-moderated'
  | 'agreed-to-tos';
