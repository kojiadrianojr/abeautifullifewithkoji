"use client";

import { useState } from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { GalleryLightbox } from "@/components/ui/GalleryLightbox";
import type { ImageMetadata } from "@/types/imageProvider";

const MotionBox = motion.create(Box);

interface DressCodeDetailedStripProps {
	images: ImageMetadata[];
}

export function DressCodeDetailedStrip({ images }: DressCodeDetailedStripProps) {
	const [lightboxOpen, setLightboxOpen] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState(0);

	if (images.length === 0) return null;

	const urls = images.map((img) => img.url);

	return (
		<Box mt={10}>
			<Text
				textAlign="center"
				fontSize="xs"
				fontWeight="semibold"
				letterSpacing="widest"
				textTransform="uppercase"
				color="primary.400"
				mb={4}
			>
				Detailed Views
			</Text>

			<Flex
				overflowX="auto"
				gap={4}
				pb={3}
				px={1}
				css={{
					"&::-webkit-scrollbar": { height: "4px" },
					"&::-webkit-scrollbar-thumb": {
						background: "#F8B4D0",
						borderRadius: "4px",
					},
					"&::-webkit-scrollbar-track": { background: "transparent" },
				}}
			>
				{images.map((img, i) => (
					<MotionBox
						key={i}
						flexShrink={0}
						h="180px"
						borderRadius="xl"
						overflow="hidden"
						cursor="pointer"
						boxShadow="sm"
						whileHover={{ scale: 1.04 }}
						transition={{ duration: 0.2 }}
						onClick={() => {
							setSelectedIndex(i);
							setLightboxOpen(true);
						}}
					>
						<Image
							src={img.url}
							alt={img.name ?? `Detailed view ${i + 1}`}
							h="full"
							w="auto"
							objectFit="cover"
							loading="lazy"
						/>
					</MotionBox>
				))}
			</Flex>

			<GalleryLightbox
				images={urls}
				isOpen={lightboxOpen}
				onClose={() => setLightboxOpen(false)}
				initialIndex={selectedIndex}
			/>
		</Box>
	);
}
