'use client';

import {
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  Button,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { NavItem } from '@/lib/navigation';
import { AnimatedIconButton } from '@/components/ui/AnimatedIconButton';

interface MobileNavProps {
  items: NavItem[];
  activeSection: string;
  isOpen: boolean;
  trigger: boolean;
  onToggle: () => void;
  onItemClick: (href: string) => void;
}

export function MobileNav({
  items,
  activeSection,
  isOpen,
  trigger,
  onToggle,
  onItemClick,
}: MobileNavProps) {
  return (
    <>
      <AnimatedIconButton
        icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
        onClick={onToggle}
        aria-label="Toggle menu"
        color={trigger ? 'primary.500' : 'white'}
        variant="ghost"
        fontSize="xl"
      />

      <Drawer isOpen={isOpen} placement="right" onClose={onToggle}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody pt={16}>
            <VStack spacing={2} align="stretch">
              {items.map((item) => {
                const sectionId = item.href.slice(1);
                const isActive = activeSection === sectionId;

                return (
                  <Button
                    key={item.href}
                    onClick={() => onItemClick(item.href)}
                    variant={isActive ? 'solid' : 'ghost'}
                    colorScheme={isActive ? 'primary' : 'gray'}
                    justifyContent="flex-start"
                    fontWeight={isActive ? 700 : 500}
                    size="lg"
                  >
                    {item.label}
                  </Button>
                );
              })}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
