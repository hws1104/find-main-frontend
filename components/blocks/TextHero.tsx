import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import Box from 'components/base/Box';
import Heading from 'components/base/Heading';

const MotionBox = motion(Box);

interface TextHeroProps {
  heading: string;
  subheading: string;
}

export function TextHero(props: TextHeroProps): JSX.Element {
  const { heading, subheading } = props;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 450);
  }, []);

  const heroVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 1,
        delayChildren: 0.2,
        staggerChildren: 0.15,
      },
    },
  };

  const item = {
    hidden: {
      opacity: 0,
      y: 40,
      transition: {
        ease: [0.23, 1, 0.32, 1],
        duration: 1.4,
      },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        ease: [0.23, 1, 0.32, 1],
        duration: 1.4,
      },
    },
  };

  const animateProps = {
    animate: visible ? 'visible' : 'hidden',
    initial: 'hidden',
  };

  return (
    <motion.div variants={heroVariants} {...animateProps}>
      <Box css={{ display: 'flex', minHeight: '80vh', position: 'relative' }}>
        <Box
          css={{
            bg: '$white100',
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            width: '100%',
            textAlign: 'center',
            padding: '$7',
            '@bp0': {
              padding: '$9',
            },
          }}
        >
          <MotionBox css={{ position: 'relative' }} variants={item}>
            <Heading
              css={{
                fontSize: 'calc(8.8262910798vw + 12.9014084507px)',
                lineHeight: 0.8,
                letterSpacing: '-0.3vw',
                color: '$black100',
                paddingBottom: '$7',
                maxWidth: '80vw',
                '@bp0': {
                  paddingBottom: '$8',
                },
              }}
            >
              {heading}
            </Heading>
          </MotionBox>
          <MotionBox css={{ position: 'relative' }} variants={item}>
            <Heading
              css={{
                color: '$black100',
                maxWidth: '620px',
                fontSize: '$0',
                fontFamily: '$mono',
                fontWeight: 400,
                lineHeight: 1.5,
                textAlign: 'center',
                letterSpacing: 2,
                textTransform: 'uppercase',
              }}
            >
              {subheading}
            </Heading>
          </MotionBox>
        </Box>
      </Box>
    </motion.div>
  );
}
