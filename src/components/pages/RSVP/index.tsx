"use client";

import { Box, Container, Text, VStack } from "@chakra-ui/react";
import { ConfigService, DateService } from "@/services";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { GuestSearch } from "./GuestSearch";

export function RSVPSection() {
	const config = ConfigService.getConfig();
	const { rsvp } = config.content;
	const formattedDeadline = DateService.formatDate(rsvp.deadline);

	return (
		<Box
			id="rsvp"
			as="section"
			py={{ base: 12, md: 16 }}
			position="relative"
			overflow="hidden"
		>
			{/* Textured paper background */}
			<Box
				position="absolute"
				top={0}
				left={0}
				right={0}
				bottom={0}
				bg="#f4ede4"
				backgroundImage={`
					repeating-linear-gradient(0deg, rgba(0,0,0,0.02) 0px, transparent 1px, transparent 2px, rgba(0,0,0,0.02) 3px),
					repeating-linear-gradient(90deg, rgba(0,0,0,0.02) 0px, transparent 1px, transparent 2px, rgba(0,0,0,0.02) 3px),
					repeating-linear-gradient(45deg, transparent 0px, transparent 10px, rgba(0,0,0,0.01) 10px, rgba(0,0,0,0.01) 11px),
					repeating-linear-gradient(-45deg, transparent 0px, transparent 10px, rgba(0,0,0,0.01) 10px, rgba(0,0,0,0.01) 11px),
					linear-gradient(90deg, #f4ede4, #f9f6f2, #f4ede4)
				`}
				_before={{
					content: '""',
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					backgroundImage: `
						radial-gradient(circle at 20% 30%, rgba(210,180,140,0.1) 0%, transparent 40%),
						radial-gradient(circle at 80% 70%, rgba(210,180,140,0.08) 0%, transparent 40%),
						url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E")
					`,
					backgroundSize: "100% 100%, 100% 100%, 100% 100%",
				}}
				_after={{
					content: '""',
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background: `
						linear-gradient(to bottom, rgba(0,0,0,0.01) 0%, transparent 10%, transparent 90%, rgba(0,0,0,0.02) 100%),
						linear-gradient(to right, rgba(0,0,0,0.01) 0%, transparent 5%, transparent 95%, rgba(0,0,0,0.01) 100%)
					`,
					boxShadow: "inset 0 2px 10px rgba(0,0,0,0.03), inset 0 -2px 10px rgba(0,0,0,0.03)",
				}}
			/>

			{/* Decorative corner flourishes */}
			<Box
				position="absolute"
				top={8}
				left={8}
				fontSize="4xl"
				color="gold.500"
				opacity={0.2}
				transform="rotate(0deg)"
			>
				❦
			</Box>
			<Box
				position="absolute"
				top={8}
				right={8}
				fontSize="4xl"
				color="gold.500"
				opacity={0.2}
				transform="rotate(90deg)"
			>
				❦
			</Box>
			<Box
				position="absolute"
				bottom={8}
				left={8}
				fontSize="4xl"
				color="gold.500"
				opacity={0.2}
				transform="rotate(-90deg)"
			>
				❦
			</Box>
			<Box
				position="absolute"
				bottom={8}
				right={8}
				fontSize="4xl"
				color="gold.500"
				opacity={0.2}
				transform="rotate(180deg)"
			>
				❦
			</Box>

			<Container maxW="3xl" position="relative" zIndex={1}>
				<VStack spacing={6}>
					<SectionTitle color="gray.800">{rsvp.title}</SectionTitle>
					<Text
						fontSize={{ base: "xl", md: "2xl" }}
						textAlign="center"
						fontWeight={400}
						color="gray.700"
						fontStyle="italic"
					>
						{rsvp.message}
					</Text>

					{/* Guest Search Component */}
					<Box w="100%" pt={2}>
						<GuestSearch formUrl={rsvp.formUrl} />
					</Box>

					<Text 
						fontSize="sm" 
						textAlign="center" 
						color="gray.600"
						mt={4}
						fontStyle="italic"
					>
						Can&apos;t make it? Please let us know so we can plan accordingly.
					</Text>
				</VStack>
			</Container>
		</Box>
	);
}
