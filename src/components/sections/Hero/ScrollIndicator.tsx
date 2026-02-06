'use client';

import { Box } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

export function ScrollIndicator() {
  return (
    <Box
      position="absolute"
      bottom={8}
      left="50%"
      transform="translateX(-50%)"
      sx={{
        '@keyframes bounce': {
          '0%, 100%': {
            transform: 'translateX(-50%) translateY(0)',
          },
          '50%': {
            transform: 'translateX(-50%) translateY(-10px)',
          },
        },
        animation: 'bounce 2s infinite',
      }}
    >
      <ChevronDownIcon fontSize="6xl" color="white" />
    </Box>
  );
}
