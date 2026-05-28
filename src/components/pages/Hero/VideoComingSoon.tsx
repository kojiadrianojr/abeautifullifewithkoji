"use client";

import { Box, VStack, Text, Icon } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FaPlay } from "react-icons/fa";

const MotionBox = motion.create(Box);

export function VideoComingSoon() {
	return (
		<Box
			w="100%"
			h="100%"
			bg="white"
			borderRadius="2xl"
			p={4}
			boxShadow="0 25px 70px rgba(0, 0, 0, 0.35)"
			border="3px solid"
			borderColor="primary.400"
			display="flex"
			alignItems="center"
			justifyContent="center"
		>
			<VStack spacing={6} textAlign="center" px={4}>
				{/* Animated play button */}
				<MotionBox
					animate={{ scale: [1, 1.05, 1] }}
					transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" } as object}
				>
					<Box
						w={20}
						h={20}
						borderRadius="full"
						bg="primary.500"
						display="flex"
						alignItems="center"
						justifyContent="center"
						boxShadow="0 8px 32px rgba(245, 184, 0, 0.4)"
						cursor="default"
					>
						<Icon as={FaPlay} color="white" fontSize="xl" ml={1} />
					</Box>
				</MotionBox>

				{/* Title */}
				<VStack spacing={1}>
					<Text
						fontFamily="display"
						fontSize={{ base: "xl", md: "2xl" }}
						fontWeight={600}
						color="gray.800"
						lineHeight={1.2}
					>
						Our Wedding Film
					</Text>
					<Box w={12} h="2px" bg="primary.400" borderRadius="full" />
				</VStack>

				{/* Coming soon badge */}
				<Box
					bg="primary.50"
					border="1.5px solid"
					borderColor="primary.300"
					borderRadius="full"
					px={5}
					py={1.5}
				>
					<Text
						fontFamily="body"
						fontSize="xs"
						fontWeight={700}
						color="primary.700"
						letterSpacing="widest"
						textTransform="uppercase"
					>
						Coming Soon
					</Text>
				</Box>
			</VStack>
		</Box>
	);
}
