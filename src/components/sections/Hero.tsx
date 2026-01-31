'use client';

import { useEffect, useState } from 'react';
import { Box, Typography, Container, Fade, Grow, Slide } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { getCoupleNames, formatWeddingDate, getWeddingConfig } from '@/lib/config';
import Countdown from '@/components/Countdown';

export default function Hero() {
  const config = getWeddingConfig();
  const { hero } = config.content;
  const { time, venue } = config.wedding;
  const [scrollY, setScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Box
      id="hero"
      component="section"
      sx={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Parallax Background */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${hero.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: `translateY(${scrollY * 0.5}px) scale(1.1)`,
          transition: 'transform 0.1s',
        }}
      />

      {/* Overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.3))',
        }}
      />

      {/* Content */}
      <Container
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          color: 'white',
          px: 2,
        }}
      >
        <Slide direction="down" in={mounted} timeout={2000}>
          <Typography
            variant="h5"
            component="p"
            sx={{
              mb: 2,
              fontWeight: 300,
              letterSpacing: '0.1em',
              fontSize: { xs: '1.25rem', md: '1.5rem' },
            }}
          >
            {hero.tagline}
          </Typography>
        </Slide>

        <Grow in={mounted} timeout={1200} style={{ transformOrigin: 'center' }}>
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 4,
              letterSpacing: '-0.02em',
              fontSize: { xs: '3rem', sm: '4rem', md: '5.5rem', lg: '7rem' },
            }}
          >
            {getCoupleNames()}
          </Typography>
        </Grow>

        <Slide direction="up" in={mounted} timeout={1500}>
          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h5"
              component="p"
              sx={{
                mb: 1,
                fontSize: { xs: '1.25rem', md: '1.5rem' },
              }}
            >
              {formatWeddingDate()}
            </Typography>
            <Typography
              variant="h5"
              component="p"
              sx={{
                mb: 1,
                fontSize: { xs: '1.25rem', md: '1.5rem' },
              }}
            >
              {time}
            </Typography>
            <Typography
              variant="h5"
              component="p"
              sx={{
                fontWeight: 300,
                fontSize: { xs: '1.25rem', md: '1.5rem' },
              }}
            >
              {venue.ceremony.name}
            </Typography>
          </Box>
        </Slide>

        <Fade in={mounted} timeout={1500} style={{ transitionDelay: '400ms' }}>
          <Box>
            <Countdown />
          </Box>
        </Fade>
      </Container>

      {/* Scroll indicator */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 32,
          left: '50%',
          transform: 'translateX(-50%)',
          animation: 'bounce 2s infinite',
          '@keyframes bounce': {
            '0%, 100%': {
              transform: 'translateX(-50%) translateY(0)',
            },
            '50%': {
              transform: 'translateX(-50%) translateY(-10px)',
            },
          },
        }}
      >
        <KeyboardArrowDownIcon sx={{ fontSize: 48, color: 'white' }} />
      </Box>
    </Box>
  );
}
