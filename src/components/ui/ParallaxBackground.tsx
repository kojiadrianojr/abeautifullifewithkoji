'use client';

import { Box, BoxProps } from '@chakra-ui/react';

interface ParallaxBackgroundProps extends BoxProps {
  imageUrl: string;
  overlayOpacity?: number;
  scrollY?: number;
}

export function ParallaxBackground({
  imageUrl,
  overlayOpacity = 0.3,
  scrollY = 0,
  ...props
}: ParallaxBackgroundProps) {
  return (
    <>
      <Box
        position="absolute"
        inset={0}
        bgImage={`linear-gradient(rgba(0, 0, 0, ${overlayOpacity}), rgba(0, 0, 0, ${overlayOpacity})), url(${imageUrl})`}
        bgSize="cover"
        bgPosition="center"
        transform={`translateY(${scrollY * 0.5}px) scale(1.1)`}
        transition="transform 0.1s"
        {...props}
      />
      <Box
        position="absolute"
        inset={0}
        bgGradient="linear(to-b, transparent, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.3))"
      />
    </>
  );
}
