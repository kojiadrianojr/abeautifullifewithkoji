'use client';

import { Box, Container, Text, Divider, Flex } from '@chakra-ui/react';
import { getWeddingConfig } from '@/lib/config';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { TimelineCard } from '@/components/ui/TimelineCard';

export default function Story() {
  const config = getWeddingConfig();
  const { story } = config.content;

  return (
    <Box
      id="story"
      as="section"
      py={{ base: 16, md: 24 }}
      bg="gray.50"
      position="relative"
      overflow="hidden"
    >
      {/* Decorative elements */}
      <Box position="absolute" top={10} right={10} fontSize="6xl" opacity={0.1}>
        🌸
      </Box>
      <Box position="absolute" bottom={10} left={10} fontSize="6xl" opacity={0.1}>
        🌺
      </Box>

      <Container maxW="7xl">
        <SectionTitle
          bgGradient="linear(to-r, purple.500, orange.400)"
          bgClip="text"
          mb={2}
        >
          {story.title}
        </SectionTitle>

        <Divider
          w={100}
          h={1}
          mx="auto"
          mb={16}
          borderRadius="md"
          bgGradient="linear(to-r, pink.500, orange.400, pink.500)"
          border="none"
        />

        <Text
          fontSize={{ base: 'lg', md: 'xl' }}
          textAlign="center"
          maxW="3xl"
          mx="auto"
          mb={20}
          lineHeight={1.8}
          color="gray.600"
        >
          {story.content}
        </Text>

        {/* Timeline */}
        <Box maxW="4xl" mx="auto">
          {story.timeline.map((item, index) => {
            const isEven = index % 2 === 0;
            return (
              <Flex
                key={index}
                direction={{ base: 'column', md: isEven ? 'row' : 'row-reverse' }}
                gap={8}
                mb={16}
              >
                <Box
                  flex={1}
                  textAlign={{ base: 'center', md: isEven ? 'right' : 'left' }}
                >
                  <TimelineCard
                    year={item.year}
                    title={item.title}
                    description={item.description}
                  />
                </Box>

                <Flex
                  justify="center"
                  align="center"
                  position="relative"
                >
                  <Box
                    w={6}
                    h={6}
                    borderRadius="full"
                    border="4px solid white"
                    boxShadow="md"
                    bgGradient="linear(135deg, pink.500, orange.400)"
                  />
                </Flex>

                <Box flex={1} display={{ base: 'none', md: 'block' }} />
              </Flex>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
}
