'use client';

import React, { useState, useEffect } from 'react';
import Countdown from 'react-countdown';
import { Box, Text, Flex, VStack } from '@chakra-ui/react';
import { getWeddingConfig } from '@/lib/config';

function CountdownComponent() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Box minH={100} display="flex" alignItems="center" justifyContent="center">
        <Text fontSize="xl" opacity={0.7}>
          Loading...
        </Text>
      </Box>
    );
  }

  return (
    <Countdown
      date={new Date(getWeddingConfig().wedding.datetime).getTime()}
      renderer={renderer}
    />
  );
}

interface CountdownRenderProps {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
}

const renderer = ({ days, hours, minutes, seconds, completed }: CountdownRenderProps) => {
  if (completed) {
    return (
      <Text fontSize="2xl" fontWeight="semibold" textShadow="0 2px 4px rgba(0,0,0,0.2)">
        Today&apos;s the day! 🎉
      </Text>
    );
  }

  const timeUnits = [
    { value: days, label: 'Days' },
    { value: hours, label: 'Hours' },
    { value: minutes, label: 'Minutes' },
    { value: seconds, label: 'Seconds' },
  ];

  return (
    <Flex
      direction="row"
      gap={4}
      justifyContent="center"
      flexWrap="wrap"
    >
      {timeUnits.map((unit, index) => (
        <VStack
          key={index}
          px={{ base: 4, sm: 6 }}
          py={{ base: 3, sm: 4 }}
          bg="whiteAlpha.200"
          backdropFilter="blur(10px)"
          borderRadius="lg"
          minW={{ base: '70px', sm: '90px' }}
          textAlign="center"
          display={index === 3 ? { base: 'none', md: 'flex' } : 'flex'}
          spacing={1}
        >
          <Text
            fontSize={{ base: '3xl', sm: '4xl' }}
            fontWeight="bold"
            color="white"
            lineHeight={1}
          >
            {unit.value}
          </Text>
          <Text
            fontSize={{ base: 'xs', sm: 'sm' }}
            fontWeight="semibold"
            color="whiteAlpha.800"
            textTransform="uppercase"
            letterSpacing="wide"
          >
            {unit.label}
          </Text>
        </VStack>
      ))}
    </Flex>
  );
};

export default CountdownComponent;