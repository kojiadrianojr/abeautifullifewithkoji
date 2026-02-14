/**
 * Service for handling date and time formatting operations
 */

export type DateFormatOptions = Intl.DateTimeFormatOptions;

export class DateService {
	/**
	 * Format a date object or string to a readable format
	 */
	static formatDate(date: Date | string, options?: DateFormatOptions): string {
		const dateObj = typeof date === "string" ? new Date(date) : date;

		const defaultOptions: DateFormatOptions = {
			year: "numeric",
			month: "long",
			day: "numeric",
			...options,
		};

		return dateObj.toLocaleDateString("en-US", defaultOptions);
	}

	/**
	 * Format time from a date object or string
	 */
	static formatTime(date: Date | string, options?: DateFormatOptions): string {
		const dateObj = typeof date === "string" ? new Date(date) : date;

		const defaultOptions: DateFormatOptions = {
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
			...options,
		};

		return dateObj.toLocaleTimeString("en-US", defaultOptions);
	}

	/**
	 * Format a full date and time
	 */
	static formatDateTime(
		date: Date | string,
		dateOptions?: DateFormatOptions,
		timeOptions?: DateFormatOptions,
	): string {
		const formattedDate = this.formatDate(date, dateOptions);
		const formattedTime = this.formatTime(date, timeOptions);
		return `${formattedDate} at ${formattedTime}`;
	}

	/**
	 * Calculate time remaining until a date
	 */
	static getTimeRemaining(targetDate: Date | string): {
		days: number;
		hours: number;
		minutes: number;
		seconds: number;
		total: number;
	} {
		const target =
			typeof targetDate === "string" ? new Date(targetDate) : targetDate;
		const now = new Date();
		const total = target.getTime() - now.getTime();

		const seconds = Math.floor((total / 1000) % 60);
		const minutes = Math.floor((total / 1000 / 60) % 60);
		const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
		const days = Math.floor(total / (1000 * 60 * 60 * 24));

		return {
			days: Math.max(0, days),
			hours: Math.max(0, hours),
			minutes: Math.max(0, minutes),
			seconds: Math.max(0, seconds),
			total: Math.max(0, total),
		};
	}

	/**
	 * Check if a date is in the past
	 */
	static isPast(date: Date | string): boolean {
		const targetDate = typeof date === "string" ? new Date(date) : date;
		return targetDate.getTime() < new Date().getTime();
	}

	/**
	 * Check if a date is in the future
	 */
	static isFuture(date: Date | string): boolean {
		return !this.isPast(date);
	}

	/**
	 * Get relative time description (e.g., "in 3 days", "2 hours ago")
	 */
	static getRelativeTime(date: Date | string): string {
		const targetDate = typeof date === "string" ? new Date(date) : date;
		const now = new Date();
		const diffMs = targetDate.getTime() - now.getTime();
		const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

		if (diffDays > 0) {
			return `in ${diffDays} day${diffDays !== 1 ? "s" : ""}`;
		} else if (diffDays < 0) {
			return `${Math.abs(diffDays)} day${diffDays !== -1 ? "s" : ""} ago`;
		} else {
			return "today";
		}
	}
}
