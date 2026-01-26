import { Box, Container, Typography, Card, CardContent, Divider } from '@mui/material';
import { getWeddingConfig } from '@/lib/config';

export default function Story() {
  const config = getWeddingConfig();
  const { story } = config.content;

  return (
    <Box
      id="story"
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: 'background.default',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative elements */}
      <Box sx={{ position: 'absolute', top: 40, right: 40, fontSize: '4rem', opacity: 0.1 }}>🌸</Box>
      <Box sx={{ position: 'absolute', bottom: 40, left: 40, fontSize: '4rem', opacity: 0.1 }}>🌺</Box>
      
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          align="center"
          gutterBottom
          sx={{
            mb: 2,
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            background: 'linear-gradient(90deg, #d946ef 0%, #f59e0b 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {story.title}
        </Typography>
        
        <Divider
          sx={{
            width: 100,
            height: 4,
            mx: 'auto',
            mb: 8,
            borderRadius: 2,
            background: 'linear-gradient(90deg, #ec4899 0%, #f59e0b 50%, #ec4899 100%)',
          }}
        />
        
        <Typography
          variant="h6"
          align="center"
          sx={{
            maxWidth: 800,
            mx: 'auto',
            mb: 10,
            lineHeight: 1.8,
            color: 'text.secondary',
          }}
        >
          {story.content}
        </Typography>

        {/* Timeline */}
        <Box sx={{ maxWidth: 900, mx: 'auto' }}>
          {story.timeline.map((item, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: index % 2 === 0 ? 'row' : 'row-reverse' },
                gap: 4,
                mb: 8,
              }}
            >
              <Box sx={{ flex: 1, textAlign: { xs: 'center', md: index % 2 === 0 ? 'right' : 'left' } }}>
                <Card
                  elevation={2}
                  sx={{
                    display: 'inline-block',
                    p: 3,
                    transition: 'all 0.3s',
                    '&:hover': {
                      elevation: 4,
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        color: 'warning.main',
                        mb: 1,
                      }}
                    >
                      {item.year}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {item.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    border: '4px solid white',
                    boxShadow: 2,
                    background: 'linear-gradient(135deg, #ec4899 0%, #f59e0b 100%)',
                  }}
                />
                {index < story.timeline.length - 1 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 32,
                      width: 2,
                      height: 64,
                      background: 'linear-gradient(180deg, #ec4899 0%, #f59e0b 100%)',
                      opacity: 0.3,
                    }}
                  />
                )}
              </Box>
              
              <Box sx={{ flex: 1 }} />
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
