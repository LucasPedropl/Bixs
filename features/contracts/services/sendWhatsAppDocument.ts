import { BIXS_API_ROUTES } from '../constants/bixsApi';
import { parseBixsApiError } from './parseBixsApiError';

export async function sendWhatsAppDocument(input: {
	token: string;
	instanceId: string;
	to: string;
	toName: string;
	message: string;
	documentUrl: string;
	logLabel: string;
}): Promise<void> {
	const payload = {
		instance_id: input.instanceId,
		to: input.to,
		to_name: input.toName,
		message: input.message,
		document_url: input.documentUrl,
		image_url: '',
		audio_url: '',
		video_url: '',
	};

	console.log(`[TENTATIVA] ${input.logLabel} (${input.to}):`, BIXS_API_ROUTES.messagesSend, {
		...payload,
		document_url: input.documentUrl,
	});

	let response: Response;
	try {
		response = await fetch(BIXS_API_ROUTES.messagesSend, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${input.token}`,
				'Content-Type': 'application/json',
				accept: 'application/json',
			},
			body: JSON.stringify(payload),
		});
	} catch (err) {
		console.error(`[FALHA] Erro de rede em ${input.logLabel}:`, err);
		throw new Error(`Falha de rede ao enviar ${input.logLabel}.`);
	}

	if (!response.ok) {
		const rawBody = await response.text();
		const apiMessage = parseBixsApiError(response.status, rawBody);
		console.error(`[FALHA] ${input.logLabel}. Status HTTP: ${response.status}`, apiMessage);
		throw new Error(`Falha ao enviar ${input.logLabel}. ${apiMessage}`);
	}
	console.log(`[SUCESSO] ${input.logLabel}`);
}
