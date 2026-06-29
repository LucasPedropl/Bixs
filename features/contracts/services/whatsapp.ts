import { FormData as ContractFormData } from '../types';

/**
 * Envia o PDF do contrato assinado para o cliente e para a empresa via API de WhatsApp da Bixs.
 * 
 * @param pdfBlob PDF gerado em formato Blob.
 * @param data Dados do formulário de contrato.
 * @param isDevEnvironment Indica se está rodando em ambiente de desenvolvimento.
 * @param testPhone Telefone de teste do ambiente de desenvolvimento.
 */
export const sendToWhatsApp = async (
	pdfBlob: Blob,
	data: ContractFormData,
	isDevEnvironment: boolean,
	testPhone: string
): Promise<void> => {
	console.log('--- ENVIANDO PARA O WHATSAPP ---');
	
	// 1. Login na API Bixs
	console.log('1. [TENTATIVA] Login na API Bixs: https://api.bixs.com.br/v1/auth/login');
	let loginResponse;
	try {
		loginResponse = await fetch('https://api.bixs.com.br/v1/auth/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email: 'pedrolucasmota2005@gmail.com',
				password: 'M6433vlks*',
				mac: 'docs',
				source: 'api_externa',
			}),
		});
	} catch (err) {
		console.error('1. [FALHA] Erro de rede na requisição de login:', err);
		throw new Error(
			'Falha de rede no login (possível erro de CORS ou servidor offline).'
		);
	}

	if (!loginResponse.ok) {
		console.error(`1. [FALHA] Login falhou. Status HTTP: ${loginResponse.status}`);
		throw new Error(
			`Falha no login da API Bixs. Status: ${loginResponse.status}`
		);
	}
	const loginData = await loginResponse.json();
	const token = loginData.token;

	if (!token) {
		console.error('1. [FALHA] Token não retornado no corpo da resposta do login.');
		throw new Error('Token não retornado pela API Bixs.');
	}
	console.log('1. [SUCESSO] Login realizado com sucesso. Token obtido.');

	// 2. Upload do PDF do contrato
	const uploadFormData = new FormData();
	uploadFormData.append(
		'file',
		pdfBlob,
		`Contrato_BIXS_${data.contratante.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`
	);

	let uploadResponse;
	console.log(
		'2. [TENTATIVA] Upload do PDF do contrato: https://api.bixs.com.br/v1/api/upload/media'
	);
	try {
		uploadResponse = await fetch('https://api.bixs.com.br/v1/api/upload/media', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				accept: 'application/json',
			},
			body: uploadFormData,
		});
	} catch (err) {
		console.error('2. [FALHA] Erro de rede na requisição de upload:', err);
		throw new Error('Falha de rede no upload da mídia do contrato.');
	}

	if (!uploadResponse.ok) {
		console.error(
			`2. [FALHA] Upload do contrato falhou. Status HTTP: ${uploadResponse.status}`
		);
		throw new Error(
			`Falha no upload do contrato. Status: ${uploadResponse.status}`
		);
	}
	const uploadData = await uploadResponse.json();
	const mediaUrl = uploadData.media_url;

	if (!mediaUrl) {
		console.error('2. [FALHA] URL da mídia não retornada no upload.');
		throw new Error('URL da mídia não retornada pela API.');
	}
	console.log('2. [SUCESSO] Upload realizado com sucesso. URL:', mediaUrl);

	// 3. Buscar Instância Ativa do WhatsApp
	let instancesResponse;
	console.log(
		'3. [TENTATIVA] Buscar instâncias ativas do WhatsApp: https://api.bixs.com.br/v1/api/message/instances'
	);
	try {
		instancesResponse = await fetch(
			'https://api.bixs.com.br/v1/api/message/instances',
			{
				headers: {
					Authorization: `Bearer ${token}`,
					accept: 'application/json',
				},
			}
		);
	} catch (err) {
		console.error('3. [FALHA] Erro de rede na requisição de instâncias:', err);
		throw new Error('Falha de rede ao buscar instâncias ativas do WhatsApp.');
	}
	if (!instancesResponse.ok) {
		console.error(
			`3. [FALHA] Busca de instâncias falhou. Status HTTP: ${instancesResponse.status}`
		);
		throw new Error(
			`Falha ao buscar instâncias. Status: ${instancesResponse.status}`
		);
	}
	const instancesData = await instancesResponse.json();
	if (!instancesData || instancesData.length === 0) {
		console.error('3. [FALHA] Nenhuma instância retornada pela API.');
		throw new Error(
			'Nenhuma instância do WhatsApp encontrada conectada ao gateway. Por favor, conecte primeiro.'
		);
	}
	
	const activeInstanceId = instancesData[0].id;
	console.log('3. [SUCESSO] Instância conectada encontrada. ID:', activeInstanceId);

	// 4. Enviar Mensagem para a Empresa
	const devPhoneWithCountry = testPhone.startsWith('55')
		? testPhone
		: `55${testPhone}`;
	const companyPhone = isDevEnvironment
		? devPhoneWithCountry
		: '553172532104';

	let messageResponse;
	const companyPayload = {
		audio_url: '',
		document_url: mediaUrl,
		image_url: '',
		instance_id: activeInstanceId,
		message: `Novo contrato gerado e assinado!\n\n*Contratante:* ${data.contratante}\n*CNPJ/CPF:* ${data.cpfCnpj}\n*Segmento:* ${data.segmento}`,
		to: companyPhone,
		to_name: data.contratante,
		video_url: '',
	};
	
	console.log(
		`4. [TENTATIVA] Enviar mensagem para a empresa (${companyPhone}): https://api.bixs.com.br/v1/api/message/messages/send`,
		companyPayload
	);
	try {
		messageResponse = await fetch(
			'https://api.bixs.com.br/v1/api/message/messages/send',
			{
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
					accept: 'application/json',
				},
				body: JSON.stringify(companyPayload),
			}
		);
	} catch (err) {
		console.error('4. [FALHA] Erro de rede ao enviar mensagem p/ empresa:', err);
		throw new Error('Falha de rede ao enviar mensagem para a empresa.');
	}

	if (!messageResponse.ok) {
		console.error(
			`4. [FALHA] Falha ao enviar mensagem para a empresa. Status HTTP: ${messageResponse.status}`
		);
		throw new Error(
			`Falha ao enviar mensagem para a empresa via WhatsApp. Status: ${messageResponse.status}`
		);
	}
	console.log('4. [SUCESSO] Mensagem para a empresa enviada com sucesso!');

	// 5. Enviar Mensagem para o Cliente
	const cleanClientPhone = data.contato.replace(/\D/g, '');
	const clientPhoneWithCountry = isDevEnvironment
		? devPhoneWithCountry
		: cleanClientPhone.startsWith('55')
			? cleanClientPhone
			: `55${cleanClientPhone}`;

	let clientMessageResponse;
	const clientPayload = {
		audio_url: '',
		document_url: mediaUrl,
		image_url: '',
		instance_id: activeInstanceId,
		message:
			'*Confirmação de Contrato – Empresa BIXs*\n\nA Empresa BIXs confirma o recebimento do contrato, juntamente com os dados do contratante e documentos apresentados, sendo estes cópias fiéis dos originais.',
		to: clientPhoneWithCountry,
		to_name: data.contratante,
		video_url: '',
	};
	
	console.log(
		`5. [TENTATIVA] Enviar mensagem para o cliente (${clientPhoneWithCountry}): https://api.bixs.com.br/v1/api/message/messages/send`,
		clientPayload
	);
	try {
		clientMessageResponse = await fetch(
			'https://api.bixs.com.br/v1/api/message/messages/send',
			{
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
					accept: 'application/json',
				},
				body: JSON.stringify(clientPayload),
			}
		);
	} catch (err) {
		console.error('5. [FALHA] Erro de rede ao enviar mensagem p/ cliente:', err);
		throw new Error('Falha de rede ao enviar mensagem para o cliente.');
	}

	if (!clientMessageResponse.ok) {
		console.error(
			`5. [FALHA] Falha ao enviar mensagem para o cliente. Status HTTP: ${clientMessageResponse.status}`
		);
		throw new Error(
			`Falha ao enviar mensagem para o cliente via WhatsApp. Status: ${clientMessageResponse.status}`
		);
	}
	console.log('5. [SUCESSO] Mensagem para o cliente enviada com sucesso!');
	console.log('--- CONTRATOS ENVIADOS COM SUCESSO ---');
};
