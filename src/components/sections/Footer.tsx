'use client';

import { Box, Container, Heading, Text, Link, Divider, VStack, Flex } from '@chakra-ui/react';
import { FiHeart } from 'react-icons/fi';
import { getCoupleNames, getWeddingConfig } from '@/lib/config';

export default function Footer() {
  const config = getWeddingConfig();
  const { contact, social } = config;
  const currentYear = new Date().getFullYear();

  return (
    <Box as="footer" bg="gray.900" color="white" py={16}>
      <Container maxW="7xl">
        <VStack spacing={8} textAlign="center">
          <Heading
            as="h2"
            fontSize={{ base: '3xl', md: '4xl' }}
            fontFamily="heading"
            fontWeight="bold"
          >
            {getCoupleNames()}
          </Heading>

          {social.hashtag && (
            <Heading as="h3" size="lg" color="secondary.500">
              {social.hashtag}
            </Heading>
          )}

          <VStack spacing={2}>
            {contact.email && (
              <Link
                href={`mailto:${contact.email}`}
                color="whiteAlpha.900"
                _hover={{ color: 'secondary.400' }}
                transition="color 0.3s"
              >
                {contact.email}
              </Link>
            )}
            {(contact as { email?: string; phone?: string }).phone && (
              <Link
                href={`tel:${(contact as { email?: string; phone?: string }).phone}`}
                color="whiteAlpha.900"
                _hover={{ color: 'secondary.400' }}
                transition="color 0.3s"
              >
                {(contact as { email?: string; phone?: string }).phone}
              </Link>
            )}
          </VStack>

          <Divider borderColor="gray.700" />

          <VStack spacing={2}>
            <Text fontSize="sm" color="gray.400">
              © {currentYear} {getCoupleNames()}. All rights reserved.
            </Text>
            <Flex align="center" gap={2} color="gray.500" fontSize="xs">
              <Text>Made with</Text>
              <Box as={FiHeart} color="red.400" />
              <Text>and code</Text>
            </Flex>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
}
