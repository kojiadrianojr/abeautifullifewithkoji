/**
 * Service for handling wedding configuration
 */

import weddingConfig from "@/config/wedding.json";

export type WeddingConfig = typeof weddingConfig;

export class ConfigService {
	private static config: WeddingConfig = weddingConfig;

	/**
	 * Get the full wedding configuration
	 */
	static getConfig(): WeddingConfig {
		return this.config;
	}

	/**
	 * Get couple names (first names only)
	 */
	static getCoupleNames(): string {
		const { partner1, partner2 } = this.config.wedding.couple;
		return `${partner1.firstName} & ${partner2.firstName}`;
	}

	/**
	 * Get full couple names
	 */
	static getFullCoupleNames(): string {
		const { partner1, partner2 } = this.config.wedding.couple;
		return `${partner1.firstName} ${partner1.lastName} & ${partner2.firstName} ${partner2.lastName}`;
	}

	/**
	 * Get wedding date as Date object
	 */
	static getWeddingDate(): Date {
		return new Date(this.config.wedding.date);
	}

	/**
	 * Format wedding date for display
	 */
	static formatWeddingDate(): string {
		const date = this.getWeddingDate();
		return date.toLocaleDateString("en-US", {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	}

	/**
	 * Get wedding venue information
	 */
	static getVenue() {
		return this.config.wedding.venue;
	}

	/**
	 * Get wedding time
	 */
	static getWeddingTime(): string {
		return this.config.wedding.time;
	}

	/**
	 * Get ceremony venue details
	 */
	static getCeremonyVenue() {
		return this.config.wedding.venue.ceremony;
	}

	/**
	 * Get reception venue details
	 */
	static getReceptionVenue() {
		return this.config.wedding.venue.reception;
	}

	/**
	 * Get content section configuration
	 */
	static getContentSection<T extends keyof WeddingConfig["content"]>(
		section: T,
	): WeddingConfig["content"][T] {
		return this.config.content[section];
	}

	/**
	 * Check if a section is enabled
	 */
	static isSectionEnabled(section: keyof WeddingConfig["content"]): boolean {
		return this.config.content[section].enabled !== false;
	}

	/**
	 * Get theme colors
	 */
	static getTheme() {
		return this.config.theme;
	}

	/**
	 * Get primary color
	 */
	static getPrimaryColor(): string {
		return this.config.theme.colors.primary;
	}

	/**
	 * Get secondary color
	 */
	static getSecondaryColor(): string {
		return this.config.theme.colors.secondary;
	}

	/**
	 * Get accent color
	 */
	static getAccentColor(): string {
		return this.config.theme.colors.accent;
	}
}
