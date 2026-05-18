'use client';

import { useEffect, useState } from 'react';
import MaintenancePage from './MaintenancePage';

const BYPASS_STORAGE_KEY = 'maintenance_bypass';

export default function MaintenanceGate({ children }: { children: React.ReactNode }) {
	const maintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';
	const maintenanceToken = process.env.NEXT_PUBLIC_MAINTENANCE_TOKEN;

	// Start as "loading" to avoid flash of maintenance page before client-side check
	const [bypassed, setBypassed] = useState<boolean | null>(null);

	useEffect(() => {
		if (!maintenanceMode) {
			setBypassed(true);
			return;
		}

		const params = new URLSearchParams(window.location.search);
		const urlToken = params.get('token');

		// Check if token in URL matches the configured token
		if (maintenanceToken && urlToken === maintenanceToken) {
			sessionStorage.setItem(BYPASS_STORAGE_KEY, 'true');
			// Remove ?token= from the URL without a page reload
			params.delete('token');
			const newSearch = params.toString();
			const newUrl = window.location.pathname + (newSearch ? `?${newSearch}` : '') + window.location.hash;
			window.history.replaceState(null, '', newUrl);
			setBypassed(true);
			return;
		}

		// Check sessionStorage for a previously validated bypass
		if (sessionStorage.getItem(BYPASS_STORAGE_KEY) === 'true') {
			setBypassed(true);
			return;
		}

		setBypassed(false);
	}, [maintenanceMode, maintenanceToken]);

	// If maintenance mode is off, render immediately (no flash)
	if (!maintenanceMode) {
		return <>{children}</>;
	}

	// Loading state: render nothing briefly while sessionStorage/URL is checked
	if (bypassed === null) {
		return null;
	}

	if (!bypassed) {
		return <MaintenancePage />;
	}

	return <>{children}</>;
}
