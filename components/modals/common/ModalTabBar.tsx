import { css, styled } from 'stitches.config';

import TabBar from 'components/tabs/TabBar';
import TabHeading from 'components/tabs/TabHeading';
import Flex from 'components/base/Flex';
import Box from 'components/base/Box';

import CloseIcon from 'assets/icons/close-icon.svg';

import useModal from 'hooks/use-modal';
import Icon from 'components/Icon';

type ModalTab = {
  onClick: () => void;
  isActive: boolean;
  children: string;
};

interface ModalTabsProps {
  tabs: ModalTab[];
  enableCloseButton?: boolean;
}

const tabsStyles = css({
  display: 'flex',
  borderBottom: 'solid 1px $black10',
  alignItems: 'center',
  paddingLeft: '$6',
  paddingRight: '$5',
  marginBottom: '1px !important',
  $bp1: {
    paddingLeft: '$7',
  },
})();

const ModalCloseButton = styled(Box, {
  color: '$black40',
  cursor: 'pointer',
  marginRight: '$1',
  transition: 'color $1 $ease',
  padding: '$2',
  '@hover': {
    '&:hover': {
      color: '$black100',
    },
  },
});

export default function ModalTabs(props: ModalTabsProps): JSX.Element {
  const { tabs, enableCloseButton = true } = props;

  const { resetModal } = useModal();

  return (
    <TabBar className={tabsStyles}>
      <Flex css={{ alignItems: 'center', flex: 1, paddingTop: '$6' }}>
        {tabs.map((tab, index) => (
          <TabHeading
            weight={600}
            size={{ '@initial': 1, '@bp0': 2 }}
            key={index}
            {...tab}
          />
        ))}
      </Flex>
      {enableCloseButton && (
        <ModalCloseButton onClick={resetModal}>
          <Icon icon={CloseIcon} width={14} height={14} />
        </ModalCloseButton>
      )}
    </TabBar>
  );
}
