"use client";

import React, { useState, useEffect } from "react";
import Countdown from "react-countdown";
import { Box, Text, Flex, VStack, Icon, Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton } from "@chakra-ui/react";
import { getWeddingConfig } from "@/lib/config";
import { FiMaximize2 } from "react-icons/fi";

function CountdownComponent() {
	const [mounted, setMounted] = useState(false);
	const [isFullScreen, setIsFullScreen] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const openFullScreen = () => {
		setIsFullScreen(true);
	};

	const closeFullScreen = () => {
		setIsFullScreen(false);
	};

	if (!mounted) {
		return (
			<Box
				minH={100}
				display="flex"
				alignItems="center"
				justifyContent="center"
			>
				<Text fontSize="xl" opacity={0.7}>
					Loading...
				</Text>
			</Box>
		);
	}

	return (
		<>
			<Box>
				<Countdown
					date={new Date(getWeddingConfig().wedding.datetime).getTime()}
					renderer={(props) => renderer(props, openFullScreen, false)}
				/>
				<Flex justifyContent="center" mt={3}>
					<Text
						fontSize="xs"
						color="gray.500"
						cursor="pointer"
						onClick={openFullScreen}
						px={3}
						py={1}
						borderRadius="md"
						transition="all 0.2s"
						_hover={{
							color: "primary.600",
							bg: "gray.50",
						}}
						userSelect="none"
						display="flex"
						alignItems="center"
						gap={1}
					>
						<Icon as={FiMaximize2} boxSize={3} />
						Full Screen View
					</Text>
				</Flex>
			</Box>

			<Modal 
				isOpen={isFullScreen} 
				onClose={closeFullScreen} 
				size="full"
				motionPreset="slideInBottom"
			>
				<ModalOverlay 
					bg="blackAlpha.900"
					backdropFilter="blur(10px)"
				/>
				<ModalContent 
					bg="transparent"
					display="flex"
					alignItems="center"
					justifyContent="center"
				>
					<ModalCloseButton 
						size="lg"
						color="white"
						_hover={{ bg: "whiteAlpha.200" }}
						zIndex={2}
					/>
					<ModalBody 
						display="flex" 
						alignItems="center" 
						justifyContent="center"
						w="full"
						h="full"
					>
						<Box textAlign="center" w="full">
							<Countdown
								date={new Date(getWeddingConfig().wedding.datetime).getTime()}
								renderer={(props) => renderer(props, closeFullScreen, true)}
							/>
						</Box>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
}

interface CountdownRenderProps {
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
	completed: boolean;
}

const renderer = (
	{ days, hours, minutes, seconds, completed }: CountdownRenderProps,
	openFullScreen: () => void,
	isFullScreenMode: boolean
) => {
	if (completed) {
		return (
			<Text 
				fontSize={isFullScreenMode ? "6xl" : "2xl"} 
				fontWeight="semibold" 
				color={isFullScreenMode ? "white" : "primary.600"}
			>
				Today&apos;s the day! 🎉
			</Text>
		);
	}

	const timeUnits = [
		{ value: days, label: "Days" },
		{ value: hours, label: "Hours" },
		{ value: minutes, label: "Minutes" },
		{ value: seconds, label: "Seconds" },
	];

	return (
		<Flex 
			direction="row" 
			gap={isFullScreenMode ? 8 : 4} 
			justifyContent="center" 
			flexWrap="wrap"
			maxW={isFullScreenMode ? "full" : { base: "full", lg: "600px", xl: "full" }}
			mx="auto"
		>
			{timeUnits.map((unit, index) => {
				const isSeconds = index === 3;
				
				return (
					<VStack
						key={index}
						px={isFullScreenMode ? { base: 8, sm: 12 } : { base: 4, sm: 6 }}
						py={isFullScreenMode ? { base: 6, sm: 10 } : { base: 3, sm: 4 }}
						bg={isFullScreenMode ? "whiteAlpha.100" : "gray.50"}
						borderRadius="xl"
						minW={isFullScreenMode ? { base: "120px", sm: "180px" } : { base: "70px", sm: "90px" }}
						textAlign="center"
						spacing={isFullScreenMode ? 3 : 1}
						border="2px solid"
						borderColor={isFullScreenMode ? "whiteAlpha.300" : "gray.200"}
						transition="all 0.3s ease"
						cursor={isFullScreenMode ? "default" : "pointer"}
						position="relative"
						onClick={isFullScreenMode ? undefined : openFullScreen}
						display={isSeconds && !isFullScreenMode ? { base: "none", xl: "flex" } : "flex"}
						_hover={isFullScreenMode ? {
							borderColor: "whiteAlpha.500",
						} : {
							borderColor: "primary.300",
							transform: "translateY(-2px)",
							boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
						}}
						_active={isFullScreenMode ? {} : {
							transform: "translateY(0)",
						}}
						backdropFilter={isFullScreenMode ? "blur(10px)" : "none"}
					>
					{!isFullScreenMode && (
						<Box
							position="absolute"
							top={1}
							right={1}
							opacity={0}
							transition="opacity 0.2s"
							_groupHover={{ opacity: 1 }}
							sx={{
								".countdown-box:hover &": {
									opacity: 0.5,
								},
							}}
						>
							<Icon
								as={FiMaximize2}
								boxSize={3}
								color="gray.400"
							/>
						</Box>
					)}
					<Text
						fontSize={isFullScreenMode ? { base: "7xl", sm: "8xl", md: "9xl" } : { base: "3xl", sm: "4xl" }}
						fontWeight="bold"
						color={isFullScreenMode ? "white" : "primary.600"}
						lineHeight={1}
					>
						{unit.value}
					</Text>
					<Text
						fontSize={isFullScreenMode ? { base: "xl", sm: "2xl" } : { base: "xs", sm: "sm" }}
						fontWeight="semibold"
						color={isFullScreenMode ? "whiteAlpha.800" : "gray.600"}
						textTransform="uppercase"
						letterSpacing="wide"
					>
						{unit.label}
					</Text>
				</VStack>
				);
			})}
		</Flex>
	);
};

export default CountdownComponent;

