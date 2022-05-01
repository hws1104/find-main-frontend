import { styled } from 'stitches.config';

import Grid from 'components/base/Grid';
import Heading from 'components/base/Heading';
import TextLink from 'components/base/TextLink';

import IPFSIcon from 'assets/icons/ipfs-icon.svg';
import EtherscanIcon from 'assets/icons/etherscan-icon.svg';
import EyeIcon from 'assets/icons/eye-icon-bold.svg';

import { ContractType } from 'types/Collection';
import { BasicArtwork } from 'types/Artwork';

import { CollectionFragmentExtended } from 'graphql/hasura/hasura-fragments.generated';

import { buildEtherscanLink } from 'lib/etherscanAddresses';

import { buildIPFSAssetUrl } from 'utils/assets';
import { buildMetadataUrl } from 'utils/urls';

interface ArtworkAuthenticityProps {
  artwork: BasicArtwork;
  collection: CollectionFragmentExtended;
}

const MetadataLink = styled(TextLink, {
  display: 'flex',
  alignItems: 'center',
  svg: {
    marginRight: '$3',
  },
});

export default function ArtworkAuthenticity(
  props: ArtworkAuthenticityProps
): JSX.Element {
  const { artwork, collection } = props;

  const tokenId = artwork?.tokenId;
  const isFNDCollection = [
    ContractType.FND,
    ContractType.FND_COLLECTION,
  ].includes(collection?.contractType);

  const hasMetadata = artwork?.metadataHost;

  return (
    <>
      <Heading
        size={{ '@initial': 2, '@bp0': 3 }}
        css={{
          marginBottom: '$1',
          borderBottom: '1px solid $black10',
          paddingBottom: '$5',
        }}
      >
        Details
      </Heading>
      <Grid
        css={{
          maxWidth: 400,
          gridGap: '$5',
          marginY: '$7',
          justifyContent: 'flex-start',
        }}
      >
        {tokenId && (
          <MetadataLink
            target="_blank"
            rel="noreferrer"
            href={buildEtherscanLink(
              `/token/${artwork.contractAddress}?a=${tokenId}`
            )}
          >
            <EtherscanIcon width={22} height={22} /> View on Etherscan
          </MetadataLink>
        )}
        {hasMetadata && (
          <MetadataLink
            target="_blank"
            rel="noreferrer"
            href={buildMetadataUrl(artwork)}
          >
            <IPFSIcon width={22} height={22} fill="currentColor" />
            View metadata
          </MetadataLink>
        )}
        {tokenId && isFNDCollection && (
          <MetadataLink
            target="_blank"
            rel="noreferrer"
            href={buildIPFSAssetUrl(artwork)}
          >
            <EyeIcon width={22} height={22} fill="currentColor" />
            View on IPFS
          </MetadataLink>
        )}
      </Grid>
    </>
  );
}
