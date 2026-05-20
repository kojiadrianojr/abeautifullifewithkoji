"use client";

import { useState } from "react";
import { Box } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { SkeletonImage } from "@/components/ui/SkeletonImage";

const MotionBox = motion.create(Box);

interface DressCodeImageProps {
	src: string;
	index: number;
	onClick: () => void;
}

export function DressCodeImage({ src, index, onClick }: DressCodeImageProps) {
	const [imgSrc, setImgSrc] = useState(src);
	const [errored, setErrored] = useState(false);

	const handleError = () => {
		if (!errored) {
			const fallback = src.includes("drive.google.com/thumbnail")
				? src.replace(/sz=w\d+/, "sz=w800")
				: src;
			setImgSrc(fallback);
			setErrored(true);
		}
	};

	return (
		<MotionBox
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-40px" }}
			transition={{ duration: 0.5, delay: (index % 8) * 0.07 }}
			aspectRatio={3 / 4}
			cursor="pointer"
			overflow="hidden"
			borderRadius="2xl"
			boxShadow="md"
			onClick={onClick}
			position="relative"
			_hover={{
				boxShadow: "xl",
				transform: "scale(1.04)",
			}}
			css={{
				transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
			}}
		>
			<SkeletonImage
				src={imgSrc}
				alt={`Dress code inspiration ${index + 1}`}
				fill
				sizes="(max-width: 640px) 50vw, 25vw"
				loading="lazy"
				unoptimized
				onError={handleError}
				borderRadius="2xl"
			/>
		</MotionBox>
	);
}
