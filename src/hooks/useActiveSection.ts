'use client';

import { useState, useEffect } from 'react';

interface UsActiveSectionOptions {
  sectionIds: string[];
  offset?: number;
}

export function useActiveSection({ sectionIds, offset = 100 }: UsActiveSectionOptions) {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const currentSection = sectionIds.find(sectionId => {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= offset && rect.bottom >= offset;
        }
        return false;
      });

      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionIds, offset]);

  return activeSection;
}
