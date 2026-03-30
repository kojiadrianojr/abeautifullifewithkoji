"use client";

import { Box, Heading, Text, Card } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { linkifyText } from "@/lib/linkify";

const MotionCard = motion.create(Card);

interface FAQCardProps {
  question: string;
  answer: string;
  index: number;
}

export function FAQCard({ question, answer, index }: FAQCardProps) {
  return (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      p={{ base: 6, md: 8 }}
      bg="white"
      borderRadius="2xl"
      shadow="md"
      borderWidth="1px"
      borderColor="gray.100"
      _hover={{
        shadow: "xl",
        borderColor: "primary.200",
        transform: "translateY(-4px)",
      }}
      css={{
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <Box>
        <Heading
          as="h3"
          size="md"
          fontWeight="semibold"
          color="primary.600"
          mb={4}
        >
          {question}
        </Heading>
        <Text color="gray.600" fontSize="md" lineHeight="tall" whiteSpace="pre-line">
          {linkifyText(answer)}
        </Text>
      </Box>
    </MotionCard>
  );
}
