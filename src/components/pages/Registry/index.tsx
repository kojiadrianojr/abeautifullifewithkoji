"use client";

import { Box, Container, Text, SimpleGrid } from "@chakra-ui/react";
import { ConfigService } from "@/services";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { RegistryCard } from "./RegistryCard";

export function RegistrySection() {
	const config = ConfigService.getConfig();
	const { registry } = config.content;

	return (
		<Box id="registry" as="section" py={{ base: 16, md: 24 }} bg="gray.100">
			<Container maxW="3xl">
				<SectionTitle color="primary.500" mb={8}>
					{registry.title}
				</SectionTitle>

				<Text
					fontSize={{ base: "lg", md: "xl" }}
					textAlign="center"
					maxW="2xl"
					mx="auto"
					mb={16}
					color="gray.600"
				>
					{registry.message}
				</Text>

				<SimpleGrid
					columns={{ base: 1, sm: 2 }}
					spacing={6}
					maxW="2xl"
					mx="auto"
				>
					{registry.registries.map((reg, index) => (
						<RegistryCard key={index} name={reg.name} url={reg.url} />
					))}
				</SimpleGrid>
			</Container>
		</Box>
	);
}
