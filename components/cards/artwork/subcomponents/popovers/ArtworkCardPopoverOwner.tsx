/* eslint-disable max-lines */
import { CSS } from 'stitches.config';
import { UseMutationResult } from 'react-query';

import PopoverMeatball from 'components/popover/PopoverMeatball';
import PopoverMenu from 'components/popover/PopoverMenu';
import SpinnerStroked from 'components/SpinnerStroked';
import Text from 'components/base/Text';
import Icon from 'components/Icon';
import Box from 'components/base/Box';

import UnhideIcon from 'assets/icons/eye-icon-bold.svg';
import HideIcon from 'assets/icons/hide-icon.svg';
import TransferIcon from 'assets/icons/transfer-icon.svg';
import ChangePriceIcon from 'assets/icons/change-price-icon.svg';
import BurnIcon from 'assets/icons/burn-icon.svg';
import UnlistIcon from 'assets/icons/unlist-icon.svg';
import TagIcon from 'assets/icons/tags-icon.svg';
import PrivateSaleIcon from 'assets/icons/private-sale.svg';

import { ArtworkV2 } from 'types/Artwork';
import { PopoverVariants } from 'components/popover/PopoverButton';
import { ComputedArtworkStatus } from 'types/artwork/artwork';
import { PopoverMenuOption } from 'components/popover/types';
import WalletUser from 'types/WalletUser';

import {
  SetArtworkUserVisibility,
  SetArtworkUserVisibilityVariables,
} from 'graphql/server/mutations/set-artwork-user-visibility.generated';

import { isAllTrue, notEmptyOrNil } from 'utils/helpers';
import { areKeysEqual } from 'utils/users';
import {
  buildArtworkPath,
  buildArtworkTagsPath,
  buildCreatorArtworkPath,
  buildSellerPrivateSalePath,
  hasActivePrivateSale,
} from 'utils/artwork/artwork';

interface ArtworkCardPopoverOwnerProps {
  artwork: ArtworkV2;
  status: ComputedArtworkStatus;
  currentUser: WalletUser;
  setIsHovered: (arg0: boolean) => void;
  options?: PopoverMenuOption[];
  css?: CSS;
  appearance?: PopoverVariants['appearance'];
  size?: PopoverVariants['size'];
  setArtworkUserVisibility?: UseMutationResult<
    SetArtworkUserVisibility,
    Error,
    SetArtworkUserVisibilityVariables
  >;
}

export default function ArtworkCardPopoverOwner(
  props: ArtworkCardPopoverOwnerProps
): JSX.Element {
  const {
    artwork,
    status,
    currentUser,
    setArtworkUserVisibility,
    options = [],
    css,
    appearance,
    size,
    setIsHovered,
  } = props;

  const hasSplits = artwork?.splitRecipients?.aggregate?.count > 0;
  const artworkPath = buildArtworkPath({ artwork, user: artwork?.creator });
  const creatorArtworkPath = buildCreatorArtworkPath(artwork);
  const privateSalePath = buildSellerPrivateSalePath({
    artwork,
    user: artwork?.creator,
  });

  const hasTags = artwork?.tags.length !== 0;

  const isCreatorOwner = areKeysEqual([
    artwork?.ownerPublicKey,
    artwork?.publicKey,
    currentUser?.publicAddress,
  ]);

  const isOwner = areKeysEqual([
    artwork?.ownerPublicKey,
    currentUser?.publicAddress,
  ]);

  const isCreator = areKeysEqual([
    artwork?.publicKey,
    currentUser?.publicAddress,
  ]);

  const isHidden = notEmptyOrNil(artwork.artworkUserVisibilities);

  const hasPrivateSale = hasActivePrivateSale(artwork);

  const isLoading = setArtworkUserVisibility?.isLoading;
  const mutate = setArtworkUserVisibility?.mutate;

  const unhideArtworkLabel = isLoading ? 'Hiding NFT' : 'Hide NFT';
  const hideArtworkLabel = isLoading ? 'Unhiding NFT' : 'Unhide NFT';
  const tagLabel = !hasTags ? 'Add tags' : 'Edit tags';

  const authorization = {
    canTag: isCreator,
    canHide: isAllTrue([
      setArtworkUserVisibility,
      (hasSplits && !isCreator) || !isCreator,
    ]),
    canUnlist: isAllTrue([
      isOwner,
      [ComputedArtworkStatus.Listed].includes(status),
    ]),
    canChangePrice: isAllTrue([
      isOwner,
      [ComputedArtworkStatus.Listed].includes(status),
    ]),
    canBurn: isAllTrue([
      isCreatorOwner,
      [
        ComputedArtworkStatus.Settled,
        ComputedArtworkStatus.Minted,
        ComputedArtworkStatus.Transferred,
        ComputedArtworkStatus.PrivateSale,
      ].includes(status),
    ]),
    canTransfer: isAllTrue([
      isOwner,
      [
        ComputedArtworkStatus.Minted,
        ComputedArtworkStatus.Settled,
        ComputedArtworkStatus.Transferred,
        ComputedArtworkStatus.PrivateSale,
      ].includes(status),
    ]),
    canViewPrivateSale: isAllTrue([isOwner, hasPrivateSale]),
    canPrivateSale: isAllTrue([
      isOwner,
      !hasPrivateSale,
      [
        ComputedArtworkStatus.Minted,
        ComputedArtworkStatus.Settled,
        ComputedArtworkStatus.Transferred,
        ComputedArtworkStatus.PrivateSale,
      ].includes(status),
    ]),
  };

  const fullOptions: PopoverMenuOption[] = [
    {
      enabled: authorization.canBurn,
      icon: <Icon icon={BurnIcon} width={22} height={22} />,
      children: <Text css={{ color: '#F93A3A' }}>Burn NFT</Text>,
      href: `${creatorArtworkPath}/burn`,
    },
    {
      enabled: authorization.canUnlist,
      icon: <Icon icon={UnlistIcon} width={22} height={22} />,
      children: 'Unlist',
      href: `${artworkPath}/unlist`,
    },
    {
      enabled: authorization.canPrivateSale,
      icon: <Icon icon={PrivateSaleIcon} width={22} height={20} />,
      children: 'Create Private Sale',
      href: `${creatorArtworkPath}/private-sale`,
    },
    {
      enabled: authorization.canViewPrivateSale,
      icon: <Icon icon={PrivateSaleIcon} width={22} height={20} />,
      children: 'View Private Sale',
      href: `${privateSalePath}`,
    },
    {
      enabled: authorization.canTransfer,
      icon: <Icon icon={TransferIcon} width={18} height={18} />,
      children: 'Transfer NFT',
      href: `${artworkPath}/transfer`,
    },
    {
      enabled: authorization.canChangePrice,
      icon: <Icon icon={ChangePriceIcon} width={22} height={22} />,
      children: 'Change reserve price',
      href: `${artworkPath}/change-price`,
    },
    {
      enabled: authorization.canTag,
      icon: <Icon icon={TagIcon} width={20} height={22} />,
      children: tagLabel,
      href: `${buildArtworkTagsPath(artwork)}?redirect=profile`,
    },
    {
      enabled: authorization.canHide,
      icon: isLoading ? (
        <SpinnerStroked size={20} />
      ) : isHidden ? (
        <Icon icon={UnhideIcon} width={22} height={16} />
      ) : (
        <Icon icon={HideIcon} width={22} height={22} />
      ),
      children: isHidden ? hideArtworkLabel : unhideArtworkLabel,
      onClick: () => {
        mutate({
          tokenId: artwork?.tokenId,
          contractAddress: artwork?.contractAddress,
          shouldHide: !isHidden,
        });
      },
    },
    ...options,
  ];

  const enabledOptions = fullOptions.filter((option) => option.enabled);
  const hasOptions = notEmptyOrNil(enabledOptions);

  if (hasOptions) {
    return (
      <Box
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        css={{ position: 'relative', zIndex: 4 }}
      >
        <PopoverMeatball
          size={size}
          appearance={appearance}
          css={{ ...(css as any) }}
        >
          <PopoverMenu options={enabledOptions} />
        </PopoverMeatball>
      </Box>
    );
  }
  return null;
}
