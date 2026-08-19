/** Base da API Gateway Bixs (coleção Bruno api-docs v2). */
export const BIXS_API_BASE =
	import.meta.env.VITE_BIXS_API_BASE ?? 'https://api.bixs.com.br';

/**
 * Rotas via gateway. Upload canônico: POST /v1/api/media/upload
 * (alias legado POST /v1/api/upload/media). Exige capability `media`.
 */
export const BIXS_API_ROUTES = {
	authLogin: `${BIXS_API_BASE}/v1/auth/login`,
	uploadMedia: `${BIXS_API_BASE}/v1/api/media/upload`,
	instances: `${BIXS_API_BASE}/v1/api/instances`,
	messagesSend: `${BIXS_API_BASE}/v1/api/messages/send`,
} as const;

/** Stream público (sem auth). O WhatsApp precisa desta URL, não do MinIO interno. */
export function buildPublicMediaUrl(mediaId: string): string {
	return `${BIXS_API_BASE}/v1/media/${mediaId}`;
}

/** Campos extras do multipart de `05-media / Upload`. */
export const BIXS_MEDIA_UPLOAD_FIELDS = {
	module: 'contracts',
	purpose: 'contract_document',
	ownerType: 'user',
	/** Sem isso o PDF grava como private e GET /v1/media/{id} retorna 404. */
	visibility: 'public',
} as const;

/** WhatsApp comercial da BIXs (E.164 sem +). Fallback manual se o envio automático falhar. */
export const BIXS_COMPANY_WHATSAPP_E164 = '553172532104';

export function buildBixsCompanyWhatsAppUrl(prefilledMessage: string): string {
	return `https://wa.me/${BIXS_COMPANY_WHATSAPP_E164}?text=${encodeURIComponent(prefilledMessage)}`;
}

/**
 * Canal de autenticação para clientes externos.
 * Não confundir com a capability `application` (módulo WhatsApp) exigida nas rotas de instância.
 */
export const BIXS_AUTH_SOURCE = 'api_externa';

export function getBixsAuthPayload() {
	const email = import.meta.env.VITE_BIXS_API_EMAIL;
	const password = import.meta.env.VITE_BIXS_API_PASSWORD;

	if (!email || !password) {
		throw new Error(
			'Credenciais Bixs não configuradas. Defina VITE_BIXS_API_EMAIL e VITE_BIXS_API_PASSWORD no .env.local',
		);
	}

	return {
		email,
		password,
		mac: 'bixs-app',
		source: BIXS_AUTH_SOURCE,
	};
}
