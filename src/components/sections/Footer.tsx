import { Box, Container, Typography, Link, Divider } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { getCoupleNames, getWeddingConfig } from '@/lib/config';

export default function Footer() {
  const config = getWeddingConfig();
  const { contact, social } = config;
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'text.primary',
        color: 'white',
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="h3"
            sx={{
              fontFamily: 'var(--font-serif)',
              fontWeight: 700,
              mb: 2,
            }}
          >
            {getCoupleNames()}
          </Typography>
          
          {social.hashtag && (
            <Typography
              variant="h5"
              sx={{
                mb: 4,
                color: 'secondary.main',
              }}
            >
              {social.hashtag}
            </Typography>
          )}

          <Box sx={{ mb: 6 }}>
            {contact.email && (
              <Typography sx={{ mb: 1 }}>
                <Link
                  href={`mailto:${contact.email}`}
                  color="inherit"
                  sx={{
                    '&:hover': {
                      color: 'secondary.main',
                    },
                    transition: 'color 0.3s',
                  }}
                >
                  {contact.email}
                </Link>
              </Typography>
            )}
            {contact.phone && (
              <Typography>
                <Link
                  href={`tel:${contact.phone}`}
                  color="inherit"
                  sx={{
                    '&:hover': {
                      color: 'secondary.main',
                    },
                    transition: 'color 0.3s',
                  }}
                >
                  {contact.phone}
                </Link>
              </Typography>
            )}
          </Box>

          <Divider sx={{ bgcolor: 'grey.700', mb: 4 }} />

          <Typography
            variant="body2"
            sx={{
              color: 'grey.400',
              mb: 1,
            }}
          >
            © {currentYear} {getCoupleNames()}. All rights reserved.
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'grey.500',
              fontSize: '0.75rem',
            }}
          >
            <Typography variant="caption">Made with</Typography>
            <FavoriteIcon sx={{ fontSize: 16, mx: 0.5, color: 'error.light' }} />
            <Typography variant="caption">using Wedding Website Template</Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
