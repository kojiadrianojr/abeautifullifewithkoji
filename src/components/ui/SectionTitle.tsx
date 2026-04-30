'use client';

import { Heading, HeadingProps } from '@chakra-ui/react';

interface SectionTitleProps extends Omit<HeadingProps, 'as'> {
  children: React.ReactNode;
}

export function SectionTitle({ children, ...props }: SectionTitleProps) {
  return (
    <Heading
      as="h2"
      fontSize={{ base: '3xl', md: '5xl' }}
      fontFamily="heading"
      fontWeight="normal"
      textAlign="center"
      mb={8}
      {...props}
    >
      {children}
    </Heading>
  );
}
