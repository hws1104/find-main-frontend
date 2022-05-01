import { styled } from 'stitches.config';
import { ReactNode } from 'react';

import Text from 'components/base/Text';
import Flex from 'components/base/Flex';
import SpinnerStroked from 'components/SpinnerStroked';

import VerifiedBadge from 'assets/icons/verified-badge.svg';
import DeleteIcon from 'assets/icons/delete-icon-simple.svg';

import { SocialLinkProps } from './types';

interface RemoveableLinkProps {
  isLoading: boolean;
  onClick: () => void;
}

const PillContainer = styled(Flex, {
  boxShadow: '$0',
  borderRadius: '$round',
  padding: '$3',
  textDecoration: 'none',
  transition: 'transform $0 ease-in-out, box-shadow $0 ease-in-out',
  willChange: 'transform',
  position: 'relative',
  color: 'currentColor',
  zIndex: 3,
  backgroundColor: '$white100',
  variants: {
    hoverable: {
      true: {
        '@hover': {
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '$1',
          },
        },
      },
    },
  },
});

export default function SocialLinkVerified(
  props: SocialLinkProps
): JSX.Element {
  const { handle, children, linkBuilderFn, icon } = props;

  return (
    <PillContainer
      as="a"
      href={linkBuilderFn(handle)}
      target="_blank"
      rel="noreferrer"
      hoverable
    >
      <SocialLinkVerifiedInner icon={icon}>{children}</SocialLinkVerifiedInner>
    </PillContainer>
  );
}

interface SocialLinkVerifiedInnerProps {
  children: ReactNode;
  icon: ReactNode;
}

export function SocialLinkVerifiedInner(
  props: SocialLinkVerifiedInnerProps
): JSX.Element {
  const { children, icon } = props;
  return (
    <>
      <VerifiedBadge style={{ display: 'block' }} width={19} height={19} />

      <Text weight={600} size={0} css={{ marginX: '$2', position: 'relative' }}>
        {children}
      </Text>
      {icon}
    </>
  );
}

interface SocialLinkRemoveableInnerProps extends RemoveableLinkProps {
  children: ReactNode;
  icon: ReactNode;
}

function SocialLinkRemoveableInner(
  props: SocialLinkRemoveableInnerProps
): JSX.Element {
  const { children, icon, isLoading, onClick } = props;

  return (
    <>
      {isLoading ? (
        <SpinnerStroked size={19} />
      ) : (
        <Flex
          onClick={onClick}
          css={{
            cursor: 'pointer',
            width: 19,
            height: 19,
            justifyContent: 'center',
            alignItems: 'center',
            color: '$black20',
            transition: 'color $2 $ease',
            '@hover': {
              '&:hover': {
                color: '$red100',
              },
            },
          }}
        >
          <DeleteIcon
            key="delete"
            style={{ display: 'block' }}
            width={12}
            height={12}
            className="delete-icon"
          />
          <VerifiedBadge
            key="verified"
            style={{ display: 'block' }}
            width={19}
            height={19}
            className="verified-icon"
          />
        </Flex>
      )}

      <Text
        weight={600}
        size={0}
        css={{ marginX: 7, position: 'relative', cursor: 'default' }}
      >
        {children}
      </Text>
      {icon}
    </>
  );
}

interface SocialLinkRemoveableProps
  extends SocialLinkProps,
    RemoveableLinkProps {}

export function SocialLinkRemoveable(
  props: SocialLinkRemoveableProps
): JSX.Element {
  const { children, icon, isLoading, onClick } = props;

  return (
    <PillContainer
      css={{
        transition: 'opacity $2 $ease',
        '& .delete-icon': {
          opacity: 0,
          display: 'none !important',
        },
        '@media (hover: hover)': {
          '&:hover': {
            '& .verified-icon': {
              opacity: 0,
              display: 'none !important',
            },
            '& .delete-icon': {
              opacity: 1,
              display: 'block !important',
            },
          },
        },
        pointerEvents: isLoading ? 'none' : 'all',
      }}
    >
      <SocialLinkRemoveableInner
        onClick={onClick}
        isLoading={isLoading}
        icon={icon}
      >
        {children}
      </SocialLinkRemoveableInner>
    </PillContainer>
  );
}
