'use client';

import { useState, useEffect } from 'react';
import { Box, Container, Text, VStack } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { getWeddingConfig } from '@/lib/config';
import Countdown from '@/components/Countdown';

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);

interface SplashScreenProps {
  onEnter: () => void;
}

export default function SplashScreen({ onEnter }: SplashScreenProps) {
  const config = getWeddingConfig();
  const { wedding, theme } = config;
  const [isOpening, setIsOpening] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    setIsOpening(true);
    setTimeout(() => {
      onEnter();
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isReady && (
        <MotionBox
          onClick={handleClick}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
          position="fixed"
          top={0}
          left={0}
          w="100vw"
          h="100vh"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          cursor="pointer"
          zIndex={9999}
          overflow="hidden"
          bgGradient={`linear(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`}
        >
          {/* Background Image */}
          <MotionBox
            initial={{ scale: 1.1, opacity: 0.3 }}
            animate={
              isOpening
                ? { scale: 1.3, opacity: 0 }
                : { scale: 1.1, opacity: 0.3 }
            }
            transition={{ duration: 1.5 }}
            position="absolute"
            top={0}
            left={0}
            w="full"
            h="full"
            zIndex={1}
          >
            <Image
              src="/images/hero-bg.jpg"
              alt="Wedding background"
              fill
              style={{ objectFit: 'cover', objectPosition: 'center' }}
              priority
            />
          </MotionBox>

          {/* Overlay */}
          <MotionBox
            initial={{ opacity: 0.8 }}
            animate={isOpening ? { opacity: 0 } : { opacity: 0.8 }}
            transition={{ duration: 1.2 }}
            position="absolute"
            top={0}
            left={0}
            w="full"
            h="full"
            bgGradient={`linear(135deg, ${theme.colors.primary}CC 0%, ${theme.colors.secondary}CC 100%)`}
            zIndex={2}
          />

          {/* Reveal Curtains */}
          <MotionBox
            initial={{ x: '0%' }}
            animate={isOpening ? { x: '-100%' } : { x: '0%' }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1], delay: isOpening ? 0.2 : 0 }}
            position="absolute"
            top={0}
            left={0}
            w="50%"
            h="full"
            bgGradient={`linear(45deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`}
            zIndex={4}
          />

          <MotionBox
            initial={{ x: '0%' }}
            animate={isOpening ? { x: '100%' } : { x: '0%' }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1], delay: isOpening ? 0.2 : 0 }}
            position="absolute"
            top={0}
            right={0}
            w="50%"
            h="full"
            bgGradient={`linear(225deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`}
            zIndex={4}
          />

          {/* Content */}
          <Container
            maxW="3xl"
            position="relative"
            textAlign="center"
            color="white"
            zIndex={5}
            pointerEvents="none"
          >
            <MotionVStack
              spacing={8}
              initial={{ opacity: 0, y: 50 }}
              animate={
                isOpening
                  ? { opacity: 0, y: -20, scale: 0.95 }
                  : { opacity: 1, y: 0, scale: 1 }
              }
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <Text
                  as="h1"
                  fontFamily="heading"
                  fontSize={{ base: '5xl', sm: '6xl', md: '7xl' }}
                  fontWeight={300}
                  letterSpacing="wider"
                  textShadow="3px 6px 20px rgba(0,0,0,0.6)"
                  bgGradient="linear(45deg, #ffffff 30%, #f8f8f8 100%)"
                  bgClip="text"
                >
                  {wedding.couple.partner1.firstName} &{' '}
                  {wedding.couple.partner2.firstName}
                </Text>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9, duration: 0.8 }}
              >
                <Countdown />
              </motion.div>

              {!isOpening && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                >
                  <motion.div
                    animate={{ opacity: [0.7, 1, 0.7], y: [0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <VStack
                      spacing={4}
                      px={12}
                      py={6}
                      borderRadius="full"
                      bg="whiteAlpha.200"
                      backdropFilter="blur(20px)"
                      border="2px solid"
                      borderColor="whiteAlpha.300"
                      boxShadow="0 8px 32px rgba(0, 0, 0, 0.3)"
                    >
                      <Text
                        fontSize={{ base: 'lg', sm: 'xl' }}
                        fontWeight="medium"
                        letterSpacing="widest"
                        textTransform="uppercase"
                        textShadow="1px 2px 8px rgba(0,0,0,0.5)"
                      >
                        Enter Our Celebration
                      </Text>

                      <motion.div
                        animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        <Box
                          as="svg"
                          w={8}
                          h={8}
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          filter="drop-shadow(2px 4px 8px rgba(0,0,0,0.3))"
                        >
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </Box>
                      </motion.div>
                    </VStack>
                  </motion.div>
                </motion.div>
              )}
            </MotionVStack>
          </Container>

          {/* Floating Particles */}
          {!isOpening &&
            [...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  opacity: 0,
                  y: typeof window !== 'undefined' ? window.innerHeight : 800,
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
                }}
                animate={{
                  opacity: [0, 0.8, 0],
                  y: [-100],
                  x: [(Math.random() - 0.5) * 200],
                }}
                transition={{
                  duration: 4 + Math.random() * 3,
                  repeat: Infinity,
                  delay: i * 0.7,
                  ease: 'easeOut',
                }}
                style={{
                  position: 'absolute',
                  width: 6 + Math.random() * 8,
                  height: 6 + Math.random() * 8,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.8)',
                  zIndex: 3,
                  pointerEvents: 'none',
                  boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
                }}
              />
            ))}

          {/* Corner Decorations */}
          {[
            { top: '30px', left: '30px', rotation: 0 },
            { top: '30px', right: '30px', rotation: 90 },
            { bottom: '30px', left: '30px', rotation: 270 },
            { bottom: '30px', right: '30px', rotation: 180 },
          ].map((corner, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={
                isOpening
                  ? { opacity: 0, scale: 0.5, rotate: corner.rotation + 45 }
                  : { opacity: 0.6, scale: 1, rotate: corner.rotation }
              }
              transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }}
              style={{
                position: 'absolute',
                ...corner,
                width: 60,
                height: 60,
                border: '3px solid rgba(255, 255, 255, 0.8)',
                borderBottom: 'none',
                borderRight: 'none',
                borderRadius: '8px 0 0 0',
                zIndex: 5,
                boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
              }}
            />
          ))}
        </MotionBox>
      )}
    </AnimatePresence>
  );
}
