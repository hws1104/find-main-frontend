import Box from 'components/base/Box';
import SpinnerStroked from 'components/SpinnerStroked';

export default function LoadingHeader(): JSX.Element {
  return (
    <Box
      css={{
        padding: '$3',
        backgroundColor: '$white100',
        color: '$black100',
        borderRadius: '$round',
        boxShadow: '$0',
      }}
    >
      <SpinnerStroked size={30} />
    </Box>
  );
}
