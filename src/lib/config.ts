/**
 * @deprecated Use ConfigService from @/services instead
 * This file is kept for backward compatibility
 */

import { ConfigService } from "@/services";

export type WeddingConfig = typeof import("@/config/wedding.json");

export function getWeddingConfig(): WeddingConfig {
	return ConfigService.getConfig();
}

export function getCoupleNames(): string {
	return ConfigService.getCoupleNames();
}

export function getFullCoupleNames(): string {
	return ConfigService.getFullCoupleNames();
}

export function getWeddingDate(): Date {
	return ConfigService.getWeddingDate();
}

export function formatWeddingDate(): string {
	return ConfigService.formatWeddingDate();
}

export default ConfigService.getConfig();
