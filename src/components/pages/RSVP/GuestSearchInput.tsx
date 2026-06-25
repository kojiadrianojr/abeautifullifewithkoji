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
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import {
	RSVPCard,
	RSVPCardHeader,
	RSVPDivider,
	RSVPHelperText,
	RSVPStepLabel,
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
	placeholder = "Example: Mary Beatrix",
	helperText = "Use the name printed on your invitation card.",
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
			<VStack spacing={4} p={{ base: 4, md: 5 }} align="stretch">
				<RSVPStepLabel>Step 1 of 2</RSVPStepLabel>

				<RSVPCardHeader icon={SearchIcon} title="Type Your Name" />

				<RSVPDivider />

				{helperText && <RSVPHelperText>{helperText}</RSVPHelperText>}

				<InputGroup size={{ base: "md", md: "lg" }}>
					<InputLeftElement pointerEvents="none" height="100%">
						<SearchIcon color="primary.400" boxSize={5} />
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
						fontFamily="body"
						_hover={{
							borderColor: "secondary.300",
						}}
						_focus={{
							borderColor: "secondary.400",
							boxShadow: "0 0 0 3px rgba(192,57,43,0.12)",
						}}
						fontSize={{ base: "lg", md: "xl" }}
						px={12}
						py={{ base: 6, md: 7 }}
						minH="52px"
						disabled={isLoading}
						fontWeight="medium"
						boxShadow="0 1px 6px rgba(195,177,225,0.12)"
						_placeholder={{
							color: "gray.400",
						}}
						aria-label="Your name"
					/>
					{value && (
						<InputRightElement height="100%" paddingRight={2}>
							<IconButton
								aria-label="Clear name"
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

				<AnimatedButton
					w="100%"
					minH="52px"
					fontSize={{ base: "md", md: "lg" }}
					fontFamily="body"
					fontWeight="semibold"
					onClick={onSearch}
					isLoading={isLoading}
					isDisabled={!value.trim()}
					leftIcon={<SearchIcon />}
					bg="secondary.500"
					color="white"
					borderRadius="xl"
					boxShadow="0 4px 16px rgba(192,57,43,0.3)"
					_hover={{
						bg: "secondary.600",
						boxShadow: "0 6px 24px rgba(192,57,43,0.4)",
					}}
					_disabled={{
						opacity: 0.5,
						cursor: "not-allowed",
						_hover: { bg: "secondary.500" },
					}}
				>
					Look Up My Name
				</AnimatedButton>
			</VStack>
		</RSVPCard>
	);
}
