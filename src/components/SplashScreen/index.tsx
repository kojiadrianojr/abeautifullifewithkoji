'use client';

import { useState, useEffect } from 'react';
import { Box, Container, Text, VStack } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { getWeddingConfig } from '@/lib/config';

const MotionBox = motion.create(Box);
const MotionVStack = motion.create(VStack);
const MotionText = motion.create(Text);

interface SplashScreenProps {
  onEnter: () => void;
}

export default function SplashScreen({ onEnter }: SplashScreenProps) {
  const config = getWeddingConfig();
  const { wedding, theme } = config;
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initial fade in
    const readyTimer = setTimeout(() => setIsReady(true), 100);

    // Auto-transition after couple reaches church (2.8s animation + 0.5s pause)
    const autoEnterTimer = setTimeout(() => {
      onEnter();
    }, 3300);

    return () => {
      clearTimeout(readyTimer);
      clearTimeout(autoEnterTimer);
    };
  }, [onEnter]);

  const name1 = wedding.couple.partner1.firstName;
  const name2 = wedding.couple.partner2.firstName;

  return (
    <AnimatePresence>
      {isReady && (
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          position="fixed"
          top={0}
          left={0}
          w="100vw"
          h="100vh"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          zIndex={9999}
          overflow="hidden"
          bgGradient={`linear(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`}
        >
          {/* Content */}
          <Container
            maxW="4xl"
            position="relative"
            textAlign="center"
            color="white"
            zIndex={2}
          >
            <MotionVStack spacing={16}>
              {/* Logo */}
              <Box>
                <MotionText
                  as="h1"
                  fontFamily="heading"
                  fontSize={{ base: '5xl', sm: '6xl', md: '8xl', lg: '9xl' }}
                  fontWeight={200}
                  letterSpacing="wider"
                  textShadow="2px 4px 12px rgba(0,0,0,0.3)"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                  }}
                  transition={{ 
                    duration: 1,
                    delay: 0.2,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                >
                  {name1}
                  <motion.span
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, -3, 3, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: 'reverse',
                      ease: 'easeInOut'
                    }}
                    style={{ 
                      display: 'inline-block',
                      margin: '0 0.2em',
                      fontWeight: 400
                    }}
                  >
                    &
                  </motion.span>
                  {name2}
                </MotionText>
              </Box>

              {/* Loading Animation */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <VStack spacing={6}>
                  {/* Bride and Groom Traveling to Church */}
                  <Box 
                    position="relative" 
                    w="300px" 
                    h="60px" 
                    display="flex" 
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    {/* Path/Road */}
                    <Box
                      position="absolute"
                      bottom="20px"
                      left={0}
                      right={0}
                      h="2px"
                      bg="whiteAlpha.400"
                      borderRadius="full"
                    />
                    
                    {/* Traveling Couple */}
                    <motion.div
                      initial={{ x: 0 }}
                      animate={{
                        x: 220,
                      }}
                      transition={{
                        duration: 2.8,
                        ease: [0.4, 0, 0.2, 1],
                        delay: 0.3
                      }}
                      style={{
                        position: 'absolute',
                        left: 0,
                        display: 'flex',
                        gap: '4px',
                        fontSize: '32px',
                      }}
                    >
                      <motion.span
                        animate={{
                          y: [0, -3, 0],
                        }}
                        transition={{
                          duration: 0.4,
                          repeat: 7,
                          ease: 'easeInOut'
                        }}
                      >
                        🤵‍♂️
                      </motion.span>
                      <motion.span
                        animate={{
                          y: [0, -3, 0],
                        }}
                        transition={{
                          duration: 0.4,
                          repeat: 7,
                          ease: 'easeInOut',
                          delay: 0.2
                        }}
                      >
                        👰‍♀️
                      </motion.span>
                    </motion.div>

                    {/* Church Destination */}
                    <motion.div
                      style={{
                        position: 'absolute',
                        right: 0,
                        fontSize: '40px',
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                      }}
                      animate={{
                        scale: [1, 1.1, 1]
                      }}
                      transition={{
                        duration: 0.6,
                        delay: 2.8,
                        ease: 'easeInOut'
                      }}
                    >
                      ⛪
                    </motion.div>
                  </Box>

                  {/* Loading Text */}
                  <motion.div
                    animate={{ 
                      opacity: [0.6, 1, 0.6]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      ease: 'easeInOut' 
                    }}
                  >
                    <Text
                      fontSize={{ base: 'sm', sm: 'md' }}
                      fontWeight="light"
                      letterSpacing="widest"
                      textTransform="uppercase"
                      textShadow="1px 2px 6px rgba(0,0,0,0.3)"
                    >
                      Every detail made with love—just a moment…
                    </Text>
                  </motion.div>
                </VStack>
              </motion.div>
            </MotionVStack>
          </Container>
        </MotionBox>
      )}
    </AnimatePresence>
  );
}
