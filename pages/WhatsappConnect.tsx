import React, { useEffect, useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
	BIXS_API_ROUTES,
	getBixsAuthPayload,
} from '../features/contracts/constants/bixsApi';

const parseApiError = async (res: Response, fallback: string) => {
	try {
		const body = await res.json();
		return body.error || body.message || fallback;
	} catch {
		return `${fallback} (HTTP ${res.status})`;
	}
};

// Mudando FORCE_NEW_INSTANCE para true, ignora instâncias existentes e cria uma nova.
const FORCE_NEW_INSTANCE = false;
const INSTANCE_NAME = 'whatsapp-' + Math.floor(Math.random() * 1000);
const INSTANCES_URL = BIXS_API_ROUTES.instances;

const WhatsappConnect: React.FC = () => {
	const [token, setToken] = useState<string | null>(null);
	const [qrCodeData, setQrCodeData] = useState<string | null>(null);
	const [statusMsg, setStatusMsg] = useState<string>('Inicializando...');
	const [instanceId, setInstanceId] = useState<number | null>(null);
	const [connectionStatus, setConnectionStatus] = useState<string>('');
	const [isLoading, setIsLoading] = useState(false);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);

	const activeRef = useRef(true);

	const deleteInstance = async (authToken: string, id: number) => {
		try {
			setStatusMsg(`Excluindo instância ${id}...`);
			await fetch(`${INSTANCES_URL}/${id}`, {
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
			setIsLoading(true);
			// 1. Check Status
			const statusRes = await fetch(`${INSTANCES_URL}/${id}/status`, {
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

			const isConnected =
				currentStatus &&
				(currentStatus.toUpperCase() === 'OPEN' ||
					currentStatus.toUpperCase() === 'CONNECTED');

			// Se conectado, para a busca de qrcode
			if (isConnected) {
				setStatusMsg('Instância conectada!');
				setQrCodeData(null); // retira imagem de qrcode
				return;
			}

			// 2. Gerar QrCode
			setStatusMsg(`Gerando QRCode...`);
			const qrRes = await fetch(`${INSTANCES_URL}/${id}/qrcode`, {
				headers: {
					accept: 'application/json',
					Authorization: `Bearer ${authToken}`,
				},
			});

			if (!qrRes.ok) {
				throw new Error(
					await parseApiError(
						qrRes,
						'Falha ao obter dados do QRCode da instância',
					),
				);
			}

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
				setErrorMsg(null);
				setStatusMsg(`QRCode pronto! Escaneie com o seu WhatsApp.`);
			}
		} catch (err: unknown) {
			console.error(err);
			if (activeRef.current) {
				const message =
					err instanceof Error
						? err.message
						: 'Falha ao gerar QRCode';
				setErrorMsg(message);
				setQrCodeData(null);
				setStatusMsg(
					'Erro ao gerar QRCode. Tente atualizar ou criar nova instância.',
				);
			}
		} finally {
			setIsLoading(false);
		}
	};

	const setupWhatsapp = async (forceNew = false) => {
		setIsLoading(true);
		setErrorMsg(null);
		try {
			// --- 0. Autenticação para pegar o Token ---
			setStatusMsg('Autenticando...');
			const authRes = await fetch(BIXS_API_ROUTES.authLogin, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					accept: 'application/json',
				},
				body: JSON.stringify(getBixsAuthPayload()),
			});

			if (!authRes.ok) {
				throw new Error(
					await parseApiError(authRes, 'Falha ao autenticar'),
				);
			}
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
				const res = await fetch(INSTANCES_URL, { headers });
				if (!res.ok) {
					throw new Error(
						await parseApiError(res, 'Falha ao buscar instâncias'),
					);
				}

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
				const postRes = await fetch(INSTANCES_URL, {
					method: 'POST',
					headers,
					body: JSON.stringify({ name: instanceName }),
				});

				if (!postRes.ok) {
					throw new Error(
						await parseApiError(postRes, 'Falha ao criar instância'),
					);
				}
				const postData = await postRes.json();
				targetId = postData.id;
				setStatusMsg(`Nova instância criada (${targetId}).`);
			}

			if (targetId === null)
				throw new Error('ID da instância não encontrado');
			if (activeRef.current) setInstanceId(targetId);

			// --- 3. Carregar Status e QRCode inicial ---
			await checkStatusAndLoadQrCode(authToken, targetId);
		} catch (err: unknown) {
			console.error(err);
			if (activeRef.current) {
				const message =
					err instanceof Error ? err.message : 'Erro inesperado';
				setErrorMsg(message);
				setStatusMsg(`Erro: ${message}`);
			}
		} finally {
			if (activeRef.current) setIsLoading(false);
		}
	};

	useEffect(() => {
		activeRef.current = true;
		setupWhatsapp();
		return () => {
			activeRef.current = false;
		};
	}, []);

	const handleGenerateQrCode = () => {
		if (token && instanceId) {
			checkStatusAndLoadQrCode(token, instanceId);
		}
	};

	const handleForceNewInstance = async () => {
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
										connectionStatus === 'OPEN' ||
										connectionStatus.toUpperCase() ===
											'CONNECTED'
											? 'green'
											: '#d97706',
								}}
							>
								Status: {connectionStatus}
							</p>
						)}
					</div>
				)}

				{errorMsg ? (
					<div className="flex flex-col items-center justify-center h-[250px] w-[250px] bg-red-50 rounded-lg border border-red-200 mb-4 px-4">
						<p className="text-red-700 text-sm font-medium text-center">
							{errorMsg}
						</p>
					</div>
				) : qrCodeData &&
				  connectionStatus?.toUpperCase() !== 'OPEN' &&
				  connectionStatus?.toUpperCase() !== 'CONNECTED' ? (
					<div className="flex flex-col items-center">
						<div className="mb-4 border p-2 bg-white rounded-lg shadow-sm">
							<QRCodeSVG value={qrCodeData} size={250} />
						</div>
						<p className="text-sm text-slate-600 px-4 mt-2 break-all max-w-sm">
							Escaneie o QRCode acima com o seu WhatsApp.
						</p>
					</div>
				) : connectionStatus?.toUpperCase() === 'OPEN' ||
				  connectionStatus?.toUpperCase() === 'CONNECTED' ? (
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

			<div className="flex gap-4">
				{connectionStatus?.toUpperCase() !== 'OPEN' &&
					connectionStatus?.toUpperCase() !== 'CONNECTED' && (
						<>
							<button
								onClick={handleGenerateQrCode}
								disabled={isLoading || !instanceId}
								className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{isLoading
									? 'Processando...'
									: 'Gerar/Atualizar QRCode'}
							</button>

							<button
								onClick={handleForceNewInstance}
								disabled={isLoading}
								className="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-lg shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{isLoading
									? 'Processando...'
									: 'Criar Nova Instância'}
							</button>
						</>
					)}
			</div>
		</div>
	);
};

export default WhatsappConnect;
