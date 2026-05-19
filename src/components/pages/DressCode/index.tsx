"use client";

import { Box, Container, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { ConfigService } from "@/services";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { DressCodeCarousel } from "./DressCodeCarousel";
import type { ImageMetadata } from "@/types/imageProvider";

const MotionBox = motion.create(Box);
const MotionText = motion.create(Text);

interface DressCodeSectionProps {
	images: ImageMetadata[];
}

export function DressCodeSection({ images }: DressCodeSectionProps) {
	const config = ConfigService.getConfig();
	const { dressCode } = config.content;

	return (
		<Box
			id="dress-code"
			as="section"
			py={{ base: 16, md: 24 }}
			className="watercolor-section-blush"
		>
			<Container maxW="4xl">
				<SectionTitle color="primary.500" mb={4}>
					{dressCode.title}
				</SectionTitle>

				<MotionBox
					initial={{ opacity: 0, y: 10 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5, delay: 0.1 }}
					textAlign="center"
					mb={6}
				>
					<Box
						display="inline-flex"
						alignItems="center"
						gap={3}
						px={6}
						py={2}
						borderRadius="full"
						bg="white"
						border="1.5px solid"
						borderColor="primary.300"
						boxShadow="sm"
					>
						<Box
							as="span"
							display="inline-block"
							w="6px"
							h="6px"
							borderRadius="full"
							bg="primary.400"
							flexShrink={0}
						/>
						<Text
							as="span"
							fontSize={{ base: "sm", md: "md" }}
							fontWeight="bold"
							color="primary.700"
							letterSpacing="widest"
							textTransform="uppercase"
						>
							{dressCode.subtitle}
						</Text>
						<Box
							as="span"
							display="inline-block"
							w="6px"
							h="6px"
							borderRadius="full"
							bg="primary.400"
							flexShrink={0}
						/>
					</Box>
				</MotionBox>

				<MotionText
					initial={{ opacity: 0, y: 10 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5, delay: 0.2 }}
					textAlign="center"
					color="gray.600"
					fontSize={{ base: "sm", md: "md" }}
					maxW="2xl"
					mx="auto"
					mb={12}
					lineHeight="tall"
				>
					{dressCode.description}
				</MotionText>

				{images.length > 0 ? (
					<DressCodeCarousel images={images} />
				) : (
					<MotionText
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						viewport={{ once: true }}
						textAlign="center"
						color="gray.400"
						fontSize="md"
						mt={8}
					>
						Mood board coming soon 🌸
					</MotionText>
				)}
			</Container>
		</Box>
	);
}

