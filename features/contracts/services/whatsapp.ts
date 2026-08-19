import { FormData as ContractFormData } from '../types';
import {
	BIXS_API_ROUTES,
	BIXS_COMPANY_WHATSAPP_E164,
	getBixsAuthPayload,
} from '../constants/bixsApi';
import { sendWhatsAppDocument } from './sendWhatsAppDocument';
import { uploadContractPdf } from './uploadContractMedia';

type BixsLoginResponse = {
	token?: string;
	access_token?: string;
	user_id?: string;
};

function slugifyContratante(contratante: string): string {
	return contratante.replace(/[^a-z0-9]/gi, '_').toLowerCase();
}

function readActiveInstanceId(raw: unknown): string {
	if (!Array.isArray(raw) || raw.length === 0) {
		throw new Error(
			'Nenhuma instância do WhatsApp encontrada conectada ao gateway. Por favor, conecte primeiro.',
		);
	}
	const first = raw[0];
	if (!first || typeof first !== 'object') {
		throw new Error('Resposta inválida ao listar instâncias do WhatsApp.');
	}
	const id = (first as Record<string, unknown>).id;
	if (typeof id === 'string' && id.length > 0) return id;
	if (typeof id === 'number' && Number.isFinite(id)) return String(id);
	throw new Error('Instância WhatsApp sem id.');
}

/**
 * Sobe o PDF no media-service e envia o mesmo documento via document_url
 * para a empresa e para o cliente.
 */
export const sendToWhatsApp = async (
	pdfBlob: Blob,
	data: ContractFormData,
	isDevEnvironment: boolean,
	testPhone: string,
): Promise<void> => {
	console.log('--- ENVIANDO PARA O WHATSAPP ---');

	console.log('1. [TENTATIVA] Login na API Bixs:', BIXS_API_ROUTES.authLogin);
	let loginResponse: Response;
	try {
		loginResponse = await fetch(BIXS_API_ROUTES.authLogin, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(getBixsAuthPayload()),
		});
	} catch (err) {
		console.error('1. [FALHA] Erro de rede na requisição de login:', err);
		throw new Error('Falha de rede no login (possível erro de CORS ou servidor offline).');
	}

	if (!loginResponse.ok) {
		console.error(`1. [FALHA] Login falhou. Status HTTP: ${loginResponse.status}`);
		throw new Error(`Falha no login da API Bixs. Status: ${loginResponse.status}`);
	}
	const loginData = (await loginResponse.json()) as BixsLoginResponse;
	const token = loginData.access_token ?? loginData.token;
	const ownerId = loginData.user_id;
	if (!token) {
		throw new Error('Token não retornado pela API Bixs.');
	}
	if (!ownerId) {
		throw new Error('user_id não retornado pela API Bixs.');
	}
	console.log('1. [SUCESSO] Login realizado com sucesso. Token obtido.');

	const slug = slugifyContratante(data.contratante);
	const documentUrl = await uploadContractPdf({
		token,
		ownerId,
		pdfBlob,
		fileName: `Contrato_BIXS_${slug}.pdf`,
	});

	console.log('3. [TENTATIVA] Buscar instâncias ativas do WhatsApp:', BIXS_API_ROUTES.instances);
	let instancesResponse: Response;
	try {
		instancesResponse = await fetch(BIXS_API_ROUTES.instances, {
			headers: {
				Authorization: `Bearer ${token}`,
				accept: 'application/json',
			},
		});
	} catch (err) {
		console.error('3. [FALHA] Erro de rede na requisição de instâncias:', err);
		throw new Error('Falha de rede ao buscar instâncias ativas do WhatsApp.');
	}
	if (!instancesResponse.ok) {
		throw new Error(`Falha ao buscar instâncias. Status: ${instancesResponse.status}`);
	}
	const activeInstanceId = readActiveInstanceId(await instancesResponse.json());
	console.log('3. [SUCESSO] Instância conectada encontrada. ID:', activeInstanceId);

	const devPhoneWithCountry = testPhone.startsWith('55') ? testPhone : `55${testPhone}`;
	const companyPhone = isDevEnvironment ? devPhoneWithCountry : BIXS_COMPANY_WHATSAPP_E164;
	const cleanClientPhone = data.contato.replace(/\D/g, '');
	const clientPhoneWithCountry = isDevEnvironment
		? devPhoneWithCountry
		: cleanClientPhone.startsWith('55')
			? cleanClientPhone
			: `55${cleanClientPhone}`;

	await sendWhatsAppDocument({
		token,
		instanceId: activeInstanceId,
		to: companyPhone,
		toName: data.contratante,
		message: `Novo contrato gerado e assinado!\n\n*Contratante:* ${data.contratante}\n*CNPJ/CPF:* ${data.cpfCnpj}\n*Segmento:* ${data.segmento}`,
		documentUrl,
		logLabel: 'mensagem para a empresa',
	});
	await sendWhatsAppDocument({
		token,
		instanceId: activeInstanceId,
		to: clientPhoneWithCountry,
		toName: data.contratante,
		message:
			'*Confirmação de Contrato – Empresa BIXs*\n\nA Empresa BIXs confirma o recebimento do contrato, juntamente com os dados do contratante e documentos apresentados, sendo estes cópias fiéis dos originais.',
		documentUrl,
		logLabel: 'mensagem para o cliente',
	});

	console.log('--- CONTRATOS ENVIADOS COM SUCESSO ---');
};
