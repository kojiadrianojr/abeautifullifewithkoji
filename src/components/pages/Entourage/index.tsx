"use client";

import { Box, Container, SimpleGrid, Grid, GridItem, Heading, Text } from "@chakra-ui/react";
import { ConfigService } from "@/services";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { EntourageGroup } from "./EntourageGroup";
import { EntouragePerson } from "./EntouragePerson";

export function EntourageSection() {
	const config = ConfigService.getConfig();
	const entourage = config.content.entourage;

	if (!entourage?.enabled) {
		return null;
	}

	const secondarySponsorGroups = [
		{
			title: "Candle Sponsors",
			members: [
				{ name: entourage.secondarySponsors.candle.man.name },
				{ name: entourage.secondarySponsors.candle.woman.name },
			],
		},
		{
			title: "Veil Sponsors",
			members: [
				{ name: entourage.secondarySponsors.veil.man.name },
				{ name: entourage.secondarySponsors.veil.woman.name },
			],
		},
		{
			title: "Cord Sponsors",
			members: [
				{ name: entourage.secondarySponsors.cord.man.name },
				{ name: entourage.secondarySponsors.cord.woman.name },
			],
		},
	];

	const littleOnes = [
		{ name: entourage.bearers.coin.name, role: "Coin Bearer" },
		{ name: entourage.bearers.bible.name, role: "Bible Bearer" },
		{ name: entourage.bearers.ring.name, role: "Ring Bearer" },
		{ name: entourage.flowers.flowerGirl.name, role: "Flower Girl" },
		{ name: entourage.flowers.flowerLady.name, role: "Flower Lady" },
	];

	return (
		<Box id="entourage" as="section" py={{ base: 16, md: 24 }} bg="accent.50">
			<Container maxW="6xl">
				<SectionTitle color="secondary.500" mb={4}>
					{entourage.title || "Our Entourage"}
				</SectionTitle>
				<Text
					textAlign="center"
						color="secondary.600"
					fontSize={{ base: "xl", md: "lg" }}
					fontFamily="display"
					fontStyle="italic"
					fontWeight="400"
					letterSpacing="wide"
					mb={16}
				>
					{entourage.description}
				</Text>

				{/* Parents */}
				<Box mb={14}>
					<SectionGroupHeading>Parents</SectionGroupHeading>
					<SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
						<EntourageGroup
							title="Parents of the Groom"
							members={entourage.parents.groom}
						/>
						<EntourageGroup
							title="Parents of the Bride"
							members={entourage.parents.bride}
						/>
					</SimpleGrid>
				</Box>

				{/* Principal Sponsors */}
				<Box mb={14}>
					<SectionGroupHeading>Principal Sponsors</SectionGroupHeading>
					<SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
						<EntourageGroup
							title="Ninong"
							members={entourage.principalSponsors.men}
							accentColor="primary.500"
						/>
						<EntourageGroup
							title="Ninang"
							members={entourage.principalSponsors.women}
							accentColor="primary.400"
						/>
					</SimpleGrid>
				</Box>

				{/* Wedding Party */}
				<Box mb={14}>
					<SectionGroupHeading>Wedding Party</SectionGroupHeading>
					<SimpleGrid columns={{ base: 1, md: 2 }} gap={6} mb={6}>
						<EntourageGroup
							title="Best Men"
							members={entourage.bestMen}
							accentColor="primary.500"
						/>
						<EntourageGroup
							title="Maids of Honor"
							members={entourage.maidsOfHonor}
							accentColor="primary.500"
						/>
					</SimpleGrid>
					<SimpleGrid columns={{ base: 1, md: 2 }} gap={6} maxW="2xl" mx="auto">
						<EntourageGroup
							title="Groomsmen"
							members={entourage.groomsmen}
							accentColor="primary.500"
						/>
						<EntourageGroup
							title="Bridesmaids"
							members={entourage.bridesmaids}
							accentColor="primary.500"
						/>
					</SimpleGrid>
				</Box>

				{/* Secondary Sponsors */}
				<Box mb={14}>
					<SectionGroupHeading>Secondary Sponsors</SectionGroupHeading>
					<SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
						{secondarySponsorGroups.map((group) => (
							<EntourageGroup
								key={group.title}
								title={group.title}
								members={group.members}
								accentColor="primary.300"
							/>
						))}
					</SimpleGrid>
				</Box>

				{/* Little Ones */}
				<Box>
					<SectionGroupHeading>Cutest Members of the Entourage</SectionGroupHeading>
					<Grid templateColumns="repeat(6, 1fr)" gap={4}>
						{littleOnes.map((person, index) => {
							let gridColumn: string;
							if (index === 3) gridColumn = "2 / span 2";
							else if (index === 4) gridColumn = "4 / span 2";
							else gridColumn = "span 2";

							return (
								<GridItem key={person.role} gridColumn={gridColumn}>
									<Box
										bg="white"
										borderRadius="2xl"
										px={4}
										py={5}
										boxShadow="sm"
										borderTop="3px solid"
										borderColor="secondary.300"
										textAlign="center"
									>
										<EntouragePerson name={person.name} role={person.role} />
									</Box>
								</GridItem>
							);
						})}
					</Grid>
				</Box>
			</Container>
		</Box>
	);
}

function SectionGroupHeading({ children }: { children: React.ReactNode }) {
	return (
		<Heading
			as="h3"
			fontSize={{ base: "2xl", md: "3xl" }}
			fontFamily="display"
			fontStyle="italic"
			fontWeight="500"
			textAlign="center"
			color="primary.600"
			mb={6}
		>
			{children}
		</Heading>
	);
}
