import React, { useEffect, useState, useRef } from 'react';

// =========================================================================
// CONFIGURAÇÃO RÁPIDA (Autenticação Automática)
// =========================================================================
// 1. Configure aqui a rota e os dados para obter o token automaticamente
const AUTH_URL = 'https://dev.bixs.com.br/v1/auth/login';
const AUTH_PAYLOAD = {
	email: 'pedrolucasmota2005@gmail.com',
	password: 'M6433vlks*',
	mac: 'docs',
	source: 'api_externa',
};

// 2. Mudando FORCE_NEW_INSTANCE para true, o código irá ignorar instâncias
//    existentes e criar uma nova toda vez (útil para mudar o qrcode rapidamente).
const FORCE_NEW_INSTANCE = false;

// 3. Nome usado para criar a nova instância (se necessário)
const INSTANCE_NAME = 'whatsapp-' + Math.floor(Math.random() * 1000);

// =========================================================================

const BASE_URL = 'https://dev.bixs.com.br/v1/api/message/instances';

const WhatsappConnect: React.FC = () => {
	const [qrCodeData, setQrCodeData] = useState<string | null>(null);
	const [status, setStatus] = useState<string>('Inicializando...');
	const [instanceId, setInstanceId] = useState<number | null>(null);
	const refreshCount = useRef(0);
	const timerRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		let active = true;

		const deleteInstance = async (token: string, id: number) => {
			try {
				setStatus(`Excluindo instância ${id} por inatividade...`);
				await fetch(`${BASE_URL}/${id}`, {
					method: 'DELETE',
					headers: {
						accept: 'application/json',
						Authorization: `Bearer ${token}`,
					},
				});
				if (active) {
					setStatus(`Instância ${id} excluída por limite de tempo.`);
					setInstanceId(null);
					setQrCodeData(null);
				}
			} catch (e) {
				console.error('Falha ao excluir instância', e);
			}
		};

		const loadQrCode = async (token: string, id: number) => {
			if (refreshCount.current >= 4) {
				// Depois de 4 tentativas (ou seja, 4 x 40s = 160s sem conectar), exclui a instância
				if (timerRef.current) clearInterval(timerRef.current);
				await deleteInstance(token, id);
				return;
			}

			try {
				setStatus(
					`Rotacionando QRCode (Tentativa ${refreshCount.current + 1}/4)...`,
				);
				const qrRes = await fetch(`${BASE_URL}/${id}/qrcode`, {
					headers: {
						accept: 'application/json',
						Authorization: `Bearer ${token}`,
					},
				});

				if (!qrRes.ok)
					throw new Error(
						'Falha ao obter dados do QRCode da instância',
					);

				const qrData = await qrRes.json();
				const rawCode =
					typeof qrData === 'string'
						? qrData
						: qrData.qrcode ||
							qrData.code ||
							qrData.base64 ||
							JSON.stringify(qrData);

				if (active) {
					setQrCodeData(rawCode);
					setStatus(
						`QRCode atualizado! Escaneie em até 40 segundos.`,
					);
					refreshCount.current += 1;
				}
			} catch (err: any) {
				console.error(err);
				if (active) setStatus(`Erro QRCode: ${err.message}`);
			}
		};

		const setupWhatsapp = async () => {
			try {
				// --- 0. Autenticação para pegar o Token ---
				setStatus('Autenticando...');
				const authRes = await fetch(AUTH_URL, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						accept: 'application/json',
					},
					body: JSON.stringify(AUTH_PAYLOAD),
				});

				if (!authRes.ok)
					throw new Error('Falha ao autenticar para pegar o token');
				const authData = await authRes.json();
				const token = authData.token || authData.access_token; // Adapte de acordo com sua API

				if (!token)
					throw new Error('Token não encontrado no retorno da API');

				const headers = {
					accept: 'application/json',
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				};

				let targetId: number | null = null;

				// --- 1. Buscar instâncias, se não formos forçar uma nova ---
				if (!FORCE_NEW_INSTANCE) {
					setStatus('Buscando instâncias existentes...');
					const res = await fetch(BASE_URL, { headers });
					if (!res.ok) throw new Error('Falha ao buscar instâncias');

					const data: any[] = await res.json();
					if (data && data.length > 0) {
						targetId = data[0].id;
						setStatus(
							`Instância existente encontrada (${targetId}).`,
						);
					}
				}

				// --- 2. Criar nova instância se não existir ---
				if (targetId === null) {
					setStatus('Criando nova instância...');
					const postRes = await fetch(BASE_URL, {
						method: 'POST',
						headers,
						body: JSON.stringify({ name: INSTANCE_NAME }),
					});

					if (!postRes.ok)
						throw new Error('Falha ao criar nova instância');
					const postData = await postRes.json();
					targetId = postData.id;
					setStatus(`Nova instância criada (${targetId}).`);
				}

				if (targetId === null)
					throw new Error('ID da instância não encontrado');
				if (active) setInstanceId(targetId);

				// --- 3. Carregar QRCode inicial e setar intervalo ---
				refreshCount.current = 0;
				await loadQrCode(token, targetId);

				timerRef.current = setInterval(() => {
					loadQrCode(token, targetId!);
				}, 40000); // Roda a cada 40 segundos
			} catch (err: any) {
				console.error(err);
				if (active) setStatus(`Erro: ${err.message}`);
			}
		};

		setupWhatsapp();

		return () => {
			active = false;
			if (timerRef.current) clearInterval(timerRef.current);
		};
	}, []);

	return (
		<div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
			<h1 className="text-2xl font-bold mb-4">Conectar WhatsApp</h1>

			<div className="bg-slate-100 p-4 rounded-lg shadow min-w-[300px] text-center mb-4">
				{instanceId && (
					<p className="text-xs text-slate-500 mb-2">
						Instância ID: {instanceId}
					</p>
				)}

				{qrCodeData ? (
					<div className="flex flex-col items-center">
						{/* Usando uma API aberta para renderizar o código texto em QRCode de imagem e não precisar instalar dependências */}
						<img
							src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrCodeData)}`}
							alt="QR Code"
							className="mb-4 w-[250px] h-[250px]"
						/>
						<p className="text-sm text-slate-600 px-4 mt-2 break-all max-w-sm">
							Escaneie o QRCode acima com o seu WhatsApp.
						</p>
					</div>
				) : (
					<div className="animate-pulse flex space-x-4 items-center justify-center h-[250px]">
						<div className="text-slate-400">Gerando...</div>
					</div>
				)}
			</div>

			<p className="text-slate-700">{status}</p>
		</div>
	);
};

export default WhatsappConnect;
