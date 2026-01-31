'use client';

import React, { useState, useEffect } from 'react';
import Countdown from 'react-countdown';
import { Box, Typography, Paper, Stack } from '@mui/material';
import { getWeddingConfig } from '@/lib/config';

function CountdownComponent() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Box sx={{ minHeight: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h5" sx={{ opacity: 0.7 }}>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Countdown 
      date={new Date(getWeddingConfig().wedding.datetime).getTime()}
      renderer={renderer}
    />
  );
}

const renderer = ({ days, hours, minutes, seconds, completed }: any) => {
  if (completed) {
    return (
      <Typography
        variant="h4"
        sx={{
          fontWeight: 600,
          textShadow: '0 2px 4px rgba(0,0,0,0.2)',
        }}
      >
        Today's the day! 🎉
      </Typography>
    );
  }

  const timeUnits = [
    { value: days, label: 'Days' },
    { value: hours, label: 'Hours' },
    { value: minutes, label: 'Minutes' },
    { value: seconds, label: 'Seconds' },
  ];

  return (
    <Stack 
      direction="row" 
      spacing={2} 
      justifyContent="center"
      flexWrap="wrap"
      useFlexGap
    >
      {timeUnits.map((unit, index) => (
        <Paper
          key={index}
          elevation={3}
          sx={{
            px: { xs: 2, sm: 3 },
            py: { xs: 1.5, sm: 2 },
            backgroundColor: 'transparent',
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
            minWidth: { xs: 70, sm: 90 },
            textAlign: 'center',
            display: index === 3 ? { xs: 'none', md: 'block' } : 'block',
          }}
        >
          <Typography
            variant="h3"
            component="div"
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              fontSize: { xs: '2rem', sm: '2.5rem' },
              lineHeight: 1,
              mb: 0.5,
            }}
          >
            {unit.value}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: 'text.secondary',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
            }}
          >
            {unit.label}
          </Typography>
        </Paper>
      ))}
    </Stack>
  );
};

export default CountdownComponent;