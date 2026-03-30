/**
 * @deprecated Use NavigationService from @/services instead for scroll functions
 * This file is kept for backward compatibility and navigation items
 */

import { NavigationService } from "@/services";

export interface NavItem {
	label: string;
	href: string;
}

export const NAV_ITEMS: NavItem[] = [
	{ label: "Milestones", href: "#milestones" },
	{ label: "Gallery", href: "#gallery" },
	{ label: "Schedule", href: "#schedule" },
	{ label: "Details", href: "#details" },
	{ label: "Registry", href: "#registry" },
	{ label: "RSVP", href: "#rsvp" },
	{ label: "FAQ", href: "#faq" },
];

export function smoothScrollTo(targetId: string) {
	NavigationService.smoothScrollTo(targetId);
}

export function scrollToTop() {
	NavigationService.scrollToTop();
}
