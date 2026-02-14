"use client";

import {
	Card,
	CardBody,
	Link,
	Heading,
	Flex,
	Text,
	Box,
} from "@chakra-ui/react";
import { FiGift, FiArrowRight } from "react-icons/fi";

interface RegistryCardProps {
	name: string;
	url: string;
}

export function RegistryCard({ name, url }: RegistryCardProps) {
	return (
		<Link href={url} isExternal _hover={{ textDecoration: "none" }}>
			<Card
				boxShadow="md"
				textAlign="center"
				transition="all 0.3s ease"
				cursor="pointer"
				_hover={{
					boxShadow: "xl",
					transform: "translateY(-8px)",
					"& .gift-icon": {
						transform: "scale(1.1)",
					},
					"& .view-text": {
						color: "primary.500",
					},
					"& .arrow-icon": {
						transform: "translateX(4px)",
					},
				}}
				borderRadius="xl"
			>
				<CardBody p={8}>
					<Box
						className="gift-icon"
						as={FiGift}
						fontSize="6xl"
						color="primary.500"
						mb={4}
						mx="auto"
						transition="transform 0.3s ease"
					/>
					<Heading as="h3" size="md" mb={4} fontWeight="semibold">
						{name}
					</Heading>
					<Flex
						className="view-text"
						align="center"
						justify="center"
						gap={2}
						color="gray.600"
						fontWeight="medium"
						transition="color 0.3s ease"
					>
						<Text>View Registry</Text>
						<Box
							className="arrow-icon"
							as={FiArrowRight}
							transition="transform 0.3s ease"
						/>
					</Flex>
				</CardBody>
			</Card>
		</Link>
	);
}
