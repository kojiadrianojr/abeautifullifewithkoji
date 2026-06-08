"use client";

import { useState } from "react";
import {
	Box,
	Button,
	Collapse,
	HStack,
	IconButton,
	Text,
	Tooltip,
	useToast,
	VStack,
} from "@chakra-ui/react";
import { FaCopy, FaDirections, FaMapMarkedAlt } from "react-icons/fa";

interface VenueTypographyProps {
	type: string;
	displayName: string;
	locationLabel: string;
	time?: string;
	textAlign?: "left" | "right" | "center";
}

interface VenueActionsProps {
	type: string;
	address: string;
	googleMapsUrl: string;
	textAlign?: "left" | "right" | "center";
}

function getEmbedUrl(address: string): string {
	const encodedAddress = encodeURIComponent(address);
	return `https://maps.google.com/maps?q=${encodedAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
}

const buttonStyles = {
	variant: "outline" as const,
	size: "sm" as const,
	borderColor: "gray.300",
	color: "gray.700",
	fontFamily: "display",
	fontWeight: "medium",
	fontSize: "xs",
	letterSpacing: "0.04em",
	px: 3,
	h: "32px",
	_hover: { borderColor: "gray.400", bg: "gray.100" },
};

function getStackAlign(textAlign: "left" | "right" | "center") {
	if (textAlign === "left") return "flex-start";
	if (textAlign === "right") return "flex-end";
	return "center";
}

export function VenueTypography({
	type,
	displayName,
	locationLabel,
	time,
	textAlign = "center",
}: VenueTypographyProps) {
	const stackAlign = getStackAlign(textAlign);

	return (
		<VStack
			spacing={1}
			align={{ base: "center", md: stackAlign }}
			textAlign={{ base: "center", md: textAlign }}
		>
			<Text
				fontFamily="heading"
				fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
				fontWeight="normal"
				sx={{ color: "var(--color-foreground)" }}
				lineHeight={0.95}
			>
				{type}
			</Text>

			<Text
				as="p"
				fontFamily="display"
				fontSize={{ base: "xs", md: "sm" }}
				fontWeight="semibold"
				letterSpacing={{ base: "0.1em", md: "0.14em" }}
				textTransform="uppercase"
				color="gray.800"
				lineHeight={{ base: 1.45, md: 1.5 }}
				maxW={{ base: "280px", md: "300px" }}
			>
				{displayName}
			</Text>

			<Text
				fontFamily="display"
				fontSize={{ base: "sm", md: "md" }}
				fontStyle="italic"
				fontWeight="normal"
				color="gray.500"
				lineHeight="short"
			>
				{locationLabel}
			</Text>

			{time && (
				<Text
					as="p"
					fontFamily="display"
					fontSize="xs"
					fontStyle="italic"
					fontWeight="normal"
					color="gray.500"
				>
					{time}
				</Text>
			)}
		</VStack>
	);
}

export function VenueActions({
	type,
	address,
	googleMapsUrl,
	textAlign = "center",
}: VenueActionsProps) {
	const [showMap, setShowMap] = useState(false);
	const toast = useToast();
	const stackAlign = getStackAlign(textAlign);
	const rowJustify = stackAlign;

	const handleCopyAddress = async () => {
		try {
			await navigator.clipboard.writeText(address);
			toast({
				title: "Address copied",
				status: "success",
				duration: 2500,
				isClosable: true,
				position: "top",
			});
		} catch {
			toast({
				title: "Could not copy",
				status: "error",
				duration: 2500,
				isClosable: true,
				position: "top",
			});
		}
	};

	const handleOpenDirections = () => {
		window.open(googleMapsUrl, "_blank", "noopener,noreferrer");
	};

	return (
		<VStack spacing={2} align={{ base: "center", md: stackAlign }} w="full">
			<HStack
				spacing={2}
				justify={{ base: "center", md: rowJustify }}
				flexWrap="wrap"
				w="full"
			>
				<Tooltip label={showMap ? "Hide map" : "Show map"} hasArrow>
					<IconButton
						aria-label={showMap ? "Hide map" : "Show map"}
						aria-expanded={showMap}
						icon={<FaMapMarkedAlt />}
						size="sm"
						variant="outline"
						borderColor={showMap ? "gray.500" : "gray.300"}
						color="gray.700"
						bg={showMap ? "gray.100" : "transparent"}
						h="32px"
						minW="32px"
						onClick={() => setShowMap((current) => !current)}
						_hover={{ borderColor: "gray.400", bg: "gray.100" }}
					/>
				</Tooltip>

				<Button
					{...buttonStyles}
					leftIcon={<FaDirections />}
					onClick={handleOpenDirections}
				>
					Directions
				</Button>

				<Button
					{...buttonStyles}
					leftIcon={<FaCopy />}
					onClick={handleCopyAddress}
				>
					Copy
				</Button>
			</HStack>

			<Collapse in={showMap} animateOpacity style={{ width: "100%" }}>
				<Box
					w="full"
					maxW="300px"
					ml={{ base: "auto", md: textAlign === "right" ? "auto" : undefined }}
					mr={{ base: "auto", md: textAlign === "left" ? "auto" : undefined }}
					h={{ base: "140px", md: "160px" }}
					overflow="hidden"
					border="1px solid"
					borderColor="gray.200"
					borderRadius="md"
				>
					{showMap && (
						<iframe
							width="100%"
							height="100%"
							style={{ border: 0 }}
							loading="lazy"
							referrerPolicy="no-referrer-when-downgrade"
							src={getEmbedUrl(address)}
							title={`${type} location map`}
							allowFullScreen
						/>
					)}
				</Box>
			</Collapse>
		</VStack>
	);
}
