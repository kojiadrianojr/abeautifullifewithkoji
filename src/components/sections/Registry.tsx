import { Box, Container, Typography, Card, CardContent, Link } from '@mui/material';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { getWeddingConfig } from '@/lib/config';

export default function Registry() {
  const config = getWeddingConfig();
  const { registry } = config.content;

  return (
    <Box
      id="registry"
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: 'action.hover',
      }}
    >
      <Container maxWidth="md">
        <Typography
          variant="h2"
          align="center"
          gutterBottom
          sx={{
            mb: 4,
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            color: 'primary.main',
          }}
        >
          {registry.title}
        </Typography>

        <Typography
          variant="h6"
          align="center"
          sx={{
            maxWidth: 700,
            mx: 'auto',
            mb: 8,
            color: 'text.secondary',
          }}
        >
          {registry.message}
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
            gap: 3,
            maxWidth: 700,
            mx: 'auto',
          }}
        >
          {registry.registries.map((reg, index) => (
            <Link
              key={index}
              href={reg.url}
              target="_blank"
              rel="noopener noreferrer"
              underline="none"
              sx={{ display: 'block' }}
            >
              <Card
                elevation={2}
                sx={{
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      elevation: 6,
                      transform: 'translateY(-8px)',
                      '& .gift-icon': {
                        transform: 'scale(1.1)',
                      },
                      '& .view-text': {
                        color: 'primary.main',
                      },
                      '& .arrow-icon': {
                        transform: 'translateX(4px)',
                      },
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <CardGiftcardIcon
                      className="gift-icon"
                      sx={{
                        fontSize: 60,
                        color: 'primary.main',
                        mb: 2,
                        transition: 'transform 0.3s ease',
                      }}
                    />
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                      {reg.name}
                    </Typography>
                    <Box
                      className="view-text"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'secondary.main',
                        fontWeight: 600,
                        transition: 'color 0.3s ease',
                      }}
                    >
                      <Typography>View Registry</Typography>
                      <ArrowForwardIcon
                        className="arrow-icon"
                        sx={{
                          ml: 0.5,
                          fontSize: 20,
                          transition: 'transform 0.3s ease',
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Link>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
