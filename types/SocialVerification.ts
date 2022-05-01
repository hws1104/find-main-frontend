import { SocialVerificationFragment } from 'graphql/hasura/hasura-fragments.generated';

export enum SocialVerifService {
  TWITTER = 'TWITTER',
  INSTAGRAM = 'INSTAGRAM',
}

export enum SocialVerifStatus {
  USERNAME_IN_USE = 'USERNAME_IN_USE',
}

export enum ServiceName {
  TWITTER = 'Twitter',
  INSTAGRAM = 'Instagram',
}

type SocialVerification = SocialVerificationFragment;

export default SocialVerification;
