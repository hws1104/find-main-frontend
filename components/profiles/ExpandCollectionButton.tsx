import Button from 'components/base/Button';

import { styled } from 'stitches.config';

const ExpandCollectionButton = styled(Button, {
  width: '100%',
  display: 'block',
  '@bp1': {
    display: 'none',
  },
});

export default ExpandCollectionButton;
