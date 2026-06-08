import { Box, Text } from "@chakra-ui/react";

interface EntouragePersonProps {
	name: string;
	role?: string;
}

export function EntouragePerson({ name, role }: EntouragePersonProps) {
	if (!name.trim()) return null;

	return (
		<Box textAlign="center" py={0.5}>
			<Text
				fontFamily="display"
				fontSize={{ base: "sm", md: "md" }}
				color="gray.800"
				lineHeight="1.4"
			>
				{name}
			</Text>
			{role && (
				<Text
					fontSize="xs"
					color="gray.500"
					fontStyle="italic"
					mt={0.5}
					lineHeight="1.3"
				>
					{role}
				</Text>
			)}
		</Box>
	);
}
