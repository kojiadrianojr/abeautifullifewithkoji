/**
 * @deprecated Use DateService from @/services instead
 * This file is kept for backward compatibility
 */

import { DateService } from "@/services";

export function formatDate(
	date: Date | string,
	options?: Intl.DateTimeFormatOptions,
): string {
	return DateService.formatDate(date, options);
}

export function formatTime(
	date: Date | string,
	options?: Intl.DateTimeFormatOptions,
): string {
	return DateService.formatTime(date, options);
}
