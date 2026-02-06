'use client';

import { Box, Container, Card, CardBody, Tag, Heading, Text, VStack } from '@chakra-ui/react';
import { getWeddingConfig } from '@/lib/config';
import { SectionTitle } from '@/components/ui/SectionTitle';

export default function Schedule() {
  const config = getWeddingConfig();
  const { schedule } = config.content;

  return (
    <Box id="schedule" as="section" py={{ base: 16, md: 24 }}>
      <Container maxW="3xl">
        <SectionTitle color="primary.500" mb={16}>
          {schedule.title}
        </SectionTitle>

        <VStack spacing={6} align="stretch">
          {schedule.events.map((event, index) => (
            <Card
              key={index}
              boxShadow="md"
              transition="all 0.3s ease"
              _hover={{
                boxShadow: 'xl',
                transform: 'translateY(-4px)',
              }}
              borderRadius="xl"
            >
              <CardBody
                display="flex"
                flexDirection={{ base: 'column', md: 'row' }}
                alignItems={{ base: 'flex-start', md: 'center' }}
                gap={6}
                p={6}
              >
                <Box minW={{ md: 120 }}>
                  <Tag
                    size="lg"
                    colorScheme="secondary"
                    fontSize="xl"
                    fontWeight="bold"
                    py={3}
                    px={4}
                  >
                    {event.time}
                  </Tag>
                </Box>

                <Box
                  flex={1}
                  borderTop={{ base: '2px solid', md: 'none' }}
                  borderLeft={{ base: 'none', md: '2px solid' }}
                  borderColor="primary.500"
                  pt={{ base: 4, md: 0 }}
                  pl={{ base: 0, md: 6 }}
                >
                  <Heading as="h3" size="md" mb={2} fontWeight="semibold">
                    {event.title}
                  </Heading>
                  <Text color="gray.600">{event.description}</Text>
                </Box>
              </CardBody>
            </Card>
          ))}
        </VStack>
      </Container>
    </Box>
  );
}
