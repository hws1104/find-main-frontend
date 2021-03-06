import { gql } from 'graphql-request';

export const HasuraArtworkFragment = gql`
  fragment HasuraArtworkFragment on artwork {
    id
    name
    description
    assetScheme
    assetHost
    assetPath
    assetIPFSPath
    metadataScheme
    metadataHost
    metadataPath
    metadataIPFSPath
    width
    height
    duration
    mimeType
    mintTxHash
    assetId
    assetStatus
    mintTxHash
    tokenId
    status
    hiddenAt
    deletedAt
    moderationStatus
    moderationFrom
    latestTxDate
    assetVersion
    ownerPublicKey
    tags
    contractAddress
    privateSales {
      ipfsPath
      deadlineAt
      soldAt
      price: saleAmountInETH
      buyer
      seller
    }
  }
`;

export const HasuraUserFragmentLight = gql`
  fragment HasuraUserFragmentLight on user {
    userIndex
    publicKey
    username
    profileImageUrl
    coverImageUrl
    name
    bio
    isApprovedCreator
    moderationStatus
    joinedWaitlistAt
    createdAt
    isApprovedForMigrationAt
  }
`;

export const HasuraUserFragment = gql`
  fragment HasuraUserFragment on user {
    ...HasuraUserFragmentLight
    firstName
    lastName
    isAdmin
    links
  }
  ${HasuraUserFragmentLight}
`;

export const HasuraInviteFragment = gql`
  fragment HasuraInviteFragment on invite_code {
    senderPublicKey
    redeemerPublicKey
    redeemedAt
  }
`;

export const HasuraSocialVerificationFragment = gql`
  fragment HasuraSocialVerificationFragment on social_verification {
    id
    user
    createdAt
    updatedAt
    lastCheckedAt
    socialVerificationURL
    verificationText
    userId
    username
    isValid
    service
    failedReason
    status
  }
`;

export const HasuraUserProfileFragment = gql`
  fragment HasuraUserProfileFragment on user {
    ...HasuraUserFragment
    acceptedInvite {
      ...HasuraInviteFragment
    }
    twitSocialVerifs: socialVerifications(
      where: { isValid: { _eq: true }, service: { _eq: "TWITTER" } }
      limit: 1
    ) {
      ...HasuraSocialVerificationFragment
    }
    instaSocialVerifs: socialVerifications(
      where: { isValid: { _eq: true }, service: { _eq: "INSTAGRAM" } }
      limit: 1
    ) {
      ...HasuraSocialVerificationFragment
    }
  }
  ${HasuraUserFragment}
  ${HasuraInviteFragment}
  ${HasuraSocialVerificationFragment}
`;

export const HasuraFeedUserFragment = gql`
  fragment HasuraFeedUserFragment on user {
    ...HasuraUserFragment
    # Returns how many users follow this account
    followerCount: follows_aggregate(where: { isFollowing: { _eq: true } }) {
      aggregate {
        count
      }
    }
    # Returns if the current user follows this account
    follows(where: { user: { _eq: $publicKey }, isFollowing: { _eq: true } }) {
      createdAt
      isFollowing
    }
  }
  ${HasuraUserFragment}
`;
