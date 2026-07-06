"use client";

import {
	Alert,
	AlertIcon,
	AlertDescription,
	Text,
} from "@chakra-ui/react";
import { FadeIn } from "@/components/ui/animations/FadeIn";

export type RSVPSearchAlertStatus = "success" | "info" | "warning";

export interface RSVPSearchAlertProps {
	status: RSVPSearchAlertStatus;
	title: string;
	description?: string;
}

const STATUS_STYLES: Record<
	RSVPSearchAlertStatus,
	{ bg: string; borderColor: string; iconColor: string }
> = {
	success: {
		bg: "rgba(240, 253, 244, 0.95)",
		borderColor: "green.200",
		iconColor: "green.500",
	},
	info: {
		bg: "rgba(239, 246, 255, 0.95)",
		borderColor: "blue.200",
		iconColor: "blue.500",
	},
	warning: {
		bg: "rgba(255, 251, 235, 0.95)",
		borderColor: "orange.200",
		iconColor: "orange.500",
	},
};

export function RSVPSearchAlert({
	status,
	title,
	description,
}: RSVPSearchAlertProps) {
	const styles = STATUS_STYLES[status];

	return (
		<FadeIn duration={0.4}>
			<Alert
				status={status}
				borderRadius="xl"
				bg={styles.bg}
				border="1.5px solid"
				borderColor={styles.borderColor}
				px={{ base: 4, md: 5 }}
				py={{ base: 3.5, md: 4 }}
				boxShadow="0 4px 16px rgba(195,177,225,0.15)"
				alignItems="center"
				role="status"
				aria-live="polite"
			>
				<AlertIcon color={styles.iconColor} boxSize={5} />
				<AlertDescription
					flex="1"
					minW={0}
					fontFamily="body"
					fontSize={{ base: "md", md: "lg" }}
					lineHeight="snug"
				>
					<Text as="span" fontWeight="semibold" color="gray.800">
						{title}
					</Text>
					{description && (
						<>
							<Text as="span" mx={2} color="gray.400" aria-hidden="true">
								·
							</Text>
							<Text as="span" fontWeight="normal" color="gray.600">
								{description}
							</Text>
						</>
					)}
				</AlertDescription>
			</Alert>
		</FadeIn>
	);
}
