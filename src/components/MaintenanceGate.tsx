'use client';

import { useState } from 'react';
import MaintenancePage from './MaintenancePage';

const BYPASS_STORAGE_KEY = 'maintenance_bypass';

export default function MaintenanceGate({ children }: { children: React.ReactNode }) {
	const maintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';
	const maintenanceToken = process.env.NEXT_PUBLIC_MAINTENANCE_TOKEN;

	// Resolve bypass synchronously on first render (browser only) to avoid
	// the null → children flash that occurred with the previous useEffect approach.
	const [bypassed] = useState<boolean | null>(() => {
		// SSR: we cannot access window/sessionStorage — stay null until hydration.
		if (typeof window === 'undefined') return null;

		// Maintenance off — always allow through.
		if (!maintenanceMode) return true;

		// Check URL token first.
		const params = new URLSearchParams(window.location.search);
		const urlToken = params.get('token');
		if (maintenanceToken && urlToken === maintenanceToken) {
			sessionStorage.setItem(BYPASS_STORAGE_KEY, 'true');
			// Clean the token from the URL without a page reload.
			params.delete('token');
			const newSearch = params.toString();
			const newUrl =
				window.location.pathname +
				(newSearch ? `?${newSearch}` : '') +
				window.location.hash;
			window.history.replaceState(null, '', newUrl);
			return true;
		}

		// Fall back to a previously stored bypass.
		return sessionStorage.getItem(BYPASS_STORAGE_KEY) === 'true';
	});

	// If maintenance mode is off, render immediately (no flash).
	if (!maintenanceMode) {
		return <>{children}</>;
	}

	// SSR: render nothing briefly while we wait for client hydration.
	if (bypassed === null) {
		return null;
	}

	if (!bypassed) {
		return <MaintenancePage />;
	}

	return <>{children}</>;
}
