'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Container } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { getWeddingConfig } from '@/lib/config';
import Countdown from '@/components/Countdown';

interface SplashScreenProps {
  onEnter: () => void;
}

export default function SplashScreen({ onEnter }: SplashScreenProps) {
  const config = getWeddingConfig();
  const { wedding, theme } = config;
  const [isOpening, setIsOpening] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Ensure smooth loading
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    setIsOpening(true);
    setTimeout(() => {
      onEnter();
    }, 1500);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <AnimatePresence>
      {isReady && (
        <motion.div
          onClick={handleClick}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scale: 1.05
          }}
          transition={{ 
            duration: 1.5,
            ease: [0.4, 0, 0.2, 1]
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 9999,
            overflow: 'hidden',
            background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`,
          }}
        >
          {/* Background Image */}
          <motion.div
            initial={{ scale: 1.1, opacity: 0.3 }}
            animate={isOpening ? {
              scale: 1.3,
              opacity: 0
            } : {
              scale: 1.1,
              opacity: 0.3
            }}
            transition={{ duration: 1.5 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 1,
            }}
          >
            <Image
              src="/images/hero-bg.jpg"
              alt="Wedding background"
              fill
              style={{ 
                objectFit: 'cover',
                objectPosition: 'center'
              }}
              priority
            />
          </motion.div>

          {/* Animated Overlay */}
          <motion.div
            initial={{ opacity: 0.8 }}
            animate={isOpening ? { opacity: 0 } : { opacity: 0.8 }}
            transition={{ duration: 1.2 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: `linear-gradient(135deg, ${theme.colors.primary}CC 0%, ${theme.colors.secondary}CC 100%)`,
              zIndex: 2,
            }}
          />

          {/* Reveal Animation Curtains */}
          <motion.div
            initial={{ x: '0%' }}
            animate={isOpening ? { x: '-100%' } : { x: '0%' }}
            transition={{ 
              duration: 1.2,
              ease: [0.4, 0, 0.2, 1],
              delay: isOpening ? 0.2 : 0
            }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '50%',
              height: '100%',
              background: `linear-gradient(45deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`,
              zIndex: 4,
            }}
          />
          
          <motion.div
            initial={{ x: '0%' }}
            animate={isOpening ? { x: '100%' } : { x: '0%' }}
            transition={{ 
              duration: 1.2,
              ease: [0.4, 0, 0.2, 1],
              delay: isOpening ? 0.2 : 0
            }}
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '50%',
              height: '100%',
              background: `linear-gradient(225deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`,
              zIndex: 4,
            }}
          />

          {/* Content Container */}
          <Container 
            maxWidth="md" 
            sx={{ 
              position: 'relative',
              textAlign: 'center',
              color: 'white',
              zIndex: 5,
              pointerEvents: 'none',
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={isOpening ? { 
                opacity: 0, 
                y: -20, 
                scale: 0.95 
              } : { 
                opacity: 1, 
                y: 0,
                scale: 1 
              }}
              transition={{ 
                duration: 0.8,
                delay: 0.3
              }}
            >
              {/* Couple Names */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    fontFamily: theme.fonts.heading,
                    fontSize: { xs: '3rem', sm: '4rem', md: '5.5rem' },
                    fontWeight: 300,
                    letterSpacing: '0.1em',
                    mb: 2,
                    textShadow: '3px 6px 20px rgba(0,0,0,0.6)',
                    background: 'linear-gradient(45deg, #ffffff 30%, #f8f8f8 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {wedding.couple.partner1.firstName} & {wedding.couple.partner2.firstName}
                </Typography>
              </motion.div>

              {/* Wedding Date & Countdown */}
              <motion.div 
                style={{ marginBottom: '3rem' }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9, duration: 0.8 }}
              >
                <Countdown />
              </motion.div>

              {/* Enhanced Click to Enter */}
              {!isOpening && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                >
                  <motion.div
                    animate={{ 
                      opacity: [0.7, 1, 0.7],
                      y: [0, -5, 0]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Box
                      sx={{
                        display: 'inline-flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2,
                        padding: '1.5rem 3rem',
                        borderRadius: '50px',
                        background: 'rgba(255, 255, 255, 0.15)',
                        backdropFilter: 'blur(20px)',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          fontFamily: theme.fonts.body,
                          fontSize: { xs: '1.1rem', sm: '1.25rem' },
                          fontWeight: 500,
                          letterSpacing: '0.2em',
                          textTransform: 'uppercase',
                          textShadow: '1px 2px 8px rgba(0,0,0,0.5)',
                        }}
                      >
                        Enter Our Celebration
                      </Typography>
                      
                      {/* Heart icon with enhanced animation */}
                      <motion.div
                        animate={{ 
                          scale: [1, 1.2, 1],
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <svg 
                          width="32" 
                          height="32" 
                          viewBox="0 0 24 24" 
                          fill="currentColor"
                          style={{ filter: 'drop-shadow(2px 4px 8px rgba(0,0,0,0.3))' }}
                        >
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                      </motion.div>
                    </Box>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          </Container>

          {/* Floating Elements */}
          {!isOpening && (
            <>
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    opacity: 0,
                    y: window.innerHeight,
                    x: Math.random() * window.innerWidth,
                  }}
                  animate={{ 
                    opacity: [0, 0.8, 0],
                    y: [null, -100],
                    x: [null, (Math.random() - 0.5) * 200],
                  }}
                  transition={{ 
                    duration: 4 + Math.random() * 3,
                    repeat: Infinity,
                    delay: i * 0.7,
                    ease: "easeOut"
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
            </>
          )}

          {/* Enhanced Corner Decorations */}
          {[
            { top: 30, left: 30, rotation: 0 },
            { top: 30, right: 30, rotation: 90 },
            { bottom: 30, left: 30, rotation: 270 },
            { bottom: 30, right: 30, rotation: 180 }
          ].map((corner, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isOpening ? { 
                opacity: 0, 
                scale: 0.5,
                rotate: corner.rotation + 45
              } : { 
                opacity: 0.6, 
                scale: 1,
                rotate: corner.rotation
              }}
              transition={{ 
                duration: 0.8, 
                delay: 0.4 + i * 0.1 
              }}
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
