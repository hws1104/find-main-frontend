import { styled } from 'stitches.config';
import ArtworkCardContainer from 'components/cards/artwork/subcomponents/ArtworkCardContainer';
import CardGrid from 'components/CardGrid';

const ProfileCardGrid = styled(CardGrid, {
  [`& ${ArtworkCardContainer}:nth-of-type(n+4)`]: {
    display: 'none',
  },
  '@bp1': {
    [`& ${ArtworkCardContainer}:nth-of-type(n+4)`]: {
      display: 'flex',
    },
  },
  variants: {
    isExpanded: {
      true: {
        [`& ${ArtworkCardContainer}:nth-of-type(n+4)`]: {
          display: 'flex',
        },
      },
    },
  },
});

export default ProfileCardGrid;
