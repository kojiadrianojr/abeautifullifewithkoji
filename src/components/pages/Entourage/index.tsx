"use client";

import { Box, Container, Grid, GridItem, SimpleGrid, Text, VStack } from "@chakra-ui/react";
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
		<Box id="entourage" as="section" py={{ base: 14, md: 20 }} bg="gray.50">
			<Container maxW="5xl">
				<SectionTitle color="secondary.500" subtitle={entourage.description} mb={10}>
					{entourage.title || "Our Entourage"}
				</SectionTitle>

				<VStack spacing={{ base: 8, md: 10 }} align="stretch">
					<EntourageCategory title="Parents">
						<SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 6, md: 10 }}>
							<EntourageGroup
								title="Parents of the Groom"
								members={entourage.parents.groom}
							/>
							<EntourageGroup
								title="Parents of the Bride"
								members={entourage.parents.bride}
							/>
						</SimpleGrid>
					</EntourageCategory>

					<EntourageCategory title="Principal Sponsors">
						<SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 6, md: 10 }}>
							<EntourageGroup
								title="Ninong"
								members={entourage.principalSponsors.men}
							/>
							<EntourageGroup
								title="Ninang"
								members={entourage.principalSponsors.women}
							/>
						</SimpleGrid>
					</EntourageCategory>

					<EntourageCategory title="Wedding Party">
						<SimpleGrid columns={{ base: 1, sm: 2 }} gap={{ base: 6, md: 8 }}>
							<EntourageGroup title="Best Men" members={entourage.bestMen} />
							<EntourageGroup
								title="Maids of Honor"
								members={entourage.maidsOfHonor}
							/>
							<EntourageGroup title="Groomsmen" members={entourage.groomsmen} />
							<EntourageGroup
								title="Bridesmaids"
								members={entourage.bridesmaids}
							/>
						</SimpleGrid>
					</EntourageCategory>

					<EntourageCategory title="Secondary Sponsors">
						<SimpleGrid columns={{ base: 1, sm: 3 }} gap={{ base: 6, md: 8 }}>
							{secondarySponsorGroups.map((group) => (
								<EntourageGroup
									key={group.title}
									title={group.title}
									members={group.members}
								/>
							))}
						</SimpleGrid>
					</EntourageCategory>

					<EntourageCategory title="Cutest Members of the Entourage">
						<Grid
							templateColumns="repeat(4, 1fr)"
							gap={{ base: 4, md: 6 }}
							maxW="2xl"
							mx="auto"
						>
							{littleOnes.map((person, index) => (
								<GridItem
									key={person.role}
									gridColumn={index === 4 ? "2 / span 2" : "span 2"}
								>
									<EntouragePerson
										name={person.name}
										role={person.role}
									/>
								</GridItem>
							))}
						</Grid>
					</EntourageCategory>
				</VStack>
			</Container>
		</Box>
	);
}

function EntourageCategory({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	return (
		<Box>
			<Box textAlign="center" mb={5}>
				<Text
					fontFamily="display"
					fontStyle="italic"
					fontWeight="500"
					fontSize={{ base: "md", md: "lg" }}
					color="primary.600"
					mb={2}
				>
					{title}
				</Text>
				<Box w="32px" h="1px" bg="primary.400" mx="auto" opacity={0.5} />
			</Box>
			{children}
		</Box>
	);
}
