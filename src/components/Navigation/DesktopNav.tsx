'use client';

import { Flex, Button } from '@chakra-ui/react';
import { NavItem } from '@/lib/navigation';

interface DesktopNavProps {
  items: NavItem[];
  activeSection: string;
  trigger: boolean;
  onItemClick: (href: string) => void;
}

export function DesktopNav({ items, activeSection, trigger, onItemClick }: DesktopNavProps) {
  return (
    <Flex gap={1}>
      {items.map((item) => {
        const sectionId = item.href.slice(1);
        const isActive = activeSection === sectionId;

        return (
          <Button
            key={item.href}
            onClick={() => onItemClick(item.href)}
            variant="ghost"
            size={trigger ? 'sm' : 'md'}
            px={trigger ? 3 : 4}
            color={
              trigger
                ? isActive
                  ? 'primary.500'
                  : 'gray.700'
                : isActive
                ? 'white'
                : 'whiteAlpha.900'
            }
            fontWeight={600}
            fontSize={trigger ? 'xs' : 'sm'}
            textShadow={trigger ? 'none' : '0 1px 2px rgba(0,0,0,0.3)'}
            position="relative"
            _hover={{
              color: trigger ? 'primary.500' : 'white',
              bg: trigger ? 'primary.50' : 'whiteAlpha.100',
            }}
            _after={
              isActive
                ? {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '60%',
                    height: '2px',
                    bg: trigger ? 'primary.500' : 'white',
                    borderRadius: '2px',
                  }
                : {}
            }
            transition="all 0.3s ease"
          >
            {item.label}
          </Button>
        );
      })}
    </Flex>
  );
}
