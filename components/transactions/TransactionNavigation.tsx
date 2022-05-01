import { CSS } from 'stitches.config';

import { NavigationStep } from 'types/NavigationStep';

import useNavigationFlow from 'state/stores/navigation-flow';

import Box from 'components/base/Box';
import Grid from 'components/base/Grid';
import Text from 'components/base/Text';

interface TransactionNavigationProps {
  navigationSteps: NavigationStep[];
  css?: CSS;
}

export default function TransactionNavigation(
  props: TransactionNavigationProps
): JSX.Element {
  const { navigationSteps, css } = props;

  const stepCount = navigationSteps.length;

  const { percentCompleted, activeStep, progressBarEnabled } =
    useNavigationFlow((state) => state);

  const isFirstStep = percentCompleted === 0;

  if (!progressBarEnabled) {
    return null;
  }

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Box
      css={{
        position: 'relative',
        width: '100%',
        maxWidth: 920,
        marginX: 'auto',
        ...(css as any),
      }}
    >
      <Grid
        css={{
          boxShadow: '$0',
          backgroundColor: '$white100',
          paddingY: '$4',
          paddingX: '$6',
          borderRadius: '$round',
          gridTemplateRows: '4px',
          gridTemplateColumns: '1fr',
          gridGap: 0,
        }}
      >
        <Box
          css={{
            gridColumn: '1/1',
            gridRow: '1/1',
            height: 4,
            backgroundColor: '$black10',
            borderRadius: '$round',
            width: '100%',
          }}
        />
        <Box
          css={{
            gridColumn: '1/1',
            gridRow: '1/1',
            height: 4,
            borderRadius: '$round',
            transition: 'width $0 $ease',
            background:
              'linear-gradient(89.98deg, #76E650 0%, #F9D649 12.5%, #F08E35 25%, #EC5157 37.5%, #FF18BD 50%, #1A4BFF 62.5%, #62D8F9 75%, #76E650 87.5%)',
            backgroundSize: '400px auto',
          }}
          style={{
            width: isFirstStep
              ? `calc(${percentCompleted}% + 50px)`
              : `${percentCompleted}%`,
          }}
        />
      </Grid>
      <Grid
        css={{
          position: 'absolute',
          top: 'calc(100% + 24px)',
          width: '100%',
          gridTemplateColumns: `repeat(${stepCount}, 1fr)`,
          justifyContent: 'space-between',
          gridGap: 0,

          '& > div:first-of-type': {
            marginLeft: 0,

            '& span': {
              transform: 'translateX(-50%)',
            },
          },
          '& > div:last-of-type': {
            marginRight: 0,
            '& span': {
              transform: 'translateX(-50%)',
            },
          },
        }}
      >
        {navigationSteps.map((navigationStep, key) => {
          const isCurrentStep = activeStep === navigationStep?.name;
          return (
            <Box
              key={key}
              css={{
                maxWidth: 120,
                marginX: 'auto',
                textAlign: 'center',
                color: '$black50',
              }}
              className="step"
            >
              <Text
                weight={600}
                size={1}
                css={{
                  color: isCurrentStep ? '$black100' : '$black50',
                }}
              >
                <Text weight={600} size={1} as="span">
                  {navigationStep.name}
                </Text>
              </Text>
            </Box>
          );
        })}
      </Grid>
    </Box>
  );
}
