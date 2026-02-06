'use client';

import { Box } from '@chakra-ui/react';
import { ChevronUpIcon } from '@chakra-ui/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedIconButton } from '@/components/ui/AnimatedIconButton';

const MotionBox = motion(Box);

interface BackToTopButtonProps {
  show: boolean;
  onClick: () => void;
}

export function BackToTopButton({ show, onClick }: BackToTopButtonProps) {
  return (
    <AnimatePresence>
      {show && (
        <MotionBox
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          position="fixed"
          right={5}
          bottom={5}
          zIndex={1000}
        >
          <AnimatedIconButton
            icon={<ChevronUpIcon />}
            onClick={onClick}
            aria-label="Scroll back to top"
            colorScheme="primary"
            size="lg"
            rounded="full"
            boxShadow="lg"
            _hover={{
              transform: 'scale(1.1)',
              boxShadow: 'xl',
            }}
          />
        </MotionBox>
      )}
    </AnimatePresence>
  );
}
