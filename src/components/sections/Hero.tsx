'use client';

import { Box, Container } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { getCoupleNames, formatWeddingDate, getWeddingConfig } from '@/lib/config';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { useMounted } from '@/hooks/useMounted';
import { ParallaxBackground } from '@/components/ui/ParallaxBackground';
import Countdown from '@/components/Countdown';
import { HeroContent } from './Hero/HeroContent';
import { ScrollIndicator } from './Hero/ScrollIndicator';

const MotionBox = motion(Box);

export default function Hero() {
  const config = getWeddingConfig();
  const { hero } = config.content;
  const { time, venue } = config.wedding;
  const { scrollY } = useScrollPosition();
  const mounted = useMounted();

  return (
    <Box
      id="hero"
      as="section"
      position="relative"
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      overflow="hidden"
    >
      <ParallaxBackground imageUrl={hero.backgroundImage} scrollY={scrollY} />

      <Container maxW="7xl" position="relative" zIndex={10} px={4}>
        <HeroContent
          tagline={hero.tagline}
          coupleNames={getCoupleNames()}
          weddingDate={formatWeddingDate()}
          weddingTime={time}
          venueName={venue.ceremony.name}
          mounted={mounted}
        />

        <MotionBox
          mt={6}
          initial={{ opacity: 0 }}
          animate={mounted ? { opacity: 1 } : {}}
          transition={{ duration: 1.5, delay: 0.4 }}
        >
          <Countdown />
        </MotionBox>
      </Container>

      <ScrollIndicator />
    </Box>
  );
}
