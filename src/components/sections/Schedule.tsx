import { Box, Container, Typography, Card, CardContent, Chip } from '@mui/material';
import { getWeddingConfig } from '@/lib/config';

export default function Schedule() {
  const config = getWeddingConfig();
  const { schedule } = config.content;

  return (
    <Box
      id="schedule"
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth="md">
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
          {schedule.title}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {schedule.events.map((event, index) => (
            <Card
              key={index}
              elevation={2}
              sx={{
                transition: 'all 0.3s ease',
                '&:hover': {
                  elevation: 4,
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <CardContent
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  alignItems: { xs: 'flex-start', md: 'center' },
                  gap: 3,
                  p: 3,
                }}
              >
                <Box sx={{ minWidth: { md: 120 } }}>
                  <Chip
                    label={event.time}
                    color="secondary"
                    sx={{
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      height: 'auto',
                      py: 1.5,
                      px: 2,
                      '& .MuiChip-label': {
                        px: 0,
                      },
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    flex: 1,
                    borderTop: { xs: '2px solid', md: 'none' },
                    borderLeft: { xs: 'none', md: '2px solid' },
                    borderColor: 'primary.main',
                    pt: { xs: 2, md: 0 },
                    pl: { xs: 0, md: 3 },
                  }}
                >
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                    {event.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {event.description}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
