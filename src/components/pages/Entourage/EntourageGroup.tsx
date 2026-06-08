import { Box, Stack, Text } from "@chakra-ui/react";
import { EntouragePerson } from "./EntouragePerson";

interface Person {
	name: string;
	role?: string;
}

interface EntourageGroupProps {
	title: string;
	members: Person[];
}

export function EntourageGroup({ title, members }: EntourageGroupProps) {
	const visibleMembers = members.filter((member) => member.name.trim());
	if (visibleMembers.length === 0) return null;

	return (
		<Box textAlign="center">
			<Text
				fontSize="xs"
				fontWeight="500"
				color="gray.500"
				textTransform="uppercase"
				letterSpacing="0.2em"
				fontFamily="display"
				mb={2}
			>
				{title}
			</Text>
			<Stack gap={0} align="center">
				{visibleMembers.map((member, i) => (
					<EntouragePerson key={i} name={member.name} role={member.role} />
				))}
			</Stack>
		</Box>
	);
}
