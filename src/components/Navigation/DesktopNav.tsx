'use client';

import { Box, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { NavItem } from '@/services';

const MotionBox = motion.create(Box);

interface NavButtonProps {
  item: NavItem;
  isActive: boolean;
  isHero: boolean;
  onItemClick: (href: string) => void;
  direction?: 'left' | 'right';
}

function NavButton({ item, isActive, isHero, onItemClick, direction = 'right' }: NavButtonProps) {
  const xOffset = direction === 'left' ? -8 : 8;
  const textColor = isActive ? (isHero ? 'white' : 'secondary.600') : isHero ? 'rgba(255,255,255,0.85)' : 'gray.700';
  const hoverColor = isActive ? (isHero ? 'white' : 'secondary.600') : isHero ? 'white' : 'secondary.600';
  const hoverBg = isActive
    ? undefined
    : isHero
    ? 'rgba(255,255,255,0.15)'
    : 'rgba(195,177,225,0.18)';

  return (
    <MotionBox
      layout
      initial={{ opacity: 0, x: xOffset }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: xOffset }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      whileHover={{ scale: 1.04 }}
      flexShrink={0}
    >
      <Box
        as="button"
        onClick={() => onItemClick(item.href)}
        position="relative"
        px={3}
        py={1.5}
        borderRadius="full"
        cursor="pointer"
        sx={{ whiteSpace: 'nowrap' }}
        transition="background 0.2s ease"
        _hover={{
          bg: hoverBg,
          '& > span': { color: hoverColor },
        }}
      >
        {isActive && (
          <MotionBox
            layoutId="active-capsule"
            position="absolute"
            inset={0}
            bg={isHero ? 'rgba(255,255,255,0.2)' : 'secondary.50'}
            zIndex={0}
            style={{ borderRadius: '9999px' }}
          />
        )}
        <Text
          as="span"
          position="relative"
          zIndex={1}
          fontSize="xs"
          fontWeight={isActive ? 600 : 500}
          color={textColor}
          style={{ transition: 'color 0.35s ease' }}
        >
          {item.label}
        </Text>
      </Box>
    </MotionBox>
  );
}

interface DesktopNavProps {
  items: NavItem[];
  activeSection: string;
  trigger: boolean;
  onItemClick: (href: string) => void;
  onLogoClick: () => void;
}

export function DesktopNav({
  items,
  activeSection,
  trigger,
  onItemClick,
  onLogoClick,
}: DesktopNavProps) {
  const isHero = !trigger;

  const half = Math.ceil(items.length / 2);
  const leftItems = items.slice(0, half);
  const rightItems = items.slice(half);

  // Pill surface transitions between clear glass (hero) and frosted white (scrolled)
  const pillBg = isHero ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.88)';
  const pillBorder = isHero ? 'rgba(255, 255, 255, 0.30)' : 'rgba(195, 177, 225, 0.45)';
  const pillShadow = isHero
    ? '0 4px 24px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.2)'
    : '0 8px 32px rgba(195, 177, 225, 0.25), 0 2px 8px rgba(0,0,0,0.06)';
  const dividerBg = isHero ? 'rgba(255,255,255,0.30)' : 'rgba(195, 177, 225, 0.55)';
  const logoColor = isHero ? 'white' : 'primary.500';

  return (
    <Box
      position="fixed"
      top={4}
      left="50%"
      style={{ transform: 'translateX(-50%)' }}
      zIndex={1100}
    >
      <MotionBox
        layout
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 350, damping: 35 }}
        display="inline-flex"
        alignItems="center"
        backdropFilter="blur(16px)"
        px={2}
        py={1.5}
        style={{
          borderRadius: '9999px',
          background: pillBg,
          border: `1.5px solid ${pillBorder}`,
          boxShadow: pillShadow,
          transition: 'background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease',
        }}
      >
        {/* Left nav items */}
        {leftItems.map((item) => {
          const sectionId = item.href.slice(1);
          return (
            <NavButton
              key={item.href}
              item={item}
              isActive={activeSection === sectionId}
              isHero={isHero}
              onItemClick={onItemClick}
              direction="left"
            />
          );
        })}

        {/* Left divider */}
        <Box w="1px" h="16px" bg={dividerBg} mx={2} flexShrink={0} />

        {/* K & B monogram */}
        <Box
          as="button"
          onClick={onLogoClick}
          px={3}
          py={1}
          borderRadius="full"
          cursor="pointer"
          flexShrink={0}
          _hover={{ opacity: 0.7 }}
          transition="all 0.25s ease"
          aria-label="Scroll to top"
        >
          <Text
            fontFamily="heading"
            fontWeight="normal"
            fontSize="lg"
            color={logoColor}
            lineHeight={1}
            whiteSpace="nowrap"
            style={{ transition: 'color 0.35s ease' }}
          >
            K & B
          </Text>
        </Box>

        {/* Right divider */}
        <Box w="1px" h="16px" bg={dividerBg} mx={2} flexShrink={0} />

        {/* Right nav items */}
        {rightItems.map((item) => {
          const sectionId = item.href.slice(1);
          return (
            <NavButton
              key={item.href}
              item={item}
              isActive={activeSection === sectionId}
              isHero={isHero}
              onItemClick={onItemClick}
              direction="right"
            />
          );
        })}
      </MotionBox>
    </Box>
  );
}
