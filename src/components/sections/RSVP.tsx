import { Box, Container, Typography, Button } from '@mui/material';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { getWeddingConfig } from '@/lib/config';

export default function RSVP() {
  const config = getWeddingConfig();
  const { rsvp } = config.content;

  const deadline = new Date(rsvp.deadline);
  const formattedDeadline = deadline.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Box
      id="rsvp"
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: 'primary.main',
        color: 'white',
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
            fontWeight: 700,
          }}
        >
          {rsvp.title}
        </Typography>

        <Typography
          variant="h5"
          align="center"
          sx={{
            mb: 2,
            fontWeight: 400,
          }}
        >
          {rsvp.message}
        </Typography>

        <Typography
          align="center"
          sx={{
            mb: 8,
            fontSize: '1.125rem',
            opacity: 0.9,
          }}
        >
          Deadline: {formattedDeadline}
        </Typography>

        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            href={rsvp.formUrl}
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<EditNoteIcon />}
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              px: 6,
              py: 2,
              fontSize: '1.125rem',
              fontWeight: 700,
              '&:hover': {
                bgcolor: 'grey.100',
                transform: 'translateY(-4px)',
                boxShadow: 6,
              },
              transition: 'all 0.3s ease',
            }}
          >
            Fill Out RSVP Form
          </Button>
        </Box>

        <Typography
          align="center"
          sx={{
            mt: 6,
            fontSize: '0.875rem',
            opacity: 0.75,
          }}
        >
          Can&apos;t make it? Please let us know so we can plan accordingly.
        </Typography>
      </Container>
    </Box>
  );
}
