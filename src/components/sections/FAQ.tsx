'use client';

import {
  Box,
  Container,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Heading,
  Text,
} from '@chakra-ui/react';
import { getWeddingConfig } from '@/lib/config';
import { SectionTitle } from '@/components/ui/SectionTitle';

export default function FAQ() {
  const config = getWeddingConfig();
  const { faq } = config.content;

  return (
    <Box id="faq" as="section" py={{ base: 16, md: 24 }}>
      <Container maxW="3xl">
        <SectionTitle color="primary.500" mb={16}>
          {faq.title}
        </SectionTitle>

        <Accordion allowMultiple>
          {faq.questions.map((item, index) => (
            <AccordionItem
              key={index}
              border="1px solid"
              borderColor="gray.200"
              borderRadius="xl"
              mb={4}
              _last={{ mb: 0 }}
            >
              <AccordionButton
                py={4}
                px={6}
                _hover={{ bg: 'gray.50' }}
                _expanded={{ bg: 'gray.50' }}
                borderRadius="xl"
              >
                <Box flex={1} textAlign="left">
                  <Heading as="h3" size="md" fontWeight="semibold">
                    {item.question}
                  </Heading>
                </Box>
                <AccordionIcon color="primary.500" fontSize="2xl" />
              </AccordionButton>
              <AccordionPanel
                pb={6}
                px={6}
                pt={4}
                borderTop="1px solid"
                borderColor="gray.200"
              >
                <Text color="gray.600" fontSize="md">
                  {item.answer}
                </Text>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </Box>
  );
}
