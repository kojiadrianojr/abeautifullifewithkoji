"use client";

import { Box, Container, Accordion } from "@chakra-ui/react";
import { ConfigService } from "@/services";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { FAQItem } from "./FAQItem";

export function FAQSection() {
	const config = ConfigService.getConfig();
	const { faq } = config.content;

	return (
		<Box id="faq" as="section" py={{ base: 16, md: 24 }}>
			<Container maxW="3xl">
				<SectionTitle color="primary.500" mb={16}>
					{faq.title}
				</SectionTitle>

				<Accordion allowMultiple>
					{faq.questions.map((item, index) => (
						<FAQItem
							key={index}
							question={item.question}
							answer={item.answer}
						/>
					))}
				</Accordion>
			</Container>
		</Box>
	);
}
