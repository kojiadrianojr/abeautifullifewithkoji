'use client';

import { useState } from 'react';
import { Box, Container, Typography, Paper, Modal, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { getWeddingConfig } from '@/lib/config';

export default function Gallery() {
  const config = getWeddingConfig();
  const { gallery } = config.content;
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <Box
      id="gallery"
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: 'action.hover',
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          align="center"
          gutterBottom
          sx={{
            mb: 8,
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            color: 'primary.main',
          }}
        >
          {gallery.title}
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: 3,
          }}
        >
          {gallery.images.map((image, index) => (
            <Paper
              key={index}
              elevation={2}
              onClick={() => setSelectedImage(image)}
              sx={{
                aspectRatio: '1',
                cursor: 'pointer',
                overflow: 'hidden',
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  elevation: 6,
                  transform: 'scale(1.05)',
                },
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  bgcolor: 'grey.200',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography color="text.secondary">Photo {index + 1}</Typography>
              </Box>
            </Paper>
          ))}
        </Box>
      </Container>

      {/* Lightbox Modal */}
      <Modal
        open={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          onClick={() => setSelectedImage(null)}
          sx={{
            position: 'relative',
            maxWidth: '90vw',
            maxHeight: '90vh',
            outline: 'none',
          }}
        >
          <IconButton
            onClick={() => setSelectedImage(null)}
            sx={{
              position: 'absolute',
              top: -50,
              right: 0,
              color: 'white',
              fontSize: '2rem',
            }}
          >
            <CloseIcon fontSize="large" />
          </IconButton>
          <Paper
            elevation={8}
            sx={{
              p: 2,
              bgcolor: 'grey.200',
              width: 600,
              height: 400,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 2,
            }}
          >
            <Typography color="text.secondary">Selected Image</Typography>
          </Paper>
        </Box>
      </Modal>
    </Box>
  );
}
