'use client';

import { VStack, Heading, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionVStack = motion(VStack);
const MotionHeading = motion(Heading);
const MotionText = motion(Text);

interface HeroContentProps {
  tagline: string;
  coupleNames: string;
  weddingDate: string;
  weddingTime: string;
  venueName: string;
  mounted: boolean;
}

export function HeroContent({
  tagline,
  coupleNames,
  weddingDate,
  weddingTime,
  venueName,
  mounted,
}: HeroContentProps) {
  return (
    <VStack spacing={6} color="white" textAlign="center">
      <MotionText
        fontSize={{ base: 'xl', md: '2xl' }}
        fontWeight={300}
        letterSpacing="wider"
        initial={{ y: -20, opacity: 0 }}
        animate={mounted ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 2 }}
      >
        {tagline}
      </MotionText>

      <MotionHeading
        as="h1"
        fontSize={{ base: '5xl', sm: '6xl', md: '7xl', lg: '8xl' }}
        fontWeight="bold"
        letterSpacing="tight"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={mounted ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 1.2 }}
      >
        {coupleNames}
      </MotionHeading>

      <MotionVStack
        spacing={1}
        initial={{ y: 20, opacity: 0 }}
        animate={mounted ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 1.5 }}
      >
        <Text fontSize={{ base: 'xl', md: '2xl' }}>{weddingDate}</Text>
        <Text fontSize={{ base: 'xl', md: '2xl' }}>{weddingTime}</Text>
        <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight={300}>
          {venueName}
        </Text>
      </MotionVStack>
    </VStack>
  );
}
