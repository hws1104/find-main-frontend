import { ReactNode } from 'react';

import Flex from 'components/base/Flex';
import Icon from 'components/Icon';
import BidActionTitle from 'components/bids/BidActionTitle';
import BidMetaText from 'components/bids/BidMetaText';
import ActivityButtonLink, {
  ActivityButtonLinkProps,
} from './ActivityButtonLink';

import SuccessIcon from 'assets/icons/tx-success.svg';

interface ActivityMetaSecondaryProps {
  title: string;
  description: ReactNode;
  button: {
    href: string;
    label: string;
    color: ActivityButtonLinkProps['color'];
  };
}

export default function ActivityMetaSecondary(
  props: ActivityMetaSecondaryProps
) {
  const { title, description, button } = props;
  return (
    <Flex expandVertical>
      <Flex css={{ alignItems: 'center', marginBottom: '$4' }}>
        <Icon icon={SuccessIcon} width={20} height={20} />
        <BidActionTitle alignment="right">{title}</BidActionTitle>
      </Flex>

      <BidMetaText css={{ marginBottom: '$5' }}>{description}</BidMetaText>
      <Flex expandVertical css={{ justifyContent: 'flex-end' }}>
        <ActivityButtonLink href={button.href} color={button.color}>
          {button.label}
        </ActivityButtonLink>
      </Flex>
    </Flex>
  );
}
