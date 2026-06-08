"use client";

import { useState } from "react";
import { Box, Button, Container, VStack } from "@chakra-ui/react";
import { ConfigService } from "@/services";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { PinterestMasonryGrid } from "@/components/pages/Gallery/PinterestMasonryGrid";
import { GalleryAllPhotosModal } from "@/components/pages/Gallery/GalleryAllPhotosModal";
import { MilestonesTimeline } from "./MilestonesTimeline";
import { QASection } from "./QASection";
import { DecorativeFlowers } from "./DecorativeFlowers";

interface MilestonesSectionProps {
	throwbackPhotos: string[];
}

export function MilestonesSection({
	throwbackPhotos,
}: MilestonesSectionProps) {
	const config = ConfigService.getConfig();
	const { milestones } = config.content;
	const [lightboxOpen, setLightboxOpen] = useState(false);

	const openLightbox = () => {
		setLightboxOpen(true);
	};

	return (
		<Box
			id="milestones"
			as="section"
			py={{ base: 16, md: 24 }}
			bg="gray.50"
			position="relative"
			overflow="hidden"
		>
			{/* Decorative elements */}
			<DecorativeFlowers />

			<Container maxW="7xl">
				<SectionTitle color="secondary.500" mb={12}>
					{milestones.title}
				</SectionTitle>

				<VStack gap={16} align="stretch">
					{/* Milestones Timeline */}
					{milestones.timeline && milestones.timeline.length > 0 && (
						<Box>
							<SectionTitle fontSize="3xl" mb={8} color="secondary.500">
								Our Milestones
							</SectionTitle>
							<MilestonesTimeline timeline={milestones.timeline} />
						</Box>
					)}

					{/* Q&A Section */}
					{milestones.qa && milestones.qa.length > 0 && (
						<Box>
							<SectionTitle fontSize="3xl" mb={8} color="primary.500">
								Questions & Answers
							</SectionTitle>
							<QASection questions={milestones.qa} />
						</Box>
					)}

					{/* Moments We Love - Throwback Photos */}
					{throwbackPhotos.length > 0 && (
						<Box>
							<SectionTitle fontSize="3xl" mb={8} color="secondary.500">
								Moments We Love
							</SectionTitle>
							<PinterestMasonryGrid
								images={throwbackPhotos}
								onImageClick={() => openLightbox()}
								altText="Throwback moment"
								ariaLabel="Moments we love collage"
							/>
							{throwbackPhotos.length >= 5 && (
								<Box mt={8} textAlign="center">
									<Button
										size="lg"
										variant="outline"
										colorScheme="secondary"
										borderRadius="full"
										px={10}
										fontWeight="semibold"
										onClick={() => openLightbox()}
										_hover={{ bg: "secondary.50" }}
									>
										See All Moments ({throwbackPhotos.length})
									</Button>
								</Box>
							)}
						</Box>
					)}
				</VStack>
			</Container>

			{/* Moments modal */}
			<GalleryAllPhotosModal
				images={throwbackPhotos}
				isOpen={lightboxOpen}
				onClose={() => setLightboxOpen(false)}
				title="Moments We Love"
				altPrefix="Throwback moment"
			/>
		</Box>
	);
}
