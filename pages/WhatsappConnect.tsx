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
	const [token, setToken] = useState<string | null>(null);
	const [qrCodeData, setQrCodeData] = useState<string | null>(null);
	const [statusMsg, setStatusMsg] = useState<string>('Inicializando...');
	const [instanceId, setInstanceId] = useState<number | null>(null);
	const [connectionStatus, setConnectionStatus] = useState<string>('');
	const [isLoading, setIsLoading] = useState(false);

	const refreshCount = useRef(0);
	const timerRef = useRef<NodeJS.Timeout | null>(null);
	const activeRef = useRef(true);

	const deleteInstance = async (authToken: string, id: number) => {
		try {
			setStatusMsg(`Excluindo instância ${id}...`);
			await fetch(`${BASE_URL}/${id}`, {
				method: 'DELETE',
				headers: {
					accept: 'application/json',
					Authorization: `Bearer ${authToken}`,
				},
			});
			if (activeRef.current && instanceId === id) {
				setInstanceId(null);
				setQrCodeData(null);
				setConnectionStatus('');
			}
		} catch (e) {
			console.error('Falha ao excluir instância', e);
		}
	};

	const checkStatusAndLoadQrCode = async (authToken: string, id: number) => {
		if (!activeRef.current) return;

		try {
			// 1. Check Status
			const statusRes = await fetch(`${BASE_URL}/${id}/status`, {
				headers: {
					accept: 'application/json',
					Authorization: `Bearer ${authToken}`,
				},
			});

			let currentStatus = '';
			if (statusRes.ok) {
				const statusData = await statusRes.json();
				currentStatus = statusData.status || '';
				if (activeRef.current) setConnectionStatus(currentStatus);
			}

			// Se conectado, para a busca de qrcode
			if (currentStatus && currentStatus.toUpperCase() === 'OPEN') {
				setStatusMsg('Instância conectada!');
				setQrCodeData(null); // retira imagem de qrcode
				if (timerRef.current) clearInterval(timerRef.current);
				return;
			}

			// 2. Timeout/Apagar por inatividade
			if (refreshCount.current >= 4) {
				setStatusMsg(
					'Limite de tempo excedido. A instância será excluída (160s sem conectar).',
				);
				if (timerRef.current) clearInterval(timerRef.current);
				await deleteInstance(authToken, id);
				return;
			}

			// 3. Gerar QrCode
			setStatusMsg(
				`Rotacionando QRCode (Tentativa ${refreshCount.current + 1}/4)...`,
			);
			const qrRes = await fetch(`${BASE_URL}/${id}/qrcode`, {
				headers: {
					accept: 'application/json',
					Authorization: `Bearer ${authToken}`,
				},
			});

			if (!qrRes.ok)
				throw new Error('Falha ao obter dados do QRCode da instância');

			const qrData = await qrRes.json();
			const rawCode =
				typeof qrData === 'string'
					? qrData
					: qrData.qrcode ||
						qrData.code ||
						qrData.base64 ||
						JSON.stringify(qrData);

			if (activeRef.current) {
				setQrCodeData(rawCode);
				setStatusMsg(`QRCode atualizado! Escaneie em até 40 segundos.`);
				refreshCount.current += 1;
			}
		} catch (err: any) {
			console.error(err);
			if (activeRef.current) setStatusMsg(`Erro QRCode: ${err.message}`);
		}
	};

	const setupWhatsapp = async (forceNew = false) => {
		setIsLoading(true);
		try {
			// --- 0. Autenticação para pegar o Token ---
			setStatusMsg('Autenticando...');
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
			const authToken = authData.token || authData.access_token;

			if (!authToken)
				throw new Error('Token não encontrado no retorno da API');
			if (activeRef.current) setToken(authToken);

			const headers = {
				accept: 'application/json',
				Authorization: `Bearer ${authToken}`,
				'Content-Type': 'application/json',
			};

			let targetId: number | null = null;

			// --- 1. Buscar instâncias, se não formos forçar uma nova ---
			if (!forceNew && !FORCE_NEW_INSTANCE) {
				setStatusMsg('Buscando instâncias existentes...');
				const res = await fetch(BASE_URL, { headers });
				if (!res.ok) throw new Error('Falha ao buscar instâncias');

				const data: any[] = await res.json();
				if (data && data.length > 0) {
					targetId = data[0].id;
					setStatusMsg(
						`Instância existente encontrada (${targetId}).`,
					);
				}
			}

			// --- 2. Criar nova instância se não existir ou se for forçada ---
			if (targetId === null) {
				setStatusMsg('Criando nova instância...');
				const instanceName =
					INSTANCE_NAME + '-' + Math.floor(Math.random() * 10000);
				const postRes = await fetch(BASE_URL, {
					method: 'POST',
					headers,
					body: JSON.stringify({ name: instanceName }),
				});

				if (!postRes.ok)
					throw new Error('Falha ao criar nova instância');
				const postData = await postRes.json();
				targetId = postData.id;
				setStatusMsg(`Nova instância criada (${targetId}).`);
			}

			if (targetId === null)
				throw new Error('ID da instância não encontrado');
			if (activeRef.current) setInstanceId(targetId);

			// --- 3. Carregar Status e QRCode inicial e setar intervalo ---
			refreshCount.current = 0;
			if (timerRef.current) clearInterval(timerRef.current);

			await checkStatusAndLoadQrCode(authToken, targetId);

			timerRef.current = setInterval(() => {
				checkStatusAndLoadQrCode(authToken, targetId!);
			}, 40000); // Roda a cada 40 segundos
		} catch (err: any) {
			console.error(err);
			if (activeRef.current) setStatusMsg(`Erro: ${err.message}`);
		} finally {
			if (activeRef.current) setIsLoading(false);
		}
	};

	useEffect(() => {
		activeRef.current = true;
		setupWhatsapp();
		return () => {
			activeRef.current = false;
			if (timerRef.current) clearInterval(timerRef.current);
		};
	}, []);

	const handleForceNewInstance = async () => {
		if (timerRef.current) clearInterval(timerRef.current);
		if (token && instanceId) {
			await deleteInstance(token, instanceId);
		}
		setupWhatsapp(true); // Força com uma nova flag local
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
			<h1 className="text-2xl font-bold mb-4">Conectar WhatsApp</h1>

			<div className="bg-slate-100 p-6 rounded-xl shadow min-w-[300px] text-center mb-4 flex flex-col items-center">
				{instanceId && (
					<div className="mb-4">
						<p className="text-xs text-slate-500 font-mono">
							Instância ID: {instanceId}
						</p>
						{connectionStatus && (
							<p
								className="text-sm font-bold mt-1 uppercase"
								style={{
									color:
										connectionStatus === 'OPEN'
											? 'green'
											: '#d97706',
								}}
							>
								Status: {connectionStatus}
							</p>
						)}
					</div>
				)}

				{qrCodeData && connectionStatus?.toUpperCase() !== 'OPEN' ? (
					<div className="flex flex-col items-center">
						<img
							src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrCodeData)}`}
							alt="QR Code"
							className="mb-4 w-[250px] h-[250px] border p-2 bg-white rounded-lg shadow-sm"
						/>
						<p className="text-sm text-slate-600 px-4 mt-2 break-all max-w-sm">
							Escaneie o QRCode acima com o seu WhatsApp.
						</p>
					</div>
				) : connectionStatus?.toUpperCase() === 'OPEN' ? (
					<div className="flex flex-col items-center justify-center h-[250px] w-[250px] bg-green-50 rounded-lg border border-green-200 mb-4">
						<svg
							className="w-16 h-16 text-green-500 mb-2"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M5 13l4 4L19 7"
							></path>
						</svg>
						<p className="text-green-700 font-medium">
							WhatsApp Conectado!
						</p>
					</div>
				) : (
					<div className="animate-pulse flex flex-col items-center justify-center h-[250px] w-[250px] bg-slate-50 rounded-lg mb-4">
						<div className="text-slate-400 font-medium">
							Carregando...
						</div>
					</div>
				)}
			</div>

			<p className="text-slate-600 font-medium mb-6 text-sm h-6">
				{statusMsg}
			</p>

			<button
				onClick={handleForceNewInstance}
				disabled={isLoading}
				className="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-lg shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{isLoading ? 'Processando...' : 'Criar Nova Instância'}
			</button>
		</div>
	);
};

export default WhatsappConnect;
