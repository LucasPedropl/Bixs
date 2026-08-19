export function parseBixsApiError(status: number, rawBody: string): string {
	if (!rawBody) return `Status: ${status}`;
	try {
		const parsed: unknown = JSON.parse(rawBody);
		if (parsed && typeof parsed === 'object') {
			const record = parsed as Record<string, unknown>;
			const message = typeof record.message === 'string' ? record.message : '';
			const details = typeof record.details === 'string' ? record.details : '';
			const combined = [message, details].filter(Boolean).join(' — ');
			if (combined) return combined;
		}
	} catch {
		return rawBody.slice(0, 300);
	}
	return rawBody.slice(0, 300);
}
