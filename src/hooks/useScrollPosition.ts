"use client";

import { useState, useEffect } from "react";

interface UseScrollPositionOptions {
	threshold?: number;
}

export function useScrollPosition(options: UseScrollPositionOptions = {}) {
	const { threshold = 0 } = options;
	const [scrollY, setScrollY] = useState(0);
	const [isScrolled, setIsScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			const currentScrollY = window.scrollY;
			setScrollY(currentScrollY);
			setIsScrolled(currentScrollY > threshold);
		};

		handleScroll();
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, [threshold]);

	return { scrollY, isScrolled };
}
