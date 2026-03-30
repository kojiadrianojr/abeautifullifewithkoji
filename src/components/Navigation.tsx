"use client";

import { useState, useMemo } from "react";
import {
	Box,
	Container,
	Flex,
	Heading,
	useBreakpointValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { NAV_ITEMS, smoothScrollTo, scrollToTop } from "@/lib/navigation";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useMounted } from "@/hooks/useMounted";
import { MobileNav } from "./Navigation/MobileNav";
import { DesktopNav } from "./Navigation/DesktopNav";
import { BackToTopButton } from "./Navigation/BackToTopButton";

const MotionBox = motion.create(Box);

export default function Navigation() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isNavHovered, setIsNavHovered] = useState(false);
	const [touchStartY, setTouchStartY] = useState(0);
	const [swipeDistance, setSwipeDistance] = useState(0);
	const [isSwipeActive, setIsSwipeActive] = useState(false);

	const mounted = useMounted();
	const { isScrolled: trigger } = useScrollPosition({ threshold: 30 });
	const { isScrolled: showBackToTop } = useScrollPosition({ threshold: 300 });

	const isMobile = useBreakpointValue(
		{ base: true, md: false },
		{ ssr: false },
	);

	const sectionIds = useMemo(
		() => NAV_ITEMS.map((item) => item.href.slice(1)),
		[],
	);

	const activeSection = useActiveSection({
		sectionIds,
	});

	const handleLogoClick = () => scrollToTop();

	const handleNavItemClick = (href: string) => {
		const sectionId = href.slice(1);
		smoothScrollTo(sectionId);
		setIsMobileMenuOpen(false);
	};

	const handleTouchStart = (e: React.TouchEvent) => {
		if (isMobile && window.scrollY > 50) {
			const touchY = e.touches[0].clientY;
			// Only activate swipe if touch starts near the top of the screen
			if (touchY < 100) {
				setTouchStartY(touchY);
				setIsSwipeActive(true);
			}
		}
	};

	const handleTouchMove = (e: React.TouchEvent) => {
		if (isMobile && isSwipeActive && touchStartY > 0) {
			const touchY = e.touches[0].clientY;
			const deltaY = touchY - touchStartY;
			
			// Only show navbar if swiping down and past threshold
			if (deltaY > 0) {
				setSwipeDistance(deltaY);
				// Show navbar when user has swiped down at least 30px
				if (deltaY > 30) {
					setIsNavHovered(true);
				}
			}
		}
	};

	const handleTouchEnd = () => {
		if (isMobile) {
			// If swipe was significant, keep navbar visible for 3 seconds
			if (swipeDistance > 50 && !isMobileMenuOpen) {
				setTimeout(() => setIsNavHovered(false), 3000);
			} else if (swipeDistance < 30) {
				// If swipe was too small, hide navbar immediately
				setIsNavHovered(false);
			}
			// Reset swipe state
			setSwipeDistance(0);
			setIsSwipeActive(false);
			setTouchStartY(0);
		}
	};

	if (!mounted) return null;

	const shouldShowNav = isNavHovered || isMobileMenuOpen || !trigger;

	const handleMouseEnter = () => {
		if (!isMobile) setIsNavHovered(true);
	};

	const handleMouseLeave = (e: React.MouseEvent) => {
		if (isMobile) return;
		// Only hide if mouse is moving down and away from top
		if (e.clientY > 120) {
			setIsNavHovered(false);
		}
	};

	return (
		<>
			<BackToTopButton show={showBackToTop} onClick={scrollToTop} />

			{/* Swipe indicator for mobile - shows when user is near top */}
			{isMobile && trigger && !shouldShowNav && (
				<MotionBox
					initial={{ opacity: 0 }}
					animate={{ opacity: isSwipeActive && swipeDistance > 10 ? 0.6 : 0 }}
					transition={{ duration: 0.2 }}
					position="fixed"
					top={0}
					left="50%"
					transform="translateX(-50%)"
					zIndex={1098}
					pointerEvents="none"
				>
					<Box
						mt={2}
						px={4}
						py={1}
						bg="primary.500"
						color="white"
						borderRadius="full"
						fontSize="xs"
						fontWeight="medium"
						boxShadow="md"
					>
						↓ Swipe down to show menu
					</Box>
				</MotionBox>
			)}

			{/* Hover trigger area - always present at top */}
			<Box
				position="fixed"
				top={0}
				left={0}
				right={0}
				height="100px"
				zIndex={1099}
				pointerEvents="auto"
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				onTouchStart={handleTouchStart}
				onTouchMove={handleTouchMove}
				onTouchEnd={handleTouchEnd}
			/>

			<MotionBox
				initial={{ y: -100, opacity: 0 }}
				animate={{ y: shouldShowNav ? 0 : -70, opacity: 1 }}
				transition={{ 
					duration: 0.3, 
					ease: "easeOut",
					// Add slight bounce when showing
					type: swipeDistance > 0 ? "spring" : "tween",
					stiffness: 200,
					damping: 20,
				}}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				position="fixed"
				top={0}
				left={0}
				right={0}
				zIndex={1100}
			>
				<Box
					bg={
						trigger
							? "rgba(255, 255, 255, 0.98)"
							: "linear-gradient(180deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.2) 50%, transparent 100%)"
					}
					backdropFilter={trigger ? "blur(10px)" : "blur(5px)"}
					boxShadow={trigger ? "md" : "none"}
					transition="all 0.3s ease"
					py={trigger ? 1.5 : 2}
				>
					<Container maxW="7xl">
						<Flex justify="space-between" align="center">
							<Heading
								as="button"
								fontSize={{ base: "xl", md: "2xl" }}
								fontFamily="heading"
								fontWeight="normal"
								color={trigger ? "primary.500" : "white"}
								cursor="pointer"
								onClick={handleLogoClick}
								textShadow={trigger ? "none" : "0 2px 4px rgba(0,0,0,0.3)"}
								_hover={{ opacity: 0.8 }}
								transition="all 0.3s ease"
							>
								K & B
							</Heading>

							{!isMobile && (
								<DesktopNav
									items={NAV_ITEMS}
									activeSection={activeSection}
									trigger={trigger}
									onItemClick={handleNavItemClick}
								/>
							)}

							{isMobile && (
								<MobileNav
									items={NAV_ITEMS}
									activeSection={activeSection}
									isOpen={isMobileMenuOpen}
									trigger={trigger}
									onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
									onItemClick={handleNavItemClick}
								/>
							)}
						</Flex>
					</Container>
				</Box>
			</MotionBox>
		</>
	);
}
