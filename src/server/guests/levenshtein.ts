/**
 * Levenshtein edit distance between two strings.
 * Iterative two-row implementation — O(n*m) time, O(min(n,m)) space, no deps.
 */
export function levenshtein(a: string, b: string): number {
	if (a === b) return 0;
	if (a.length === 0) return b.length;
	if (b.length === 0) return a.length;

	// Keep the shorter string as the inner loop to minimise the row width.
	if (a.length > b.length) {
		[a, b] = [b, a];
	}

	let previousRow = Array.from({ length: a.length + 1 }, (_, i) => i);
	let currentRow = new Array<number>(a.length + 1);

	for (let j = 1; j <= b.length; j++) {
		currentRow[0] = j;
		const bChar = b.charCodeAt(j - 1);

		for (let i = 1; i <= a.length; i++) {
			const cost = a.charCodeAt(i - 1) === bChar ? 0 : 1;
			currentRow[i] = Math.min(
				currentRow[i - 1] + 1, // insertion
				previousRow[i] + 1, // deletion
				previousRow[i - 1] + cost, // substitution
			);
		}

		[previousRow, currentRow] = [currentRow, previousRow];
	}

	return previousRow[a.length];
}
