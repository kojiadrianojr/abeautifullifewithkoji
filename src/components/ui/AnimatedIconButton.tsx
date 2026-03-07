'use client';

import { IconButton, IconButtonProps } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionIconButton = motion.create(IconButton);

export interface AnimatedIconButtonProps extends IconButtonProps {
  animate?: boolean;
}

export function AnimatedIconButton({ animate = true, ...props }: AnimatedIconButtonProps) {
  if (!animate) {
    return <IconButton {...props} />;
  }

  return (
    <MotionIconButton
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      // @ts-expect-error - transition conflict between Chakra and Framer Motion
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      {...props}
    />
  );
}
