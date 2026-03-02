import React, { useState, useRef } from 'react';
import { pdf } from '@react-pdf/renderer';
import SignatureCanvas from 'react-signature-canvas';
import ContractDocument from '../components/ContractDocument';
import {
	FileDown,
	CheckCircle,
	AlertCircle,
	FileText,
	Loader2,
	Camera,
	Upload,
	Trash2,
	RotateCcw,
	ChevronDown,
	Search,
} from 'lucide-react';

const SEGMENTOS = [
	'Evento',
	'Bar',
	'Restaurante',
	'Loja',
	'Hortifruti',
	'Conveniência',
];
const MAQUINAS = Array.from({ length: 31 }, (_, i) => i.toString());
const LICENCAS = Array.from({ length: 21 }, (_, i) => (i + 1).toString());

interface SearchableSelectProps {
	label: string;
	name: string;
	value: string;
	options: string[];
	placeholder: string;
	onChange: (name: string, value: string) => void;
	required?: boolean;
	error?: string;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
	label,
	name,
	value,
	options,
	placeholder,
	onChange,
	required,
	error,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const containerRef = useRef<HTMLDivElement>(null);

	const filteredOptions = options.filter((opt) =>
		opt.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	const handleSelect = (opt: string) => {
		onChange(name, opt);
		setSearchTerm('');
		setIsOpen(false);
	};

	// Fechar ao clicar fora
	React.useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () =>
			document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	return (
		<div className="relative space-y-2" ref={containerRef}>
			<label className="block text-sm font-semibold text-slate-700">
				{label}
			</label>
			<div className="relative">
				<input
					type="text"
					value={isOpen ? searchTerm : value}
					onChange={(e) => {
						if (!isOpen) setIsOpen(true);
						setSearchTerm(e.target.value);
						onChange(name, e.target.value);
					}}
					onFocus={() => setIsOpen(true)}
					placeholder={placeholder}
					className={`w-full px-4 py-3 rounded-xl border transition-all outline-none text-slate-700 placeholder:text-slate-400 pr-10 ${
						error
							? 'border-red-500 bg-red-50 focus:ring-red-500/10'
							: 'border-slate-200 bg-slate-50 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10'
					}`}
					required={required}
				/>
				<div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
					{isOpen ? <Search size={18} /> : <ChevronDown size={18} />}
				</div>
			</div>

			{isOpen && filteredOptions.length > 0 && (
				<div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-2xl max-h-60 overflow-auto animate-in fade-in zoom-in-95 duration-200">
					{filteredOptions.map((opt) => (
						<button
							key={opt}
							type="button"
							onClick={() => handleSelect(opt)}
							className="w-full px-4 py-3 text-left text-slate-700 hover:bg-primary-50 hover:text-primary-700 transition-colors border-b border-slate-50 last:border-0"
						>
							{opt}
						</button>
					))}
				</div>
			)}

			{error && (
				<p className="text-xs font-medium text-red-500 mt-1 animate-in fade-in slide-in-from-top-1">
					{error}
				</p>
			)}
		</div>
	);
};

interface FormData {
	contratante: string;
	cpfCnpj: string;
	endereco: string;
	contato: string;
	email: string;
	responsavel: string;
	cpfResponsavel: string;
	segmento: string;
	dataInicio?: string;
	dataFim?: string;
	qtdeMaquinas?: string;
	qtdeLicencas?: string;
}

const Contracts: React.FC = () => {
	const [formData, setFormData] = useState<FormData>({
		contratante: '',
		cpfCnpj: '',
		endereco: '',
		contato: '',
		email: '',
		responsavel: '',
		cpfResponsavel: '',
		segmento: '',
	});

	const [isGenerating, setIsGenerating] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [pdfUrl, setPdfUrl] = useState<string | null>(null);

	// Novos estados para anexos e assinatura
	const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
	const [attachedDocument, setAttachedDocument] = useState<string | null>(
		null,
	);
	const [isCameraOpen, setIsCameraOpen] = useState(false);
	const [cameraError, setCameraError] = useState<string | null>(null);
	const [docCaptureMode, setDocCaptureMode] = useState<'upload' | 'camera'>(
		'upload',
	);
	const [errors, setErrors] = useState<Record<string, string>>({});

	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const sigCanvasRef = useRef<SignatureCanvas>(null);

	// Funções auxiliares de máscara
	const formatCpfCnpj = (value: string) => {
		const cleanValue = value.replace(/\D/g, '');

		if (cleanValue.length <= 11) {
			// CPF: 000.000.000-00
			return cleanValue
				.replace(/(\d{3})(\d)/, '$1.$2')
				.replace(/(\d{3})(\d)/, '$1.$2')
				.replace(/(\d{3})(\d{1,2})/, '$1-$2')
				.replace(/(-\d{2})\d+?$/, '$1');
		} else {
			// CNPJ: 00.000.000/0000-00
			return cleanValue
				.replace(/(\d{2})(\d)/, '$1.$2')
				.replace(/(\d{3})(\d)/, '$1.$2')
				.replace(/(\d{3})(\d)/, '$1/$2')
				.replace(/(\d{4})(\d)/, '$1-$2')
				.replace(/(-\d{2})\d+?$/, '$1');
		}
	};

	const formatPhone = (value: string) => {
		const cleanValue = value.replace(/\D/g, '');
		// Remove formatação anterior para recalcular
		if (cleanValue.length <= 10) {
			// Fixo: (XX) XXXX-XXXX
			return cleanValue
				.replace(/(\d{2})(\d)/, '($1) $2')
				.replace(/(\d{4})(\d)/, '$1-$2')
				.replace(/(-\d{4})\d+?$/, '$1');
		} else {
			// Celular: (XX) XXXXX-XXXX
			return cleanValue
				.replace(/(\d{2})(\d)/, '($1) $2')
				.replace(/(\d{5})(\d)/, '$1-$2')
				.replace(/(-\d{4})\d+?$/, '$1');
		}
	};

	const formatCpf = (value: string) => {
		const cleanValue = value.replace(/\D/g, '');
		// CPF: 000.000.000-00
		return cleanValue
			.replace(/(\d{3})(\d)/, '$1.$2')
			.replace(/(\d{3})(\d)/, '$1.$2')
			.replace(/(\d{3})(\d{1,2})/, '$1-$2')
			.replace(/(-\d{2})\d+?$/, '$1');
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target;
		handleValueChange(name, value);
	};

	const handleValueChange = (name: string, value: string) => {
		let formattedValue = value;

		// Aplicar máscaras baseadas no nome do campo
		if (name === 'cpfCnpj') {
			formattedValue = formatCpfCnpj(value);
		} else if (name === 'contato') {
			formattedValue = formatPhone(value);
		} else if (name === 'cpfResponsavel') {
			formattedValue = formatCpf(value);
		}

		setFormData((prev) => ({ ...prev, [name]: formattedValue }));

		// Validação em tempo real para campos específicos
		if (name === 'segmento') {
			if (value && !SEGMENTOS.includes(value)) {
				setErrors((prev) => ({
					...prev,
					segmento: 'Por favor, selecione uma opção válida da lista.',
				}));
			} else {
				setErrors((prev) => {
					const newErrors = { ...prev };
					delete newErrors.segmento;
					return newErrors;
				});
			}
		}

		if (name === 'qtdeMaquinas') {
			if (value && !MAQUINAS.includes(value)) {
				setErrors((prev) => ({
					...prev,
					qtdeMaquinas:
						'Por favor, selecione uma quantidade válida (0-30).',
				}));
			} else {
				setErrors((prev) => {
					const newErrors = { ...prev };
					delete newErrors.qtdeMaquinas;
					return newErrors;
				});
			}
		}

		if (name === 'qtdeLicencas') {
			if (value && !LICENCAS.includes(value)) {
				setErrors((prev) => ({
					...prev,
					qtdeLicencas:
						'Por favor, selecione uma quantidade válida (1-20).',
				}));
			} else {
				setErrors((prev) => {
					const newErrors = { ...prev };
					delete newErrors.qtdeLicencas;
					return newErrors;
				});
			}
		}

		// Se o usuário mudar algo, invalida o PDF anterior para forçar nova geração
		if (pdfUrl) {
			URL.revokeObjectURL(pdfUrl);
			setPdfUrl(null);
		}
	};

	// Lógica da Câmera
	const startCamera = async (target: 'doc' | 'face') => {
		setIsCameraOpen(true);
		setCameraError(null);
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: {
					facingMode: target === 'doc' ? 'environment' : 'user',
				},
			});
			if (videoRef.current) {
				videoRef.current.srcObject = stream;
			}
		} catch (err) {
			console.error('Erro ao acessar câmera:', err);
			setCameraError(
				'Não foi possível acessar a câmera. Verifique as permissões.',
			);
		}
	};

	const stopCamera = () => {
		if (videoRef.current && videoRef.current.srcObject) {
			const tracks = (
				videoRef.current.srcObject as MediaStream
			).getTracks();
			tracks.forEach((track) => track.stop());
			videoRef.current.srcObject = null;
		}
		setIsCameraOpen(false);
	};

	const takePhoto = (target: 'doc' | 'face') => {
		if (videoRef.current && canvasRef.current) {
			const video = videoRef.current;
			const canvas = canvasRef.current;
			canvas.width = video.videoWidth;
			canvas.height = video.videoHeight;
			const ctx = canvas.getContext('2d');
			if (ctx) {
				ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
				const dataUrl = canvas.toDataURL('image/jpeg');
				if (target === 'doc') {
					setAttachedDocument(dataUrl);
				} else {
					setCapturedPhoto(dataUrl);
				}
				stopCamera();
			}
		}
	};

	// Lógica de Anexo de Documento
	const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			const reader = new FileReader();
			reader.onloadend = () => {
				setAttachedDocument(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Verificar se há erros de validação
		if (Object.keys(errors).length > 0) {
			alert(
				'Por favor, corrija os erros no formulário antes de prosseguir.',
			);
			return;
		}

		if (!sigCanvasRef.current || sigCanvasRef.current.isEmpty()) {
			alert(
				'Por favor, desenhe sua assinatura antes de gerar o contrato.',
			);
			return;
		}

		setIsGenerating(true);

		try {
			const signatureDataUrl =
				sigCanvasRef.current.toDataURL('image/png');

			// Gera o blob do PDF manualmente com todos os dados
			const blob = await pdf(
				<ContractDocument
					data={{
						...formData,
						signature: signatureDataUrl,
						attachedDocument: attachedDocument || undefined,
						capturedPhoto: capturedPhoto || undefined,
					}}
				/>,
			).toBlob();
			const url = URL.createObjectURL(blob);
			setPdfUrl(url);

			// Enviar para a API externa
			const formDataToSend = new FormData();
			formDataToSend.append('clientName', formData.contratante);
			formDataToSend.append('email', formData.email);
			formDataToSend.append(
				'pdf',
				blob,
				`Contrato_${formData.contratante.replace(/\s+/g, '_')}.pdf`,
			);

			try {
				const response = await fetch(
					'http://localhost:3001/api/send-contract',
					{
						method: 'POST',
						body: formDataToSend,
					},
				);

				if (!response.ok) {
					console.error('Erro ao enviar contrato para API');
					alert(
						'O PDF foi gerado com sucesso, mas houve uma falha ao enviá-lo por e-mail/WhatsApp. Salve-o manualmente.',
					);
				} else {
					const result = await response.json();
					console.log('API Response:', result);
				}
			} catch (apiError) {
				console.error('Erro de conexão com a API:', apiError);
				alert(
					'O PDF foi gerado, mas o servidor de envio (API) não foi encontrado.',
				);
			}

			setIsSubmitted(true);
		} catch (error) {
			console.error('Erro ao gerar PDF:', error);
			alert('Ocorreu um erro ao gerar o PDF. Tente novamente.');
		} finally {
			setIsGenerating(false);
		}
	};

	const inputClasses =
		'w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none text-slate-700 placeholder:text-slate-400';
	const labelClasses = 'block text-sm font-semibold text-slate-700 mb-2';

	return (
		<div className="min-h-screen bg-slate-50 pt-28 pb-20">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="max-w-4xl mx-auto">
					<div className="text-center mb-12">
						<div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-100 text-primary-600 mb-6 shadow-inner">
							<FileText size={32} />
						</div>
						<h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
							Geração de Contrato
						</h1>
						<p className="text-slate-500 text-lg max-w-2xl mx-auto">
							Preencha os dados, anexe seus documentos e assine
							para gerar seu contrato completo.
						</p>
					</div>

					<div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
						<div className="p-8 md:p-10">
							<form
								onSubmit={handleSubmit}
								className="space-y-10"
							>
								{/* Seção Empresa */}
								<div>
									<h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-6 flex items-center gap-2">
										<span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 text-xs flex items-center justify-center">
											1
										</span>
										Dados da Empresa
									</h3>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div className="md:col-span-2">
											<label className={labelClasses}>
												Nome da Contratante (Razão
												Social)
											</label>
											<input
												type="text"
												name="contratante"
												value={formData.contratante}
												onChange={handleChange}
												className={inputClasses}
												placeholder="Razão Social ou Nome Completo"
												required
											/>
										</div>
										<div>
											<label className={labelClasses}>
												CPF / CNPJ
											</label>
											<input
												type="text"
												name="cpfCnpj"
												value={formData.cpfCnpj}
												onChange={handleChange}
												className={inputClasses}
												placeholder="00.000.000/0001-00"
												maxLength={18}
												required
											/>
										</div>
										<div>
											<label className={labelClasses}>
												Endereço Completo
											</label>
											<input
												type="text"
												name="endereco"
												value={formData.endereco}
												onChange={handleChange}
												className={inputClasses}
												placeholder="Rua, Número, Bairro, Cidade - UF"
												required
											/>
										</div>
										<div>
											<label className={labelClasses}>
												Contato (Telefone)
											</label>
											<input
												type="text"
												name="contato"
												value={formData.contato}
												onChange={handleChange}
												className={inputClasses}
												placeholder="(00) 0 0000-0000"
												maxLength={15}
												required
											/>
										</div>
										<div>
											<label className={labelClasses}>
												E-mail
											</label>
											<input
												type="email"
												name="email"
												value={formData.email}
												onChange={handleChange}
												className={inputClasses}
												placeholder="contato@empresa.com"
												required
											/>
										</div>
									</div>
								</div>

								{/* Seção Negócio */}
								<div>
									<h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-6 flex items-center gap-2">
										<span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 text-xs flex items-center justify-center">
											2
										</span>
										Dados do Negócio
									</h3>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div className="md:col-span-2">
											<SearchableSelect
												label="Segmento de Negócio"
												name="segmento"
												value={formData.segmento}
												options={SEGMENTOS}
												placeholder="Selecione ou digite o segmento"
												onChange={handleValueChange}
												required
												error={errors.segmento}
											/>
										</div>

										{formData.segmento === 'Evento' && (
											<>
												<div>
													<label
														className={labelClasses}
													>
														Data de Início
													</label>
													<input
														type="date"
														name="dataInicio"
														value={
															formData.dataInicio ||
															''
														}
														onChange={handleChange}
														className={inputClasses}
														required
													/>
												</div>
												<div>
													<label
														className={labelClasses}
													>
														Data de Fim
													</label>
													<input
														type="date"
														name="dataFim"
														value={
															formData.dataFim ||
															''
														}
														onChange={handleChange}
														className={inputClasses}
														required
													/>
												</div>
												<div>
													<SearchableSelect
														label="Quantidade de Máquinas"
														name="qtdeMaquinas"
														value={
															formData.qtdeMaquinas ||
															''
														}
														options={MAQUINAS}
														placeholder="Selecione ou digite a quantidade"
														onChange={
															handleValueChange
														}
														required
														error={
															errors.qtdeMaquinas
														}
													/>
												</div>
											</>
										)}

										{formData.segmento &&
											formData.segmento !== 'Evento' && (
												<div>
													<SearchableSelect
														label="Quantidade de Licenças"
														name="qtdeLicencas"
														value={
															formData.qtdeLicencas ||
															''
														}
														options={LICENCAS}
														placeholder="Selecione ou digite a quantidade"
														onChange={
															handleValueChange
														}
														required
														error={
															errors.qtdeLicencas
														}
													/>
												</div>
											)}
									</div>
								</div>

								{/* Seção Responsável */}
								<div>
									<h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-6 flex items-center gap-2">
										<span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 text-xs flex items-center justify-center">
											3
										</span>
										Dados do Responsável
									</h3>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div>
											<label className={labelClasses}>
												Nome do Responsável
											</label>
											<input
												type="text"
												name="responsavel"
												value={formData.responsavel}
												onChange={handleChange}
												className={inputClasses}
												placeholder="Nome Completo"
												required
											/>
										</div>
										<div>
											<label className={labelClasses}>
												CPF do Responsável
											</label>
											<input
												type="text"
												name="cpfResponsavel"
												value={formData.cpfResponsavel}
												onChange={handleChange}
												className={inputClasses}
												placeholder="000.000.000-00"
												maxLength={14}
												required
											/>
										</div>
									</div>
								</div>

								{/* Seção 4: Anexos (Documento e Foto) */}
								<div>
									<h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-6 flex items-center gap-2">
										<span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 text-xs flex items-center justify-center">
											4
										</span>
										Anexos Obrigatórios
									</h3>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
										{/* Anexar Documento */}
										<div className="space-y-0">
											<div className="flex items-center justify-between h-10 mb-3">
												<label className="block text-sm font-semibold text-slate-700">
													Anexar Documento (RG/CNH)
												</label>
												{!attachedDocument &&
													!isCameraOpen && (
														<div className="flex bg-slate-100 p-1 rounded-lg">
															<button
																type="button"
																onClick={() =>
																	setDocCaptureMode(
																		'upload',
																	)
																}
																className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${docCaptureMode === 'upload' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
															>
																Upload
															</button>
															<button
																type="button"
																onClick={() =>
																	setDocCaptureMode(
																		'camera',
																	)
																}
																className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${docCaptureMode === 'camera' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
															>
																Câmera
															</button>
														</div>
													)}
											</div>
											<div
												className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl transition-all ${attachedDocument ? 'border-green-400 bg-green-50' : 'border-slate-200 bg-slate-50 hover:border-primary-400 hover:bg-white'}`}
											>
												{attachedDocument ? (
													<div className="relative w-full h-full p-2">
														<img
															src={
																attachedDocument
															}
															alt="Documento"
															className="w-full h-full object-contain rounded-lg"
														/>
														<button
															type="button"
															onClick={() =>
																setAttachedDocument(
																	null,
																)
															}
															className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
														>
															<Trash2 size={16} />
														</button>
													</div>
												) : isCameraOpen &&
												  docCaptureMode ===
														'camera' ? (
													<div className="relative w-full h-full overflow-hidden rounded-2xl">
														<video
															ref={videoRef}
															autoPlay
															playsInline
															className="w-full h-full object-cover"
														/>
														<div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
															<button
																type="button"
																onClick={() =>
																	takePhoto(
																		'doc',
																	)
																}
																className="p-3 bg-primary-600 text-white rounded-full shadow-xl hover:bg-primary-700"
															>
																<Camera
																	size={24}
																/>
															</button>
															<button
																type="button"
																onClick={
																	stopCamera
																}
																className="p-3 bg-slate-800 text-white rounded-full shadow-xl hover:bg-slate-900"
															>
																<RotateCcw
																	size={24}
																/>
															</button>
														</div>
													</div>
												) : docCaptureMode ===
												  'camera' ? (
													<button
														type="button"
														onClick={() =>
															startCamera('doc')
														}
														className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
													>
														<Camera className="w-10 h-10 text-slate-400 mb-2" />
														<span className="text-sm text-slate-500 font-medium">
															Clique para abrir a
															câmera
														</span>
													</button>
												) : (
													<label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
														<Upload className="w-10 h-10 text-slate-400 mb-2" />
														<span className="text-sm text-slate-500 font-medium">
															Clique para anexar
															foto do documento
														</span>
														<input
															type="file"
															accept="image/*"
															onChange={
																handleDocumentUpload
															}
															className="hidden"
														/>
													</label>
												)}
											</div>
										</div>

										{/* Tirar Foto */}
										<div className="space-y-0">
											<div className="flex items-center h-10 mb-3">
												<label className="block text-sm font-semibold text-slate-700">
													Tirar Foto do Rosto
												</label>
											</div>
											<div
												className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl transition-all ${capturedPhoto ? 'border-green-400 bg-green-50' : 'border-slate-200 bg-slate-50 hover:border-primary-400 hover:bg-white'}`}
											>
												{capturedPhoto ? (
													<div className="relative w-full h-full p-2">
														<img
															src={capturedPhoto}
															alt="Foto"
															className="w-full h-full object-contain rounded-lg"
														/>
														<button
															type="button"
															onClick={() =>
																setCapturedPhoto(
																	null,
																)
															}
															className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
														>
															<Trash2 size={16} />
														</button>
													</div>
												) : isCameraOpen &&
												  docCaptureMode !==
														'camera' ? (
													<div className="relative w-full h-full overflow-hidden rounded-2xl">
														<video
															ref={videoRef}
															autoPlay
															playsInline
															className="w-full h-full object-cover"
														/>
														<div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
															<button
																type="button"
																onClick={() =>
																	takePhoto(
																		'face',
																	)
																}
																className="p-3 bg-primary-600 text-white rounded-full shadow-xl hover:bg-primary-700"
															>
																<Camera
																	size={24}
																/>
															</button>
															<button
																type="button"
																onClick={
																	stopCamera
																}
																className="p-3 bg-slate-800 text-white rounded-full shadow-xl hover:bg-slate-900"
															>
																<RotateCcw
																	size={24}
																/>
															</button>
														</div>
													</div>
												) : (
													<button
														type="button"
														onClick={() =>
															startCamera('face')
														}
														className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
													>
														<Camera className="w-10 h-10 text-slate-400 mb-2" />
														<span className="text-sm text-slate-500 font-medium">
															Clique para abrir a
															câmera
														</span>
													</button>
												)}
												{cameraError && (
													<p className="text-xs text-red-500 mt-2 px-4 text-center">
														{cameraError}
													</p>
												)}
											</div>
										</div>
									</div>
								</div>

								{/* Seção 5: Assinatura Digital */}
								<div>
									<h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-6 flex items-center gap-2">
										<span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 text-xs flex items-center justify-center">
											5
										</span>
										Assinatura Digital
									</h3>
									<div className="space-y-4">
										<p className="text-sm text-slate-500">
											Utilize o mouse ou o dedo para
											desenhar sua assinatura no quadro
											abaixo:
										</p>
										<div className="border-2 border-slate-200 rounded-2xl bg-slate-50 overflow-hidden">
											<SignatureCanvas
												ref={sigCanvasRef}
												penColor="black"
												canvasProps={{
													className:
														'w-full h-48 cursor-crosshair',
												}}
											/>
										</div>
										<button
											type="button"
											onClick={() =>
												sigCanvasRef.current?.clear()
											}
											className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
										>
											<RotateCcw size={14} />
											Limpar Assinatura
										</button>
									</div>
								</div>

								{/* Ações Finais */}
								<div className="pt-8 border-t border-slate-100">
									{!pdfUrl ? (
										<button
											type="submit"
											disabled={isGenerating}
											className={`w-full md:w-auto px-10 py-4 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg ${
												isGenerating
													? 'bg-slate-400 cursor-not-allowed'
													: 'bg-primary-600 hover:bg-primary-700 active:scale-95 shadow-primary-500/25'
											}`}
										>
											{isGenerating ? (
												<>
													<Loader2
														size={20}
														className="animate-spin"
													/>
													Gerando Contrato Completo...
												</>
											) : (
												<>
													<CheckCircle size={20} />
													Gerar Contrato Completo
												</>
											)}
										</button>
									) : (
										<div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
											{isSubmitted && (
												<div className="p-6 bg-green-50 rounded-2xl border border-green-200 text-center">
													<div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
														<CheckCircle
															size={24}
														/>
													</div>
													<h4 className="text-lg font-bold text-green-900 mb-1">
														Contrato enviado com
														sucesso!
													</h4>
													<p className="text-green-700">
														Nossa equipe recebeu seu
														contrato e em breve
														entrará em contato com
														você.
													</p>
												</div>
											)}
											<div className="flex flex-col md:flex-row gap-4">
												<a
													href={pdfUrl}
													download={`Contrato_BIXS_${formData.contratante.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`}
													className="flex-1 px-8 py-4 rounded-xl bg-green-600 text-white font-bold text-lg hover:bg-green-700 active:scale-95 transition-all shadow-lg shadow-green-500/25 flex items-center justify-center gap-2"
												>
													<FileDown size={20} />
													Baixar Contrato Completo
													(PDF)
												</a>
												<button
													type="button"
													onClick={() => {
														URL.revokeObjectURL(
															pdfUrl,
														);
														setPdfUrl(null);
														setIsSubmitted(false);
														setCapturedPhoto(null);
														setAttachedDocument(
															null,
														);
														sigCanvasRef.current?.clear();
													}}
													className="px-8 py-4 rounded-xl bg-slate-100 text-slate-600 font-semibold hover:bg-slate-200 transition-colors"
												>
													Gerar Novo
												</button>
											</div>
										</div>
									)}
								</div>
							</form>
						</div>

						<div className="bg-slate-50 p-6 md:p-8 border-t border-slate-100">
							<div className="flex items-start gap-4">
								<AlertCircle className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
								<div>
									<h4 className="font-bold text-slate-900 mb-1">
										Informações Importantes
									</h4>
									<p className="text-sm text-slate-500 leading-relaxed">
										O contrato gerado incluirá seus dados,
										sua assinatura desenhada e os anexos
										(documento e foto) em um único arquivo
										PDF. Certifique-se de que as imagens
										estejam nítidas.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* Canvas oculto para captura de foto */}
			<canvas ref={canvasRef} className="hidden" />
		</div>
	);
};

export default Contracts;
