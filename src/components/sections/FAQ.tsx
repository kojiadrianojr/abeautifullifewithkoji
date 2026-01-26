'use client';

import { Box, Container, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getWeddingConfig } from '@/lib/config';

export default function FAQ() {
  const config = getWeddingConfig();
  const { faq } = config.content;

  return (
    <Box
      id="faq"
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
          {faq.title}
        </Typography>

        <Box>
          {faq.questions.map((item, index) => (
            <Accordion
              key={index}
              elevation={1}
              sx={{
                mb: 2,
                '&:before': {
                  display: 'none',
                },
                '&.Mui-expanded': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon color="primary" />}
                sx={{
                  '& .MuiAccordionSummary-content': {
                    my: 2,
                  },
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {item.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  pt: 0,
                  pb: 3,
                  borderTop: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography color="text.secondary">
                  {item.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
