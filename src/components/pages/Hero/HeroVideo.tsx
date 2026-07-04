"use client";

import { useState } from "react";
import { Box, VStack, Text, Icon, AspectRatio } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FaPlay } from "react-icons/fa";

const MotionBox = motion.create(Box);

const VIDEO_ID = "ZRZmjQme_kY";
const POSTER_SRC = `https://img.youtube.com/vi/${VIDEO_ID}/maxresdefault.jpg`;
const EMBED_SRC = `https://www.youtube.com/embed/${VIDEO_ID}?rel=0&autoplay=1`;

export function HeroVideo() {
	const [playing, setPlaying] = useState(false);

	return (
		<Box
			w="100%"
			borderRadius="xl"
			overflow="hidden"
			border="1px solid"
			borderColor="whiteAlpha.300"
			boxShadow="0 20px 60px rgba(0,0,0,0.45)"
			position="relative"
			sx={{
				// Slim gold hairline glow around the frame
				"&::after": {
					content: '""',
					position: "absolute",
					inset: 0,
					borderRadius: "inherit",
					pointerEvents: "none",
					boxShadow: "inset 0 0 0 1px rgba(245,184,0,0.35)",
				},
			}}
		>
			<AspectRatio ratio={16 / 9}>
				{playing ? (
					<iframe
						src={EMBED_SRC}
						title="Our Wedding Film"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
						referrerPolicy="strict-origin-when-cross-origin"
						allowFullScreen
						style={{ width: "100%", height: "100%", border: 0, display: "block" }}
					/>
				) : (
					<Box
						as="button"
						type="button"
						aria-label="Play our wedding film"
						onClick={() => setPlaying(true)}
						w="100%"
						h="100%"
						position="relative"
						role="group"
						cursor="pointer"
						overflow="hidden"
					>
						{/* Poster */}
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src={POSTER_SRC}
							alt="Our Wedding Film"
							style={{
								width: "100%",
								height: "100%",
								objectFit: "cover",
								objectPosition: "center",
								display: "block",
							}}
						/>

						{/* Dark + gold gradient overlay for depth and readability */}
						<Box
							position="absolute"
							inset={0}
							bgGradient="linear(to-t, blackAlpha.700 0%, blackAlpha.300 45%, blackAlpha.400 100%)"
							transition="background 0.3s ease"
							_groupHover={{ bg: "blackAlpha.300" }}
						/>

						{/* Play button + label */}
						<VStack
							position="absolute"
							inset={0}
							justify="center"
							spacing={4}
						>
							<MotionBox
								animate={{ scale: [1, 1.06, 1] }}
								transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" } as object}
							>
								<Box
									w={{ base: 16, md: 20 }}
									h={{ base: 16, md: 20 }}
									borderRadius="full"
									bg="primary.500"
									display="flex"
									alignItems="center"
									justifyContent="center"
									boxShadow="0 0 0 1px rgba(255,255,255,0.4), 0 8px 40px rgba(245,184,0,0.55)"
									transition="transform 0.3s ease, box-shadow 0.3s ease"
									_groupHover={{
										transform: "scale(1.08)",
										boxShadow: "0 0 0 1px rgba(255,255,255,0.6), 0 10px 50px rgba(245,184,0,0.8)",
									}}
								>
									<Icon as={FaPlay} color="gray.900" fontSize={{ base: "lg", md: "xl" }} ml={1} />
								</Box>
							</MotionBox>

							<Text
								fontFamily="display"
								fontSize={{ base: "sm", md: "md" }}
								fontWeight={600}
								letterSpacing="0.18em"
								textTransform="uppercase"
								color="whiteAlpha.900"
								textShadow="0 1px 6px rgba(0,0,0,0.6)"
							>
								Watch Our Story
							</Text>
						</VStack>
					</Box>
				)}
			</AspectRatio>
		</Box>
	);
}
