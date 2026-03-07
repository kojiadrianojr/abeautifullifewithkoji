"use client";

import { Box, Container, SimpleGrid } from "@chakra-ui/react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { FAQCard } from "./FAQCard";
import faqData from "@/../config/faq.json";

export function FAQSection() {
	return (
		<Box id="faq" as="section" py={{ base: 16, md: 24 }}>
			<Container maxW="6xl">
				<SectionTitle color="primary.500" mb={16}>
					{faqData.title}
				</SectionTitle>

				<SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
					{faqData.questions.map((item, index) => (
						<FAQCard
							key={item.id}
							question={item.question}
							answer={item.answer}
							index={index}
						/>
					))}
				</SimpleGrid>
			</Container>
		</Box>
	);
}
