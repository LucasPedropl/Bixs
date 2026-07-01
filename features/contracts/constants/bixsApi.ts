/** Base da API Gateway Bixs (Swagger: /docs/gateway/doc.json) */
export const BIXS_API_BASE = 'https://api.bixs.com.br';

/**
 * Rotas oficiais via Gateway + Message Service (Swagger: /docs/message/doc.json).
 * Instâncias e mensagens usam /v1/api/* — não o prefixo legado /v1/api/message/*.
 */
export const BIXS_API_ROUTES = {
	authLogin: `${BIXS_API_BASE}/v1/auth/login`,
	uploadMedia: `${BIXS_API_BASE}/v1/api/upload/media`,
	instances: `${BIXS_API_BASE}/v1/api/instances`,
	messagesSend: `${BIXS_API_BASE}/v1/api/messages/send`,
} as const;

/**
 * Canal de autenticação para clientes externos.
 * Não confundir com a capability `application` (módulo WhatsApp) exigida nas rotas de instância.
 */
export const BIXS_AUTH_SOURCE = 'api_externa';

export const BIXS_AUTH_PAYLOAD = {
	email: 'pedrolucasmota2005@gmail.com',
	password: 'plm200510',
	mac: 'docs',
	source: BIXS_AUTH_SOURCE,
};
