"use client";

import {
	Input,
	InputGroup,
	InputLeftElement,
	InputRightElement,
	IconButton,
	FormControl,
	FormLabel,
	FormHelperText,
} from "@chakra-ui/react";
import { SearchIcon, CloseIcon } from "@chakra-ui/icons";
import { ChangeEvent } from "react";

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
		<FormControl>
			<FormLabel
				fontSize={{ base: "sm", md: "md" }}
				fontWeight="semibold"
				color="primary.600"
				textAlign="left"
				letterSpacing="widest"
				textTransform="uppercase"
				mb={3}
			>
				Find Your Invitation
			</FormLabel>

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
					borderColor="gray.200"
					borderRadius="xl"
					_hover={{
						borderColor: "primary.300",
					}}
					_focus={{
						borderColor: "primary.400",
						boxShadow: "0 0 0 3px rgba(195,177,225,0.35)",
					}}
					fontSize={{ base: "md", md: "lg" }}
					px={12}
					py={{ base: 6, md: 7 }}
					disabled={isLoading}
					fontWeight="medium"
					boxShadow="0 2px 12px rgba(0,0,0,0.06)"
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
							colorScheme="gray"
							disabled={isLoading}
							_hover={{ bg: "gray.100" }}
						/>
					</InputRightElement>
				)}
			</InputGroup>

			{helperText && (
				<FormHelperText
					color="gray.700"
					fontSize="xs"
					mt={2}
					textAlign="center"
					fontStyle="italic"
					textShadow="0 1px 3px rgba(255,255,255,0.6)"
				>
					{helperText}
				</FormHelperText>
			)}
		</FormControl>
	);
}
