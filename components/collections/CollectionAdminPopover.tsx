import PopoverMeatball from 'components/popover/PopoverMeatball';
import PopoverMenu from 'components/popover/PopoverMenu';

import NotAllowedIcon from 'assets/icons/not-allowed.svg';
import AdminShield from 'assets/icons/admin-shield.svg';

import useModal from 'hooks/use-modal';

import { ModalKey } from 'types/modal';

import { CSS } from 'stitches.config';

interface CollectionAdminPopoverProps {
  currentUserIsAdmin: boolean;
  css?: CSS;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function CollectionAdminPopover(
  props: CollectionAdminPopoverProps
) {
  const { currentUserIsAdmin, css } = props;

  const { setCurrentModal } = useModal();

  return (
    <PopoverMeatball css={{ ...(css as any) }}>
      <PopoverMenu
        options={[
          {
            enabled: currentUserIsAdmin,
            icon: <AdminShield />,
            children: 'Admin Tools',
            onClick: () => {
              return setCurrentModal(ModalKey.ADMIN_TOOLS);
            },
          },
          {
            enabled: true,
            icon: <NotAllowedIcon />,
            children: <span style={{ color: '#F93A3A' }}>Report</span>,
            onClick: () => {
              return setCurrentModal(ModalKey.REPORT);
            },
          },
        ].filter((option) => option.enabled)}
      />
    </PopoverMeatball>
  );
}
