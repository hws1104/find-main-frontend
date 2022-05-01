import { ReactElement } from 'react';

import {
  ArtworkAuctionContainer,
  ArtworkAuctionMetaContainer,
} from '../ArtworkAuctionElements';
import Flex from 'components/base/Flex';
import Text from 'components/base/Text';
import UserTagV3 from 'components/users/UserTagV3';
import GraySquare from 'components/base/GraySquare';

import useUserByPublicKey from 'hooks/queries/use-user-by-public-key';
import { isAllTrue } from 'utils/helpers';

interface AuctionStateOwnedByProps {
  ownedBy: string;
  children?: ReactElement;
}

export default function AuctionStateOwnedBy(
  props: AuctionStateOwnedByProps
): JSX.Element {
  const { ownedBy, children } = props;

  const { data: userData, isLoading: isCreatorLoading } = useUserByPublicKey({
    publicKey: ownedBy,
  });

  const hasUser = isAllTrue([!isCreatorLoading, userData]);

  return (
    <ArtworkAuctionContainer>
      <ArtworkAuctionMetaContainer>
        {children}
        <Flex
          css={{
            flexDirection: 'column',
          }}
        >
          <Text
            size={1}
            weight={600}
            css={{ marginBottom: '$1', color: '$black60' }}
          >
            Owned by
          </Text>
          <Flex css={{ marginY: 'auto' }}>
            {hasUser ? (
              <UserTagV3 user={userData.user} />
            ) : (
              <GraySquare
                css={{ borderRadius: '$round', width: 160, height: 52 }}
              />
            )}
          </Flex>
        </Flex>
      </ArtworkAuctionMetaContainer>
    </ArtworkAuctionContainer>
  );
}
