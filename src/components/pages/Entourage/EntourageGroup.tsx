import { Box, Heading, Stack } from "@chakra-ui/react";
import { EntouragePerson } from "./EntouragePerson";

interface Person {
	name: string;
	role?: string;
}

interface EntourageGroupProps {
	title: string;
	members: Person[];
	accentColor?: string;
}

export function EntourageGroup({
	title,
	members,
	accentColor = "primary.500",
}: EntourageGroupProps) {
	return (
		<Box
			bg="white"
			borderRadius="2xl"
			px={{ base: 5, md: 8 }}
			py={{ base: 6, md: 8 }}
			boxShadow="sm"
			borderTop="3px solid"
			borderColor={accentColor}
			textAlign="center"
		>
			<Heading
				as="h3"
				fontSize={{ base: "sm", md: "md" }}
				fontFamily="'Cormorant Garamond', Georgia, serif"
				fontStyle="italic"
				fontWeight="600"
				letterSpacing="wide"
				color="gray.600"
				mb={4}
			>
				{title}
			</Heading>
			<Stack gap={0}>
				{members.map((member, i) => (
					<EntouragePerson key={i} name={member.name} role={member.role} />
				))}
			</Stack>
		</Box>
	);
}
