'use client';

import { useState } from 'react';
import { Box, Typography, Container } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { getWeddingConfig } from '@/lib/config';
import Countdown from '@/components/Countdown';

interface SplashScreenProps {
  onEnter: () => void;
}

export default function SplashScreen({ onEnter }: SplashScreenProps) {
  const config = getWeddingConfig();
  const { wedding, theme } = config;
  const [isOpening, setIsOpening] = useState(false);

  const handleClick = () => {
    setIsOpening(true);
    setTimeout(() => {
      onEnter();
    }, 2200);
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
      <motion.div
        onClick={handleClick}
        initial={{ opacity: 1 }}
        animate={isOpening ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.7, delay: isOpening ? 1.5 : 0, ease: "easeOut" }}
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
          perspective: '1500px',
        }}
      >
        {/* Top Flap (Envelope Opening) */}
        <motion.div
          initial={{ rotateX: 0, transformOrigin: 'top center' }}
          animate={isOpening ? { 
            rotateX: -180,
            opacity: 0
          } : { rotateX: 0 }}
          transition={{ duration: 1.5, ease: [0.65, 0, 0.35, 1] }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '50%',
            background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`,
            zIndex: 2,
            transformStyle: 'preserve-3d',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: 0.1,
              backgroundImage: 'radial-gradient(circle at 20% 50%, white 2px, transparent 2px), radial-gradient(circle at 80% 80%, white 2px, transparent 2px)',
              backgroundSize: '100px 100px',
              pointerEvents: 'none',
            }}
          />
        </motion.div>

        {/* Bottom Flap (Envelope Opening) */}
        <motion.div
          initial={{ rotateX: 0, transformOrigin: 'bottom center' }}
          animate={isOpening ? { 
            rotateX: 180,
            opacity: 0
          } : { rotateX: 0 }}
          transition={{ duration: 1.5, ease: [0.65, 0, 0.35, 1] }}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '50%',
            background: `linear-gradient(135deg, ${theme.colors.secondary} 0%, ${theme.colors.primary} 100%)`,
            zIndex: 2,
            transformStyle: 'preserve-3d',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: 0.1,
              backgroundImage: 'radial-gradient(circle at 20% 50%, white 2px, transparent 2px), radial-gradient(circle at 80% 80%, white 2px, transparent 2px)',
              backgroundSize: '100px 100px',
              pointerEvents: 'none',
            }}
          />
        </motion.div>

        {/* Content Layer (Behind envelope) */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`,
            zIndex: 1,
          }}
        />

        {/* Content Container */}
        <Container 
          maxWidth="md" 
          sx={{ 
            position: 'relative',
            textAlign: 'center',
            color: 'white',
            zIndex: 3,
            pointerEvents: 'none',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isOpening ? { opacity: 0, scale: 1.1 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Couple Names */}
            <Typography
              variant="h1"
              sx={{
                fontFamily: theme.fonts.heading,
                fontSize: { xs: '3rem', sm: '4rem', md: '5.5rem' },
                fontWeight: 300,
                letterSpacing: '0.1em',
                mb: 2,
                textShadow: '2px 4px 12px rgba(0,0,0,0.2)',
              }}
            >
              {wedding.couple.partner1.firstName} & {wedding.couple.partner2.firstName}
            </Typography>

            {/* Wedding Date */}
        
            <div style={{ marginBottom: '2rem' }}>
              <Countdown />
            </div>
            

            {/* Click to Enter prompt with pulse animation */}
            {!isOpening && (
              <motion.div
                animate={{ 
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{ 
                  duration: 2,
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
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: theme.fonts.body,
                      fontSize: { xs: '1rem', sm: '1.125rem' },
                      fontWeight: 400,
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Click to Open
                  </Typography>
                  
                  {/* Envelope icon */}
                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ 
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <svg 
                      width="28" 
                      height="28" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </motion.div>
                </Box>
              </motion.div>
            )}
          </motion.div>
        </Container>

        {/* Decorative corner elements */}
        <motion.div
          initial={{ opacity: 0.3 }}
          animate={isOpening ? { opacity: 0 } : { opacity: 0.3 }}
          style={{
            position: 'absolute',
            top: 40,
            left: 40,
            width: 60,
            height: 60,
            border: '2px solid white',
            borderBottom: 'none',
            borderRight: 'none',
            zIndex: 3,
          }}
        />
        <motion.div
          initial={{ opacity: 0.3 }}
          animate={isOpening ? { opacity: 0 } : { opacity: 0.3 }}
          style={{
            position: 'absolute',
            top: 40,
            right: 40,
            width: 60,
            height: 60,
            border: '2px solid white',
            borderBottom: 'none',
            borderLeft: 'none',
            zIndex: 3,
          }}
        />
        <motion.div
          initial={{ opacity: 0.3 }}
          animate={isOpening ? { opacity: 0 } : { opacity: 0.3 }}
          style={{
            position: 'absolute',
            bottom: 40,
            left: 40,
            width: 60,
            height: 60,
            border: '2px solid white',
            borderTop: 'none',
            borderRight: 'none',
            zIndex: 3,
          }}
        />
        <motion.div
          initial={{ opacity: 0.3 }}
          animate={isOpening ? { opacity: 0 } : { opacity: 0.3 }}
          style={{
            position: 'absolute',
            bottom: 40,
            right: 40,
            width: 60,
            height: 60,
            border: '2px solid white',
            borderTop: 'none',
            borderLeft: 'none',
            zIndex: 3,
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
