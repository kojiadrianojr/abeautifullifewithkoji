"use client";

import {
	Input,
	InputGroup,
	InputLeftElement,
	InputRightElement,
	IconButton,
	VStack,
} from "@chakra-ui/react";
import { SearchIcon, CloseIcon } from "@chakra-ui/icons";
import { ChangeEvent } from "react";
import {
	RSVPCard,
	RSVPCardHeader,
	RSVPDivider,
	RSVPHelperText,
} from "./RSVPPrimitives";

export interface GuestSearchInputProps {
	value: string;
	onChange: (value: string) => void;
	onSearch: () => void;
	placeholder?: string;
	helperText?: string;
	isLoading?: boolean;
}

export function GuestSearchInput({
	value,
	onChange,
	onSearch,
	placeholder = "Enter your full name",
	helperText = "Search for your name to view your invitation details",
	isLoading = false,
}: GuestSearchInputProps) {
	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		onChange(e.target.value);
	};

	const handleClear = () => {
		onChange("");
	};

	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			onSearch();
		}
	};

	return (
		<RSVPCard>
			<VStack spacing={3} p={{ base: 4, md: 5 }} align="stretch">
				<RSVPCardHeader icon={SearchIcon} title="Find Your Invitation" />

				<RSVPDivider />

				{helperText && <RSVPHelperText>{helperText}</RSVPHelperText>}

				<InputGroup size={{ base: "md", md: "lg" }}>
					<InputLeftElement pointerEvents="none" height="100%">
						<SearchIcon color="primary.400" boxSize={4} />
					</InputLeftElement>
					<Input
						value={value}
						onChange={handleChange}
						onKeyPress={handleKeyPress}
						placeholder={placeholder}
						bg="white"
						color="gray.800"
						border="1.5px solid"
						borderColor="purple.100"
						borderRadius="xl"
						_hover={{
							borderColor: "secondary.300",
						}}
						_focus={{
							borderColor: "secondary.400",
							boxShadow: "0 0 0 3px rgba(192,57,43,0.12)",
						}}
						fontSize={{ base: "md", md: "lg" }}
						px={12}
						py={{ base: 6, md: 7 }}
						minH="48px"
						disabled={isLoading}
						fontWeight="medium"
						boxShadow="0 1px 6px rgba(195,177,225,0.12)"
						_placeholder={{
							color: "gray.400",
							fontStyle: "italic",
						}}
					/>
					{value && (
						<InputRightElement height="100%" paddingRight={2}>
							<IconButton
								aria-label="Clear search"
								icon={<CloseIcon />}
								size="sm"
								variant="ghost"
								onClick={handleClear}
								color="gray.400"
								disabled={isLoading}
								_hover={{ bg: "purple.50", color: "secondary.500" }}
							/>
						</InputRightElement>
					)}
				</InputGroup>
			</VStack>
		</RSVPCard>
	);
}
