import { Box, Text } from "@chakra-ui/react";

interface EntouragePersonProps {
	name: string;
	role?: string;
}

export function EntouragePerson({ name, role }: EntouragePersonProps) {
	return (
		<Box textAlign="center" py={2}>
			<Text
				fontSize={{ base: "sm", md: "md" }}
				fontWeight="600"
				color="gray.800"
			>
				{name}
			</Text>
			{role && (
				<Text fontSize="xs" color="primary.500" fontWeight="500" mt={0.5}>
					{role}
				</Text>
			)}
		</Box>
	);
}
