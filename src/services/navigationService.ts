/**
 * Service for handling navigation and scrolling operations
 */

export interface NavItem {
	label: string;
	href: string;
}

export class NavigationService {
	/**
	 * Smooth scroll to a specific section
	 */
	static smoothScrollTo(sectionId: string): void {
		const element = document.getElementById(sectionId);
		if (element) {
			const offsetPosition = element.offsetTop - 80; // Account for fixed nav height

			window.scrollTo({
				top: offsetPosition,
				behavior: "smooth",
			});
		}
	}

	/**
	 * Scroll to top of page
	 */
	static scrollToTop(): void {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	}

	/**
	 * Get current scroll position
	 */
	static getScrollPosition(): number {
		return window.pageYOffset || document.documentElement.scrollTop;
	}

	/**
	 * Check if user has scrolled past a threshold
	 */
	static hasScrolledPast(threshold: number): boolean {
		return this.getScrollPosition() > threshold;
	}

	/**
	 * Get the currently visible section based on scroll position
	 */
	static getActiveSection(sectionIds: string[]): string | null {
		const scrollPosition = this.getScrollPosition();

		for (let i = sectionIds.length - 1; i >= 0; i--) {
			const section = document.getElementById(sectionIds[i]);
			if (section) {
				const sectionTop = section.offsetTop - 100;
				if (scrollPosition >= sectionTop) {
					return sectionIds[i];
				}
			}
		}

		return sectionIds[0] || null;
	}

	/**
	 * Check if element is in viewport
	 */
	static isInViewport(element: HTMLElement): boolean {
		const rect = element.getBoundingClientRect();
		return (
			rect.top >= 0 &&
			rect.left >= 0 &&
			rect.bottom <=
				(window.innerHeight || document.documentElement.clientHeight) &&
			rect.right <= (window.innerWidth || document.documentElement.clientWidth)
		);
	}

	/**
	 * Add scroll listener with cleanup
	 */
	static addScrollListener(
		callback: () => void,
		options?: { throttle?: number },
	): () => void {
		let timeoutId: NodeJS.Timeout | null = null;

		const handleScroll = () => {
			if (options?.throttle) {
				if (timeoutId) return;
				timeoutId = setTimeout(() => {
					callback();
					timeoutId = null;
				}, options.throttle);
			} else {
				callback();
			}
		};

		window.addEventListener("scroll", handleScroll, { passive: true });

		// Return cleanup function
		return () => {
			window.removeEventListener("scroll", handleScroll);
			if (timeoutId) clearTimeout(timeoutId);
		};
	}
}
