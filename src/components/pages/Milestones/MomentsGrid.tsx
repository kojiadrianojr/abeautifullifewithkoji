"use client";

import { Box, SimpleGrid } from "@chakra-ui/react";
import { motion } from "framer-motion";
import Image from "next/image";

const MotionBox = motion(Box);

interface MomentsGridProps {
	photos: string[];
	onOpenLightbox: (index: number) => void;
}

export function MomentsGrid({ photos, onOpenLightbox }: MomentsGridProps) {
	return (
		<SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} gap={4}>
			{photos.map((photo, index) => (
				<MotionBox
					key={index}
					initial={{ opacity: 0, scale: 0.9 }}
					whileInView={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.5, delay: index * 0.1 }}
					viewport={{ once: true }}
					cursor="pointer"
					onClick={() => onOpenLightbox(index)}
				>
					<Box
						position="relative"
						w="100%"
						paddingBottom="100%"
						borderRadius="lg"
						overflow="hidden"
						shadow="md"
						_hover={{
							shadow: "xl",
							transform: "scale(1.05)",
						}}
						transition="all 0.3s"
					>
						<Image
							src={photo}
							alt={`Throwback moment ${index + 1}`}
							fill
							style={{ objectFit: "cover" }}
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
						/>
					</Box>
				</MotionBox>
			))}
		</SimpleGrid>
	);
}
