'use client';

import { useState, useRef, useCallback } from 'react';
import {
  Box,
  Text,
  VStack,
  Portal,
} from '@chakra-ui/react';
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion';
import { NavItem } from '@/services';

const MotionBox = motion.create(Box);

interface FloatingMobileNavProps {
  items: NavItem[];
  activeSection: string;
  onItemClick: (href: string) => void;
}

const BUTTON_SIZE = 56;
const EDGE_PADDING = 16;

function getInitialX() {
  if (typeof window === 'undefined') return 300;
  return window.innerWidth - BUTTON_SIZE - EDGE_PADDING;
}

function getInitialY() {
  if (typeof window === 'undefined') return 500;
  return window.innerHeight - BUTTON_SIZE - EDGE_PADDING - 80;
}

export function FloatingMobileNav({
  items,
  activeSection,
  onItemClick,
}: FloatingMobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [snappedToLeft, setSnappedToLeft] = useState(false);
  const isDragging = useRef(false);

  const x = useMotionValue(getInitialX());
  const y = useMotionValue(getInitialY());

  const handleDragEnd = useCallback(() => {
    isDragging.current = false;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const currentX = x.get();
    const currentY = y.get();

    // Snap to nearest horizontal edge
    const snapToLeft = currentX + BUTTON_SIZE / 2 < screenWidth / 2;
    const targetX = snapToLeft
      ? EDGE_PADDING
      : screenWidth - BUTTON_SIZE - EDGE_PADDING;

    // Clamp Y within screen bounds
    const targetY = Math.max(
      EDGE_PADDING,
      Math.min(currentY, screenHeight - BUTTON_SIZE - EDGE_PADDING)
    );

    animate(x, targetX, { type: 'spring', stiffness: 300, damping: 28 });
    animate(y, targetY, { type: 'spring', stiffness: 300, damping: 28 });
    setSnappedToLeft(snapToLeft);
  }, [x, y]);

  const handleItemClick = (href: string) => {
    onItemClick(href);
    setIsOpen(false);
  };

  const handleButtonClick = () => {
    // Ignore tap if it was actually the end of a drag
    if (isDragging.current) return;
    setIsOpen((prev) => !prev);
  };

  const menuAlignment = snappedToLeft ? 'left' : 'right';

  return (
    <Portal>
      {/* Backdrop overlay */}
      <AnimatePresence>
        {isOpen && (
          <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            position="fixed"
            inset={0}
            zIndex={1098}
            bg="blackAlpha.500"
            backdropFilter="blur(2px)"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Floating button + menu container */}
      <MotionBox
        drag
        dragMomentum={false}
        dragElastic={0}
        style={{ x, y, position: 'fixed', top: 0, left: 0, zIndex: 1099 }}
        onDragStart={() => { isDragging.current = true; }}
        onDragEnd={handleDragEnd}
        dragConstraints={{
          top: EDGE_PADDING,
          bottom: typeof window !== 'undefined' ? window.innerHeight - BUTTON_SIZE - EDGE_PADDING : 700,
          left: EDGE_PADDING,
          right: typeof window !== 'undefined' ? window.innerWidth - BUTTON_SIZE - EDGE_PADDING : 300,
        }}
        sx={{ touchAction: 'none' }}
      >
        {/* Nav items fan */}
        <AnimatePresence>
          {isOpen && (
            <Box
              position="absolute"
              bottom={`${BUTTON_SIZE + 8}px`}
              {...(menuAlignment === 'right' ? { right: 0 } : { left: 0 })}
              zIndex={1099}
            >
              <VStack spacing={2} align={menuAlignment === 'right' ? 'flex-end' : 'flex-start'}>
                {items.map((item, index) => {
                  const sectionId = item.href.slice(1);
                  const isActive = activeSection === sectionId;

                  return (
                    <MotionBox
                      key={item.href}
                      initial={{ opacity: 0, scale: 0.6, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.6, y: 10 }}
                      transition={{
                        duration: 0.2,
                        delay: index * 0.04,
                        ease: 'easeOut',
                      }}
                    >
                      <Box
                        as="button"
                        onClick={() => handleItemClick(item.href)}
                        px={4}
                        py={2}
                        borderRadius="full"
                        bg={isActive ? 'secondary.500' : 'rgba(255,255,255,0.95)'}
                        color={isActive ? 'white' : 'gray.700'}
                        fontSize="sm"
                        fontWeight={isActive ? 700 : 500}
                        boxShadow="lg"
                        backdropFilter="blur(8px)"
                        border="1px solid"
                        borderColor={isActive ? 'secondary.500' : 'rgba(195,177,225,0.4)'}
                        whiteSpace="nowrap"
                        cursor="pointer"
                        transition="all 0.2s ease"
                        _hover={{
                          bg: isActive ? 'secondary.600' : 'secondary.50',
                          color: isActive ? 'white' : 'secondary.600',
                          transform: 'scale(1.05)',
                        }}
                        _active={{ transform: 'scale(0.97)' }}
                      >
                        {item.label}
                      </Box>
                    </MotionBox>
                  );
                })}
              </VStack>
            </Box>
          )}
        </AnimatePresence>

        {/* Main floating button */}
        <MotionBox
          as="button"
          onClick={handleButtonClick}
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          width={`${BUTTON_SIZE}px`}
          height={`${BUTTON_SIZE}px`}
          borderRadius="full"
          bg="rgba(255,255,255,0.92)"
          backdropFilter="blur(12px)"
          boxShadow="0 4px 24px rgba(195,177,225,0.5), 0 2px 8px rgba(0,0,0,0.15)"
          border="1.5px solid"
          borderColor="secondary.300"
          display="flex"
          alignItems="center"
          justifyContent="center"
          cursor="pointer"
          position="relative"
          whileTap={{ scale: 0.92 }}
          animate={isOpen ? { rotate: 45 } : { rotate: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          {/* Decorative ring icon */}
          <Box position="relative" w="26px" h="26px">
            {/* Outer ring */}
            <Box
              position="absolute"
              inset={0}
              borderRadius="full"
              border="2px solid"
              borderColor="secondary.500"
              opacity={isOpen ? 0.5 : 1}
              transition="opacity 0.2s"
            />
            {/* Inner dot */}
            <Box
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              w="8px"
              h="8px"
              borderRadius="full"
              bg="secondary.500"
            />
            {/* Cross lines (visible when open) */}
            <AnimatePresence>
              {isOpen && (
                <>
                  <MotionBox
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    exit={{ scaleX: 0 }}
                    position="absolute"
                    top="50%"
                    left="50%"
                    style={{ transform: 'translate(-50%, -50%)' }}
                    w="18px"
                    h="2px"
                    bg="secondary.500"
                    borderRadius="full"
                  />
                  <MotionBox
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    exit={{ scaleY: 0 }}
                    position="absolute"
                    top="50%"
                    left="50%"
                    style={{ transform: 'translate(-50%, -50%)' }}
                    w="2px"
                    h="18px"
                    bg="secondary.500"
                    borderRadius="full"
                  />
                </>
              )}
            </AnimatePresence>
          </Box>

          {/* Pulse ring when closed */}
          {!isOpen && (
            <MotionBox
              position="absolute"
              inset={-1}
              borderRadius="full"
              border="1px solid"
              borderColor="secondary.400"
              animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              pointerEvents="none"
            />
          )}
        </MotionBox>

        {/* "Menu" label hint */}
        {!isOpen && (
          <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            position="absolute"
            bottom="-20px"
            left="50%"
            style={{ transform: 'translateX(-50%)' }}
            pointerEvents="none"
          >
            <Text
              fontSize="9px"
              fontWeight={600}
              color="primary.500"
              letterSpacing="0.05em"
              textTransform="uppercase"
              opacity={0.7}
            >
              Menu
            </Text>
          </MotionBox>
        )}
      </MotionBox>
    </Portal>
  );
}
