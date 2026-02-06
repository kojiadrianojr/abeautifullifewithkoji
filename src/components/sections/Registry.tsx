'use client';

import { Box, Container, Text, SimpleGrid, Card, CardBody, Link, Heading, Flex } from '@chakra-ui/react';
import { FiGift, FiArrowRight } from 'react-icons/fi';
import { getWeddingConfig } from '@/lib/config';
import { SectionTitle } from '@/components/ui/SectionTitle';

export default function Registry() {
  const config = getWeddingConfig();
  const { registry } = config.content;

  return (
    <Box id="registry" as="section" py={{ base: 16, md: 24 }} bg="gray.100">
      <Container maxW="3xl">
        <SectionTitle color="primary.500" mb={8}>
          {registry.title}
        </SectionTitle>

        <Text
          fontSize={{ base: 'lg', md: 'xl' }}
          textAlign="center"
          maxW="2xl"
          mx="auto"
          mb={16}
          color="gray.600"
        >
          {registry.message}
        </Text>

        <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={6} maxW="2xl" mx="auto">
          {registry.registries.map((reg, index) => (
            <Link
              key={index}
              href={reg.url}
              isExternal
              _hover={{ textDecoration: 'none' }}
            >
              <Card
                boxShadow="md"
                textAlign="center"
                transition="all 0.3s ease"
                cursor="pointer"
                _hover={{
                  boxShadow: 'xl',
                  transform: 'translateY(-8px)',
                  '& .gift-icon': {
                    transform: 'scale(1.1)',
                  },
                  '& .view-text': {
                    color: 'primary.500',
                  },
                  '& .arrow-icon': {
                    transform: 'translateX(4px)',
                  },
                }}
                borderRadius="xl"
              >
                <CardBody p={8}>
                  <Box
                    className="gift-icon"
                    as={FiGift}
                    fontSize="6xl"
                    color="primary.500"
                    mb={4}
                    mx="auto"
                    transition="transform 0.3s ease"
                  />
                  <Heading as="h3" size="md" mb={4} fontWeight="semibold">
                    {reg.name}
                  </Heading>
                  <Flex
                    className="view-text"
                    align="center"
                    justify="center"
                    gap={2}
                    color="gray.600"
                    fontWeight="medium"
                    transition="color 0.3s ease"
                  >
                    <Text>View Registry</Text>
                    <Box
                      className="arrow-icon"
                      as={FiArrowRight}
                      transition="transform 0.3s ease"
                    />
                  </Flex>
                </CardBody>
              </Card>
            </Link>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}
