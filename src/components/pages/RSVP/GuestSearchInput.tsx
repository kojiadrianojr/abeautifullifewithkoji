"use client";

import {
	Box,
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
				fontSize={{ base: "md", md: "lg" }}
				fontWeight="semibold"
				color="gray.800"
				textAlign="left"
				letterSpacing="wide"
				textTransform="uppercase"
				mb={4}
			>
				Find Your Invitation
			</FormLabel>
			
			<Box position="relative">
				{/* Decorative outer border */}
				<Box
					position="absolute"
					top="-3px"
					left="-3px"
					right="-3px"
					bottom="-3px"
					border="1px solid"
					borderColor="gold.200"
					borderRadius="xl"
					pointerEvents="none"
				/>
				
				<InputGroup 
					size={{ base: "md", md: "lg" }}
					boxShadow="0 8px 32px rgba(0,0,0,0.2)"
				>
					<InputLeftElement pointerEvents="none" height="100%">
						<SearchIcon color="gold.500" boxSize={5} />
					</InputLeftElement>
					<Input
						value={value}
						onChange={handleChange}
						onKeyPress={handleKeyPress}
						placeholder={placeholder}
						bg="white"
						color="gray.800"
						border="2px solid"
						borderColor="gold.300"
						_hover={{ 
							borderColor: "gold.400",
							boxShadow: "0 0 0 1px var(--chakra-colors-gold-400)"
						}}
						_focus={{
							borderColor: "gold.500",
							boxShadow: "0 0 0 3px rgba(212,175,55,0.2)",
						}}
						fontSize={{ base: "md", md: "lg" }}
						px={12}
						py={{ base: 6, md: 7 }}
						disabled={isLoading}
						fontWeight="medium"
						_placeholder={{
							color: "gray.400",
							fontStyle: "italic"
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
			</Box>
			
			{helperText && (
				<FormHelperText 
					color="gray.600" 
					fontSize="sm" 
					mt={3}
					textAlign="center"
					fontStyle="italic"
				>
					{helperText}
				</FormHelperText>
			)}
		</FormControl>
	);
}
