"use client";

import { useMemo } from "react";
import { useBreakpointValue } from "@chakra-ui/react";
import { NAV_ITEMS, smoothScrollTo, scrollToTop } from "@/services/navigationService";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { useActiveSection } from "@/hooks/useActiveSection";
import { FloatingMobileNav } from "./Navigation/FloatingMobileNav";
import { DesktopNav } from "./Navigation/DesktopNav";
import { BackToTopButton } from "./Navigation/BackToTopButton";

export default function Navigation() {
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

	const activeSection = useActiveSection({ sectionIds });

	const handleNavItemClick = (href: string) => {
		const sectionId = href.slice(1);
		smoothScrollTo(sectionId);
	};

	return (
		<>
			<BackToTopButton show={showBackToTop} onClick={scrollToTop} />

			{isMobile && (
				<FloatingMobileNav
					items={NAV_ITEMS}
					activeSection={activeSection}
					onItemClick={handleNavItemClick}
				/>
			)}

			{isMobile === false && (
				<DesktopNav
					items={NAV_ITEMS}
					activeSection={activeSection}
					trigger={trigger}
					onItemClick={handleNavItemClick}
					onLogoClick={scrollToTop}
				/>
			)}
		</>
	);
}
