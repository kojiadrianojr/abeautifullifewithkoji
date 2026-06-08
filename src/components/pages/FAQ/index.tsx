"use client";

import { useMemo, useState } from "react";
import {
	Box,
	Container,
	Input,
	InputGroup,
	InputLeftElement,
	SimpleGrid,
	Text,
} from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { FAQService } from "@/services";
import { FAQCard } from "./FAQCard";

const faqData = FAQService.getFAQData();

export function FAQSection() {
	const [query, setQuery] = useState("");

	const filteredQuestions = useMemo(() => {
		const trimmed = query.trim();
		if (!trimmed) return faqData.questions;
		return FAQService.searchFAQs(trimmed);
	}, [query]);

	return (
		<Box
			id="faq"
			as="section"
			py={{ base: 12, md: 20 }}
			className="section-ivory"
			overflow="hidden"
		>
			<Container maxW="5xl" px={{ base: 4, md: 6 }}>
				<SectionTitle color="secondary.500" mb={2}>
					{faqData.title}
				</SectionTitle>

				<Text
					textAlign="center"
					fontFamily="display"
					fontStyle="italic"
					fontSize="sm"
					color="gray.500"
					mb={6}
					lineHeight="1.6"
				>
					Everything you need to know for our celebration.
				</Text>

				<Box mb={6} maxW="sm" mx="auto" w="full">
					<InputGroup size="sm">
						<InputLeftElement pointerEvents="none" h="full">
							<Box as={LuSearch} color="gray.400" boxSize="15px" />
						</InputLeftElement>
						<Input
							placeholder="Search..."
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							bg="white"
							border="1px solid"
							borderColor="gray.200"
							borderRadius="md"
							h="36px"
							pl={9}
							fontFamily="body"
							fontSize="sm"
							_placeholder={{ color: "gray.400", fontSize: "sm" }}
							_focusVisible={{
								borderColor: "primary.300",
								boxShadow: "none",
							}}
							aria-label="Search frequently asked questions"
						/>
					</InputGroup>
				</Box>

				{filteredQuestions.length > 0 ? (
					<SimpleGrid
						columns={{ base: 1, md: 2 }}
						spacing={{ base: 3, md: 4 }}
						w="full"
						minW={0}
					>
						{filteredQuestions.map((item, index) => (
							<FAQCard
								key={item.id}
								question={item.question}
								answer={item.answer}
								index={index}
							/>
						))}
					</SimpleGrid>
				) : (
					<Box textAlign="center" py={8} px={4}>
						<Text fontFamily="display" fontSize="sm" fontStyle="italic" color="gray.500">
							No questions match &ldquo;{query.trim()}&rdquo;.
						</Text>
					</Box>
				)}
			</Container>
		</Box>
	);
}
