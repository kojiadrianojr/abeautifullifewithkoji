'use client';

import { Box, BoxProps } from '@chakra-ui/react';

interface SectionContainerProps extends BoxProps {
  children: React.ReactNode;
  fullWidth?: boolean;
}

export function SectionContainer({ children, fullWidth = false, ...props }: SectionContainerProps) {
  return (
    <Box
      as="section"
      py={{ base: 16, md: 24 }}
      px={{ base: 4, md: 8 }}
      {...props}
    >
      {fullWidth ? (
        children
      ) : (
        <Box maxW="7xl" mx="auto">
          {children}
        </Box>
      )}
    </Box>
  );
}
