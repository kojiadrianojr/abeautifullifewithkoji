'use client';

import { Button as ChakraButton, ButtonProps } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionButton = motion.create(ChakraButton);

export interface AnimatedButtonProps extends ButtonProps {
  animate?: boolean;
}

export function AnimatedButton({ animate = true, children, ...props }: AnimatedButtonProps) {
  if (!animate) {
    return <ChakraButton {...props}>{children}</ChakraButton>;
  }

  return (
    <MotionButton
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      // @ts-expect-error - transition conflict between Chakra and Framer Motion
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      {...props}
    >
      {children}
    </MotionButton>
  );
}
