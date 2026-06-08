'use client';

import { Box, Heading, Text, HeadingProps } from '@chakra-ui/react';

interface SectionTitleProps extends Omit<HeadingProps, 'as'> {
  children: React.ReactNode;
  subtitle?: string;
}

export function SectionTitle({ children, subtitle, mb = 8, ...props }: SectionTitleProps) {
  return (
    <Box textAlign="center" mb={mb}>
      <Heading
        as="h2"
        fontSize={{ base: '3xl', md: '5xl' }}
        fontFamily="heading"
        fontWeight="normal"
        textAlign="center"
        mb={3}
        {...props}
      >
        {children}
      </Heading>

      {/* Elegant gold underline ornament */}
      <Box
        w="56px"
        h="1px"
        bg="primary.400"
        mx="auto"
        opacity={0.7}
        mb={subtitle ? 4 : 0}
      />

      {subtitle && (
        <Text
          fontFamily="display"
          fontStyle="italic"
          fontSize={{ base: 'sm', md: 'md' }}
          color="gray.500"
          mt={3}
        >
          {subtitle}
        </Text>
      )}
    </Box>
  );
}
