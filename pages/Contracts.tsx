import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
	Maximize,
	Minimize,
	Smartphone,
	Check,
} from 'lucide-react';

const SEGMENTOS = ['Evento', 'Bar', 'Restaurante', 'Loja', 'Hortifruti', 'Conveniência'];
const MAQUINAS = Array.from({ length: 30 }, (_, i) => (i + 1).toString());
const LICENCAS = Array.from({ length: 99 }, (_, i) => (i + 1).toString());

const VALID_COUPONS: Record<string, { type: string; discount?: number; adesao?: number; mensalidade?: number; description: string }> = {
	'ADE30%W': { type: 'adesao', discount: 0.3, description: '30% de desconto na adesão' },
	'ADE50Y': { type: 'adesao', discount: 0.5, description: '50% de desconto na adesão' },
	'ADE70JZ': { type: 'adesao', discount: 0.7, description: '70% de desconto na adesão' },
	'MEN2B': { type: 'custom', adesao: 50, mensalidade: 179.90, description: 'Mensalidade R$ 179,90 e Adesão R$ 50,00' },
	'MEN3A': { type: 'custom', adesao: 0, mensalidade: 169.90, description: 'Mensalidade R$ 169,90 e Adesão Grátis' }
};

const isValidCPF = (cpf: string) => {
	cpf = cpf.replace(/[^\d]+/g, '');
	if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
	let add = 0;
	for (let i = 0; i < 9; i++) add += parseInt(cpf.charAt(i)) * (10 - i);
	let rev = 11 - (add % 11);
	if (rev === 10 || rev === 11) rev = 0;
	if (rev !== parseInt(cpf.charAt(9))) return false;
	add = 0;
	for (let i = 0; i < 10; i++) add += parseInt(cpf.charAt(i)) * (11 - i);
	rev = 11 - (add % 11);
	if (rev === 10 || rev === 11) rev = 0;
	if (rev !== parseInt(cpf.charAt(10))) return false;
	return true;
};

const isValidCNPJ = (cnpj: string) => {
	cnpj = cnpj.replace(/[^\d]+/g, '');
	if (cnpj.length !== 14) return false;
	if (cnpj === "00000000000000" || cnpj === "11111111111111" || cnpj === "22222222222222" || cnpj === "33333333333333" || cnpj === "44444444444444" || cnpj === "55555555555555" || cnpj === "66666666666666" || cnpj === "77777777777777" || cnpj === "88888888888888" || cnpj === "99999999999999") return false;
	let size = cnpj.length - 2;
	let numbers = cnpj.substring(0, size);
	let digits = cnpj.substring(size);
	let sum = 0;
	let pos = size - 7;
	for (let i = size; i >= 1; i--) {
		sum += parseInt(numbers.charAt(size - i)) * pos--;
		if (pos < 2) pos = 9;
	}
	let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
	if (result !== parseInt(digits.charAt(0))) return false;
	size = size + 1;
	numbers = cnpj.substring(0, size);
	sum = 0;
	pos = size - 7;
	for (let i = size; i >= 1; i--) {
		sum += parseInt(numbers.charAt(size - i)) * pos--;
		if (pos < 2) pos = 9;
	}
	result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
	if (result !== parseInt(digits.charAt(1))) return false;
	return true;
};

const isValidEmail = (email: string) => {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidPhone = (phone: string) => {
	const cleanPhone = phone.replace(/\D/g, '');
	// Must be 10 or 11 digits
	if (cleanPhone.length !== 10 && cleanPhone.length !== 11) return false;

	// Valid DDDs in Brazil are from 11 to 99
	const ddd = parseInt(cleanPhone.substring(0, 2));
	if (ddd < 11 || ddd > 99) return false;

	// If 11 digits, the 3rd digit must be 9
	if (cleanPhone.length === 11 && cleanPhone.charAt(2) !== '9') return false;

	// Avoid repeated sequences like 11999999999
	if (/^(\d)\1+$/.test(cleanPhone)) return false;

	return true;
};

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
			if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	return (
		<div className="relative space-y-2" ref={containerRef}>
			<label className="block text-sm font-semibold text-slate-700">{label}</label>
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

			{error && <p className="text-xs font-medium text-red-500 mt-1 animate-in fade-in slide-in-from-top-1">{error}</p>}
		</div>
	);
};

interface FormData {
	contratante: string;
	cpfCnpj: string;
	rua: string;
	numero: string;
	semNumero: boolean;
	bairro: string;
	cidade: string;
	uf: string;
	cep: string;
	complemento: string;
	contato: string;
	email: string;
	responsavel: string;
	cpfResponsavel: string;
	segmento: string;
	dataInicio?: string;
	dataFim?: string;
	qtdeMaquinas?: string;
	qtdeLicencas?: string;
	cupomDesconto: string;
	semFidelidade: boolean;
}

const Contracts: React.FC = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState<FormData>({
		contratante: '',
		cpfCnpj: '',
		rua: '',
		numero: '',
		semNumero: false,
		bairro: '',
		cidade: '',
		uf: '',
		cep: '',
		complemento: '',
		contato: '',
		email: '',
		responsavel: '',
		cpfResponsavel: '',
		segmento: '',
		cupomDesconto: '',
		semFidelidade: true,
	});

	const [isGenerating, setIsGenerating] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [pdfUrl, setPdfUrl] = useState<string | null>(null);

	// Novos estados para anexos e assinatura
	const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
	const [attachedDocument, setAttachedDocument] = useState<string | null>(null);
	const [activeCamera, setActiveCamera] = useState<'doc' | 'face' | null>(null);
	const [cameraError, setCameraError] = useState<string | null>(null);
	const [docCaptureMode, setDocCaptureMode] = useState<'upload' | 'camera'>('upload');
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [isFetchingCep, setIsFetchingCep] = useState(false);

	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const sigCanvasRef = useRef<SignatureCanvas>(null);
	const sigContainerRef = useRef<HTMLDivElement>(null);

	// Ajustar tamanho do canvas de assinatura
	const resizeCanvas = () => {
		if (sigCanvasRef.current && sigContainerRef.current) {
			const canvas = sigCanvasRef.current.getCanvas();
			const container = sigContainerRef.current;
			
			const newWidth = container.offsetWidth;
			const newHeight = container.offsetHeight;

			if (newWidth === 0 || newHeight === 0) return;

			// Salvar assinatura atual se houver
			const isEmpty = sigCanvasRef.current.isEmpty();
			const data = !isEmpty ? sigCanvasRef.current.toData() : null;
			
			// Ajustar dimensões internas
			canvas.width = newWidth;
			canvas.height = newHeight;
			
			// Restaurar dados
			if (data) {
				sigCanvasRef.current.fromData(data);
			} else {
				sigCanvasRef.current.clear();
			}
		}
	};

	React.useEffect(() => {
		const timer = setTimeout(resizeCanvas, 100);
		window.addEventListener('resize', resizeCanvas);
		return () => {
			clearTimeout(timer);
			window.removeEventListener('resize', resizeCanvas);
		};
	}, []);

	const fetchAddressByCep = async (cep: string) => {
		const cleanCep = cep.replace(/\D/g, '');
		if (cleanCep.length !== 8) return;

		setIsFetchingCep(true);
		try {
			const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
			const data = await response.json();

			if (data.erro) {
				setErrors(prev => ({ ...prev, cep: 'CEP não encontrado.' }));
			} else {
				setFormData(prev => ({
					...prev,
					rua: data.logradouro || '',
					bairro: data.bairro || '',
					cidade: data.localidade || '',
					uf: data.uf || '',
				}));
				setErrors(prev => {
					const newErrors = { ...prev };
					delete newErrors.cep;
					delete newErrors.rua;
					delete newErrors.bairro;
					delete newErrors.cidade;
					delete newErrors.uf;
					return newErrors;
				});
			}
		} catch (error) {
			console.error('Erro ao buscar CEP:', error);
			setErrors(prev => ({ ...prev, cep: 'Erro ao buscar CEP.' }));
		} finally {
			setIsFetchingCep(false);
		}
	};

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

	const handleValueChange = (name: string, value: string | boolean) => {
		let formattedValue = value;

		// Aplicar máscaras baseadas no nome do campo
		if (name === 'cpfCnpj' && typeof value === 'string') {
			formattedValue = formatCpfCnpj(value);
		} else if (name === 'contato' && typeof value === 'string') {
			formattedValue = formatPhone(value);
		} else if (name === 'cpfResponsavel' && typeof value === 'string') {
			formattedValue = formatCpf(value);
		} else if (name === 'cep' && typeof value === 'string') {
			formattedValue = value.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2').substring(0, 9);
			if (formattedValue.replace(/\D/g, '').length === 8) {
				fetchAddressByCep(formattedValue);
			}
		}

		setFormData((prev) => ({ ...prev, [name]: formattedValue }));

		// Validação em tempo real
		setErrors((prev) => {
			const newErrors = { ...prev };

			if (name === 'contratante' && typeof value === 'string') {
				if (!value) newErrors.contratante = 'Nome da contratante é obrigatório.';
				else if (value.trim().split(/\s+/).length < 2) newErrors.contratante = 'Informe o nome completo ou razão social.';
				else delete newErrors.contratante;
			}

			if (name === 'cpfCnpj' && typeof value === 'string') {
				const clean = value.replace(/\D/g, '');
				if (clean.length <= 11) {
					if (clean.length > 0 && !isValidCPF(clean)) newErrors.cpfCnpj = 'CPF inválido.';
					else delete newErrors.cpfCnpj;
				} else {
					if (!isValidCNPJ(clean)) newErrors.cpfCnpj = 'CNPJ inválido.';
					else delete newErrors.cpfCnpj;
				}
			}

			if (name === 'email' && typeof value === 'string') {
				if (value && !isValidEmail(value)) newErrors.email = 'E-mail inválido.';
				else delete newErrors.email;
			}

			if (name === 'contato' && typeof value === 'string') {
				if (value && !isValidPhone(value)) newErrors.contato = 'Número de telefone inválido.';
				else delete newErrors.contato;
			}

			if (name === 'responsavel' && typeof value === 'string') {
				if (!value) newErrors.responsavel = 'Nome do responsável é obrigatório.';
				else if (value.trim().split(/\s+/).length < 2) newErrors.responsavel = 'Informe o nome completo do responsável.';
				else delete newErrors.responsavel;
			}

			if (name === 'cpfResponsavel' && typeof value === 'string') {
				const clean = value.replace(/\D/g, '');
				if (clean.length > 0 && !isValidCPF(clean)) newErrors.cpfResponsavel = 'CPF inválido.';
				else delete newErrors.cpfResponsavel;
			}

			if (name === 'segmento' && typeof value === 'string') {
				if (value && !SEGMENTOS.includes(value)) newErrors.segmento = 'Selecione uma opção válida.';
				else delete newErrors.segmento;
			}

			if (name === 'qtdeMaquinas' && typeof value === 'string') {
				if (value && !MAQUINAS.includes(value)) newErrors.qtdeMaquinas = 'Quantidade inválida (1-30).';
				else delete newErrors.qtdeMaquinas;
			}

			if (name === 'qtdeLicencas' && typeof value === 'string') {
				if (value && !LICENCAS.includes(value)) newErrors.qtdeLicencas = 'Quantidade inválida (1-99).';
				else delete newErrors.qtdeLicencas;
			}

			if (name === 'dataInicio' || name === 'dataFim') {
				const isEvent = formData.segmento?.toLowerCase().includes('evento');
				if (isEvent) {
					const dataInicio = name === 'dataInicio' ? (value as string) : formData.dataInicio;
					const dataFim = name === 'dataFim' ? (value as string) : formData.dataFim;
					
					if (dataFim) {
						const today = new Date();
						today.setHours(0, 0, 0, 0);
						const [ey, em, ed] = dataFim.split('-').map(Number);
						const normalizedEndDate = new Date(ey, em - 1, ed);
						
						if (normalizedEndDate < today) {
							newErrors.dataFim = 'A data de fim não pode ser anterior a hoje.';
						} else if (dataInicio) {
							const [sy, sm, sd] = dataInicio.split('-').map(Number);
							const normalizedStartDate = new Date(sy, sm - 1, sd);
							if (normalizedEndDate < normalizedStartDate) {
								newErrors.dataFim = 'A data de fim não pode ser anterior à data de início.';
							} else {
								delete newErrors.dataFim;
							}
						} else {
							delete newErrors.dataFim;
						}
					}
					
					if (name === 'dataInicio' && value) {
						delete newErrors.dataInicio;
					}
				}
			}

			return newErrors;
		});

		// Se o usuário mudar algo, invalida o PDF anterior para forçar nova geração
		if (pdfUrl) {
			URL.revokeObjectURL(pdfUrl);
			setPdfUrl(null);
		}
	};

	// Lógica da Câmera
	const startCamera = async (target: 'doc' | 'face') => {
		setActiveCamera(target);
		setCameraError(null);
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: { facingMode: target === 'doc' ? 'environment' : 'user' },
			});
			if (videoRef.current) {
				videoRef.current.srcObject = stream;
			}
		} catch (err) {
			console.error('Erro ao acessar câmera:', err);
			setCameraError('Não foi possível acessar a câmera. Verifique as permissões.');
			setActiveCamera(null);
		}
	};

	const stopCamera = () => {
		if (videoRef.current && videoRef.current.srcObject) {
			const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
			tracks.forEach((track) => track.stop());
			videoRef.current.srcObject = null;
		}
		setActiveCamera(null);
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

	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		if (!formData.contratante) {
			newErrors.contratante = 'Nome da contratante é obrigatório.';
		} else if (formData.contratante.trim().split(/\s+/).length < 2) {
			newErrors.contratante = 'Informe o nome completo ou razão social completa.';
		}
		
		const cleanCpfCnpj = formData.cpfCnpj.replace(/\D/g, '');
		if (!cleanCpfCnpj) {
			newErrors.cpfCnpj = 'CPF/CNPJ é obrigatório.';
		} else if (cleanCpfCnpj.length <= 11) {
			if (!isValidCPF(cleanCpfCnpj)) newErrors.cpfCnpj = 'CPF inválido.';
		} else {
			if (!isValidCNPJ(cleanCpfCnpj)) newErrors.cpfCnpj = 'CNPJ inválido.';
		}

		const cleanCep = formData.cep.replace(/\D/g, '');
		if (!cleanCep) {
			newErrors.cep = 'CEP é obrigatório.';
		} else if (cleanCep.length !== 8) {
			newErrors.cep = 'CEP deve conter 8 dígitos.';
		}

		if (!formData.rua) newErrors.rua = 'Rua é obrigatória.';
		if (!formData.numero && !formData.semNumero) newErrors.numero = 'Número é obrigatório.';
		if (!formData.bairro) newErrors.bairro = 'Bairro é obrigatório.';
		if (!formData.cidade) newErrors.cidade = 'Cidade é obrigatória.';
		if (!formData.uf) newErrors.uf = 'UF é obrigatória.';
		
		if (!formData.contato) {
			newErrors.contato = 'Contato é obrigatório.';
		} else if (!isValidPhone(formData.contato)) {
			newErrors.contato = 'Número de telefone inválido. Informe um DDD válido e o número correto.';
		}
		
		if (!formData.email) {
			newErrors.email = 'E-mail é obrigatório.';
		} else if (!isValidEmail(formData.email)) {
			newErrors.email = 'E-mail inválido.';
		}

		if (!formData.responsavel) {
			newErrors.responsavel = 'Nome do responsável é obrigatório.';
		} else if (formData.responsavel.trim().split(/\s+/).length < 2) {
			newErrors.responsavel = 'Informe o nome completo do responsável.';
		}
		
		const cleanCpfResp = formData.cpfResponsavel.replace(/\D/g, '');
		if (!cleanCpfResp) {
			newErrors.cpfResponsavel = 'CPF do responsável é obrigatório.';
		} else if (!isValidCPF(cleanCpfResp)) {
			newErrors.cpfResponsavel = 'CPF inválido.';
		}

		if (!formData.segmento) newErrors.segmento = 'Segmento é obrigatório.';
		else if (!SEGMENTOS.includes(formData.segmento)) newErrors.segmento = 'Selecione um segmento válido.';

		const isEvent = formData.segmento?.toLowerCase().includes('evento');
		if (isEvent) {
			if (!formData.dataInicio) {
				newErrors.dataInicio = 'Data de início é obrigatória.';
			}
			
			if (!formData.dataFim) {
				newErrors.dataFim = 'Data de fim é obrigatória.';
			} else {
				const today = new Date();
				today.setHours(0, 0, 0, 0);
				
				const [endYear, endMonth, endDay] = formData.dataFim.split('-').map(Number);
				const normalizedEndDate = new Date(endYear, endMonth - 1, endDay);

				if (normalizedEndDate < today) {
					newErrors.dataFim = 'A data de fim não pode ser anterior a hoje.';
				}

				if (formData.dataInicio) {
					const [startYear, startMonth, startDay] = formData.dataInicio.split('-').map(Number);
					const normalizedStartDate = new Date(startYear, startMonth - 1, startDay);
					
					if (normalizedEndDate < normalizedStartDate) {
						newErrors.dataFim = 'A data de fim não pode ser anterior à data de início.';
					}
				}
			}
			
			if (!formData.qtdeMaquinas) newErrors.qtdeMaquinas = 'Quantidade de máquinas é obrigatória.';
		} else if (formData.segmento) {
			if (!formData.qtdeLicencas) newErrors.qtdeLicencas = 'Quantidade de licenças é obrigatória.';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const sendToWhatsApp = async (pdfBlob: Blob, data: FormData) => {
		try {
			// 1. Login
			const loginResponse = await fetch('https://dev.bixs.com.br/v1/auth/login', {
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

			if (!loginResponse.ok) throw new Error('Falha no login da API Bixs');
			const loginData = await loginResponse.json();
			const token = loginData.token;

			if (!token) throw new Error('Token não retornado');

			// 2. Upload Media
			const uploadFormData = new window.FormData();
			uploadFormData.append('file', pdfBlob, `Contrato_BIXS_${data.contratante.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);

			const uploadResponse = await fetch('https://dev.bixs.com.br/v1/api/upload/media', {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${token}`,
					'accept': 'application/json',
				},
				body: uploadFormData,
			});

			if (!uploadResponse.ok) throw new Error('Falha no upload do contrato');
			const uploadData = await uploadResponse.json();
			const mediaUrl = uploadData.media_url;

			if (!mediaUrl) throw new Error('URL da mídia não retornada');

			// 2.5 Buscar Instância Ativa
			const instancesResponse = await fetch('https://dev.bixs.com.br/v1/api/message/instances', {
				headers: {
					'Authorization': `Bearer ${token}`,
					'accept': 'application/json',
				},
			});
			if (!instancesResponse.ok) throw new Error('Falha ao buscar instâncias');
			const instancesData = await instancesResponse.json();
			if (!instancesData || instancesData.length === 0) {
				throw new Error('Nenhuma instância do WhatsApp encontrada. Por favor, conecte primeiro.');
			}
			// Pega a primeira instância (ou pode colocar lógica para verificar status)
			const activeInstanceId = instancesData[0].id;

			// 3. Send Message to Company
			const messageResponse = await fetch('https://dev.bixs.com.br/v1/api/message/messages/send', {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json',
					'accept': 'application/json',
				},
				body: JSON.stringify({
					audio_url: "",
					document_url: mediaUrl,
					image_url: "",
					instance_id: activeInstanceId,
					message: `Novo contrato gerado e assinado!\n\n*Contratante:* ${data.contratante}\n*CNPJ/CPF:* ${data.cpfCnpj}\n*Segmento:* ${data.segmento}`,
					to: "553172532104",
					to_name: data.contratante,
					video_url: ""
				}),
			});

			if (!messageResponse.ok) throw new Error('Falha ao enviar mensagem para a empresa via WhatsApp');

			// 4. Send Message to Client
			const cleanClientPhone = data.contato.replace(/\D/g, '');
			const clientPhoneWithCountry = cleanClientPhone.startsWith('55') ? cleanClientPhone : `55${cleanClientPhone}`;

			const clientMessageResponse = await fetch('https://dev.bixs.com.br/v1/api/message/messages/send', {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json',
					'accept': 'application/json',
				},
				body: JSON.stringify({
					audio_url: "",
					document_url: mediaUrl,
					image_url: "",
					instance_id: activeInstanceId,
					message: "*Confirmação de Contrato – Empresa BIXs*\n\nA Empresa *BIXs* confirma o recebimento do contrato, juntamente com os dados do contratante e documentos apresentados, sendo estes cópias fiéis dos originais.\n\nPara prosseguir com a formalização, solicitamos a confirmação do envio respondendo conforme abaixo:\n*SIM* = Desejo Prosseguir com o contrato.",
					to: clientPhoneWithCountry,
					to_name: data.contratante,
					video_url: ""
				}),
			});

			if (!clientMessageResponse.ok) throw new Error('Falha ao enviar mensagem para o cliente via WhatsApp');

			console.log('Contratos enviados com sucesso para o WhatsApp!');
		} catch (error) {
			console.error('Erro ao enviar para o WhatsApp:', error);
			alert('O contrato foi gerado, mas houve um erro ao enviar para o WhatsApp. ' + (error instanceof Error ? error.message : ''));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (pricing.blockEvent) {
			alert(pricing.eventBlockMessage);
			return;
		}

		if (!validateForm()) {
			alert('Por favor, preencha todos os campos obrigatórios corretamente.');
			return;
		}

		if (!sigCanvasRef.current || sigCanvasRef.current.isEmpty()) {
			alert('Por favor, desenhe sua assinatura antes de gerar o contrato.');
			return;
		}

		if (!attachedDocument) {
			alert('Por favor, anexe o documento (RG/CNH).');
			return;
		}

		if (!capturedPhoto) {
			alert('Por favor, tire uma foto do rosto.');
			return;
		}

		setIsGenerating(true);

		try {
			const signatureDataUrl = sigCanvasRef.current.toDataURL('image/png');

			// Gera o blob do PDF manualmente com todos os dados
			const blob = await pdf(
				<ContractDocument
					data={{
						...formData,
						baseAdesao: pricing.baseAdesao,
						baseMensalidade: pricing.baseMensalidade,
						finalAdesao: pricing.finalAdesao,
						finalMensalidade: pricing.finalMensalidade,
						signature: signatureDataUrl,
						attachedDocument: attachedDocument || undefined,
						capturedPhoto: capturedPhoto || undefined,
					}}
				/>,
			).toBlob();
			const url = URL.createObjectURL(blob);
			setPdfUrl(url);
			
			// Enviar para o WhatsApp
			await sendToWhatsApp(blob, formData);
			
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

	const calculatePricing = () => {
		let baseAdesao = 250;
		let baseMensalidade = 189.90;
		let blockEvent = false;
		let eventBlockMessage = '';

		const isEvent = formData.segmento?.toLowerCase().includes('evento');
		const pdvs = isEvent ? parseInt(formData.qtdeMaquinas || '1') : parseInt(formData.qtdeLicencas || '1');

		if (!isEvent) {
			baseAdesao = 250;
			if (pdvs <= 5) baseMensalidade = 189.90;
			else if (pdvs === 6) baseMensalidade = 215.00;
			else if (pdvs === 7) baseMensalidade = 230.00;
			else if (pdvs === 8) baseMensalidade = 240.00;
			else if (pdvs === 9) baseMensalidade = 248.00;
			else if (pdvs === 10) baseMensalidade = 259.00;
			else baseMensalidade = 259.00 + ((pdvs - 10) * 8);
		} else {
			baseAdesao = 150;
			let dif = 0;

			if (formData.dataInicio && formData.dataFim) {
				const [sy, sm, sd] = formData.dataInicio.split('-');
				const [ey, em, ed] = formData.dataFim.split('-');
				const start = new Date(Date.UTC(parseInt(sy), parseInt(sm) - 1, parseInt(sd)));
				const end = new Date(Date.UTC(parseInt(ey), parseInt(em) - 1, parseInt(ed)));
				const diffTime = end.getTime() - start.getTime();
				const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));

				if (days < 0) {
					blockEvent = true;
					eventBlockMessage = 'Data de fim não pode ser anterior à data de início.';
				} else if (days <= 7) {
					dif = 10;
				} else if (days <= 15) {
					dif = 200;
				} else if (days <= 30) {
					dif = 400;
				} else {
					blockEvent = true;
					eventBlockMessage = 'Para eventos com mais de 30 dias, por favor, entre em contato com nosso time comercial pelo WhatsApp.';
				}
			}

			let mensalidadeTabela = 190;
			if (pdvs === 1 || pdvs === 2) mensalidadeTabela = 190;
			else if (pdvs === 3) mensalidadeTabela = 250;
			else if (pdvs === 4) mensalidadeTabela = 360;
			else if (pdvs === 5) mensalidadeTabela = 420;
			else if (pdvs === 6) mensalidadeTabela = 520;
			else if (pdvs === 7) mensalidadeTabela = 618;
			else if (pdvs === 8) mensalidadeTabela = 716;
			else if (pdvs === 9) mensalidadeTabela = 815;
			else if (pdvs === 10) mensalidadeTabela = 913;
			else mensalidadeTabela = 913 + ((pdvs - 10) * 98);

			baseMensalidade = mensalidadeTabela + dif;
		}

		let finalAdesao = baseAdesao;
		let finalMensalidade = baseMensalidade;
		let economia = 0;
		let cupomValido = false;
		let mensagemCupom = '';

		if (formData.cupomDesconto) {
			const cupom = VALID_COUPONS[formData.cupomDesconto.toUpperCase()];
			if (cupom) {
				if (isEvent && cupom.type !== 'adesao') {
					mensagemCupom = 'Este cupom não é válido para o segmento de Eventos (apenas cupons de adesão são aceitos).';
				} else {
					cupomValido = true;
					if (cupom.type === 'adesao' && cupom.discount) {
						const desconto = baseAdesao * cupom.discount;
						finalAdesao = baseAdesao - desconto;
						economia = desconto;
					} else if (cupom.type === 'custom') {
						economia = (baseAdesao - (cupom.adesao || 0)) + (baseMensalidade - (cupom.mensalidade || 0));
						finalAdesao = cupom.adesao || 0;
						finalMensalidade = cupom.mensalidade || 0;
					}
					mensagemCupom = `Cupom válido! Você economizou R$ ${economia.toFixed(2).replace('.', ',')}. Este é um cupom de uso único e não será mais válido para este usuário após a geração.`;
				}
			} else {
				mensagemCupom = 'Cupom inválido ou expirado.';
			}
		}

		return { baseAdesao, baseMensalidade, finalAdesao, finalMensalidade, economia, cupomValido, mensagemCupom, blockEvent, eventBlockMessage };
	};

	const pricing = calculatePricing();

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
							Preencha os dados, anexe seus documentos e assine para gerar seu contrato completo.
						</p>
					</div>

					<div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
						<div className="p-8 md:p-10">
							{pricing.blockEvent && (
								<div className="p-4 mb-8 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
									<AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
									<div>
										<h4 className="text-red-800 font-bold">Atenção</h4>
										<p className="text-red-700 text-sm mt-1">{pricing.eventBlockMessage}</p>
										{pricing.eventBlockMessage.includes('WhatsApp') && (
											<a href="https://wa.me/553172532104" target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-sm font-bold text-red-700 underline">
												Falar com o Comercial no WhatsApp
											</a>
										)}
									</div>
								</div>
							)}

							<form onSubmit={handleSubmit} className="space-y-10">
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
												className={`${inputClasses} ${errors.contratante ? 'border-red-500 bg-red-50' : ''}`}
												placeholder="Razão Social ou Nome Completo"
												required
											/>
											{errors.contratante && <p className="text-xs text-red-500 mt-1">{errors.contratante}</p>}
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
												className={`${inputClasses} ${errors.cpfCnpj ? 'border-red-500 bg-red-50' : ''}`}
												placeholder="00.000.000/0001-00"
												maxLength={18}
												required
											/>
											{errors.cpfCnpj && <p className="text-xs text-red-500 mt-1">{errors.cpfCnpj}</p>}
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
												className={`${inputClasses} ${errors.contato ? 'border-red-500 bg-red-50' : ''}`}
												placeholder="(00) 0 0000-0000"
												maxLength={15}
												required
											/>
											{errors.contato && <p className="text-xs text-red-500 mt-1">{errors.contato}</p>}
										</div>
										<div className="md:col-span-2">
											<label className={labelClasses}>
												E-mail
											</label>
											<input
												type="email"
												name="email"
												value={formData.email}
												onChange={handleChange}
												className={`${inputClasses} ${errors.email ? 'border-red-500 bg-red-50' : ''}`}
												placeholder="contato@empresa.com"
												required
											/>
											{errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
										</div>
									</div>
								</div>

								{/* Seção Endereço */}
								<div>
									<h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-6 flex items-center gap-2">
										<span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 text-xs flex items-center justify-center">
											2
										</span>
										Endereço
									</h3>
									<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
										<div className="md:col-span-1">
											<label className={labelClasses}>
												CEP
											</label>
											<div className="relative">
												<input
													type="text"
													name="cep"
													value={formData.cep}
													onChange={handleChange}
													className={`${inputClasses} ${errors.cep ? 'border-red-500 bg-red-50' : ''} ${isFetchingCep ? 'pr-10' : ''}`}
													placeholder="00000-000"
													maxLength={9}
													required
												/>
												{isFetchingCep && (
													<div className="absolute right-3 top-1/2 -translate-y-1/2">
														<Loader2 size={18} className="animate-spin text-primary-500" />
													</div>
												)}
											</div>
											{errors.cep && <p className="text-xs text-red-500 mt-1">{errors.cep}</p>}
										</div>
										<div className="md:col-span-3">
											<label className={labelClasses}>Rua</label>
											<input
												type="text"
												name="rua"
												value={formData.rua}
												onChange={handleChange}
												className={`${inputClasses} ${errors.rua ? 'border-red-500 bg-red-50' : ''}`}
												placeholder="Nome da Rua"
												required
											/>
											{errors.rua && <p className="text-xs text-red-500 mt-1">{errors.rua}</p>}
										</div>
										
										<div className="md:col-span-1">
											<label className={labelClasses}>Número</label>
											<div className="relative">
												<input
													type="text"
													name="numero"
													value={formData.numero}
													onChange={handleChange}
													disabled={formData.semNumero}
													className={`${inputClasses} ${formData.semNumero ? 'bg-slate-100 cursor-not-allowed opacity-60' : ''} ${errors.numero ? 'border-red-500 bg-red-50' : ''} pr-16`}
													placeholder={formData.semNumero ? "S/N" : "123"}
													required={!formData.semNumero}
												/>
												<button
													type="button"
													onClick={() => handleValueChange('semNumero', !formData.semNumero)}
													className={`absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg border font-bold text-[10px] transition-all ${
														formData.semNumero 
															? 'bg-primary-600 border-primary-600 text-white shadow-sm' 
															: 'bg-white border-slate-200 text-slate-400 hover:border-primary-300 hover:text-primary-600'
													}`}
												>
													S/N
												</button>
											</div>
											{errors.numero && <p className="text-xs text-red-500 mt-1">{errors.numero}</p>}
										</div>

										<div className="md:col-span-1">
											<label className={labelClasses}>Bairro</label>
											<input
												type="text"
												name="bairro"
												value={formData.bairro}
												onChange={handleChange}
												className={`${inputClasses} ${errors.bairro ? 'border-red-500 bg-red-50' : ''}`}
												placeholder="Bairro"
												required
											/>
											{errors.bairro && <p className="text-xs text-red-500 mt-1">{errors.bairro}</p>}
										</div>

										<div className="md:col-span-1">
											<label className={labelClasses}>Cidade</label>
											<input
												type="text"
												name="cidade"
												value={formData.cidade}
												onChange={handleChange}
												className={`${inputClasses} ${errors.cidade ? 'border-red-500 bg-red-50' : ''}`}
												placeholder="Cidade"
												required
											/>
											{errors.cidade && <p className="text-xs text-red-500 mt-1">{errors.cidade}</p>}
										</div>

										<div className="md:col-span-1">
											<label className={labelClasses}>UF</label>
											<input
												type="text"
												name="uf"
												value={formData.uf}
												onChange={handleChange}
												className={`${inputClasses} ${errors.uf ? 'border-red-500 bg-red-50' : ''}`}
												placeholder="MG"
												maxLength={2}
												required
											/>
											{errors.uf && <p className="text-xs text-red-500 mt-1">{errors.uf}</p>}
										</div>

										<div className="md:col-span-4">
											<label className={labelClasses}>Complemento</label>
											<input
												type="text"
												name="complemento"
												value={formData.complemento}
												onChange={handleChange}
												className={inputClasses}
												placeholder="Apto, Bloco, Sala, etc. (Opcional)"
											/>
										</div>
									</div>
								</div>

								{/* Seção Negócio */}
								<div>
									<h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-6 flex items-center gap-2">
										<span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 text-xs flex items-center justify-center">
											3
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

										{formData.segmento?.toLowerCase().includes('evento') && (
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
														className={`${inputClasses} ${errors.dataInicio ? 'border-red-500 bg-red-50' : ''}`}
														required
													/>
													{errors.dataInicio && <p className="text-xs text-red-500 mt-1">{errors.dataInicio}</p>}
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
														min={formData.dataInicio || new Date().toISOString().split('T')[0]}
														value={
															formData.dataFim ||
															''
														}
														onChange={handleChange}
														className={`${inputClasses} ${errors.dataFim ? 'border-red-500 bg-red-50' : ''}`}
														required
													/>
													{errors.dataFim && <p className="text-xs text-red-500 mt-1">{errors.dataFim}</p>}
												</div>
												<div>
													<SearchableSelect
														label="Quantidade de Máquinas"
														name="qtdeMaquinas"
														value={formData.qtdeMaquinas || ''}
														options={MAQUINAS}
														placeholder="Selecione ou digite a quantidade"
														onChange={handleValueChange}
														required
														error={errors.qtdeMaquinas}
													/>
												</div>
											</>
										)}

										{formData.segmento &&
											!formData.segmento.toLowerCase().includes('evento') && (
												<div>
													<SearchableSelect
														label="Quantidade de Licenças"
														name="qtdeLicencas"
														value={formData.qtdeLicencas || ''}
														options={LICENCAS}
														placeholder="Selecione ou digite a quantidade"
														onChange={handleValueChange}
														required
														error={errors.qtdeLicencas}
													/>
												</div>
											)}
									</div>
								</div>

								{/* Seção Responsável */}
								<div>
									<h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-6 flex items-center gap-2">
										<span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 text-xs flex items-center justify-center">
											4
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
												className={`${inputClasses} ${errors.responsavel ? 'border-red-500 bg-red-50' : ''}`}
												placeholder="Nome Completo"
												required
											/>
											{errors.responsavel && <p className="text-xs text-red-500 mt-1">{errors.responsavel}</p>}
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
												className={`${inputClasses} ${errors.cpfResponsavel ? 'border-red-500 bg-red-50' : ''}`}
												placeholder="000.000.000-00"
												maxLength={14}
												required
											/>
											{errors.cpfResponsavel && <p className="text-xs text-red-500 mt-1">{errors.cpfResponsavel}</p>}
										</div>
									</div>
								</div>

								{/* Seção Resumo */}
								<div>
									<h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-6 flex items-center gap-2">
										<span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 text-xs flex items-center justify-center">
											5
										</span>
										Resumo do Contrato
									</h3>
									<div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-6">
										<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
											<div className="p-4 bg-green-50 rounded-xl border border-green-200 shadow-sm relative overflow-hidden">
												<div className="absolute -right-2 -top-2 w-16 h-16 bg-green-100 rounded-full opacity-50"></div>
												<p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-1">Fidelidade</p>
												<div className="flex items-center gap-2 relative z-10">
													<div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white">
														<Check size={14} strokeWidth={3} />
													</div>
													<span className="text-lg font-bold text-green-900">Sem Fidelidade</span>
												</div>
											</div>
											<div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
												<p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Valor da Adesão</p>
												<div className="flex items-baseline gap-2">
													<p className="text-xl font-extrabold text-primary-600">
														R$ {pricing.finalAdesao.toFixed(2).replace('.', ',')}
													</p>
													{pricing.cupomValido && pricing.finalAdesao !== pricing.baseAdesao && (
														<p className="text-sm text-slate-400 line-through">
															R$ {pricing.baseAdesao.toFixed(2).replace('.', ',')}
														</p>
													)}
												</div>
											</div>
											<div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
												<p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Valor Mensalidade</p>
												<div className="flex items-baseline gap-2">
													<p className="text-xl font-extrabold text-primary-600">
														R$ {pricing.finalMensalidade.toFixed(2).replace('.', ',')}
													</p>
													{pricing.cupomValido && pricing.finalMensalidade !== pricing.baseMensalidade && (
														<p className="text-sm text-slate-400 line-through">
															R$ {pricing.baseMensalidade.toFixed(2).replace('.', ',')}
														</p>
													)}
												</div>
												<p className="text-[10px] text-slate-400 font-medium mt-1">* Conforme variação de licenças</p>
											</div>
										</div>

										<div className="pt-4 border-t border-slate-200">
											<label className={labelClasses}>Cupom de Desconto</label>
											<input
												type="text"
												name="cupomDesconto"
												value={formData.cupomDesconto}
												onChange={(e) => handleValueChange('cupomDesconto', e.target.value.toUpperCase())}
												className={`${inputClasses} uppercase`}
												placeholder="Digite seu cupom aqui"
											/>
											{formData.cupomDesconto && (
												<p className={`text-sm font-medium mt-2 p-3 rounded-lg ${pricing.cupomValido ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
													{pricing.mensagemCupom}
												</p>
											)}
										</div>
									</div>
								</div>

								{/* Seção 6: Anexos (Documento e Foto) */}
								<div>
									<h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-6 flex items-center gap-2">
										<span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 text-xs flex items-center justify-center">
											6
										</span>
										Anexos Obrigatórios
									</h3>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
										{/* Anexar Documento */}
										<div className="space-y-0">
											<div className="flex items-center justify-between h-10 mb-3">
												<label className="block text-sm font-semibold text-slate-700">Anexar Documento (RG/CNH)</label>
												{!attachedDocument && !activeCamera && (
													<div className="flex bg-slate-100 p-1 rounded-lg">
														<button
															type="button"
															onClick={() => setDocCaptureMode('upload')}
															className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${docCaptureMode === 'upload' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
														>
															Upload
														</button>
														<button
															type="button"
															onClick={() => setDocCaptureMode('camera')}
															className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${docCaptureMode === 'camera' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
														>
															Câmera
														</button>
													</div>
												)}
											</div>
											<div className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl transition-all ${attachedDocument ? 'border-green-400 bg-green-50' : 'border-slate-200 bg-slate-50 hover:border-primary-400 hover:bg-white'}`}>
												{attachedDocument ? (
													<div className="relative w-full h-full p-2">
														<img src={attachedDocument} alt="Documento" className="w-full h-full object-contain rounded-lg" />
														<button
															type="button"
															onClick={() => setAttachedDocument(null)}
															className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
														>
															<Trash2 size={16} />
														</button>
													</div>
												) : activeCamera === 'doc' ? (
													<div className="relative w-full h-full overflow-hidden rounded-2xl">
														<video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
														<div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
															<button
																type="button"
																onClick={() => takePhoto('doc')}
																className="p-3 bg-primary-600 text-white rounded-full shadow-xl hover:bg-primary-700"
															>
																<Camera size={24} />
															</button>
															<button
																type="button"
																onClick={stopCamera}
																className="p-3 bg-slate-800 text-white rounded-full shadow-xl hover:bg-slate-900"
															>
																<RotateCcw size={24} />
															</button>
														</div>
													</div>
												) : docCaptureMode === 'camera' ? (
													<button
														type="button"
														onClick={() => startCamera('doc')}
														className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
													>
														<Camera className="w-10 h-10 text-slate-400 mb-2" />
														<span className="text-sm text-slate-500 font-medium">Clique para abrir a câmera</span>
													</button>
												) : (
													<label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
														<Upload className="w-10 h-10 text-slate-400 mb-2" />
														<span className="text-sm text-slate-500 font-medium">Clique para anexar foto do documento</span>
														<input type="file" accept="image/*" onChange={handleDocumentUpload} className="hidden" />
													</label>
												)}
											</div>
										</div>

										{/* Tirar Foto */}
										<div className="space-y-0">
											<div className="flex items-center h-10 mb-3">
												<label className="block text-sm font-semibold text-slate-700">Tirar Foto do Rosto</label>
											</div>
											<div className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl transition-all ${capturedPhoto ? 'border-green-400 bg-green-50' : 'border-slate-200 bg-slate-50 hover:border-primary-400 hover:bg-white'}`}>
												{capturedPhoto ? (
													<div className="relative w-full h-full p-2">
														<img src={capturedPhoto} alt="Foto" className="w-full h-full object-contain rounded-lg" />
														<button
															type="button"
															onClick={() => setCapturedPhoto(null)}
															className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
														>
															<Trash2 size={16} />
														</button>
													</div>
												) : activeCamera === 'face' ? (
													<div className="relative w-full h-full overflow-hidden rounded-2xl">
														<video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
														<div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
															<button
																type="button"
																onClick={() => takePhoto('face')}
																className="p-3 bg-primary-600 text-white rounded-full shadow-xl hover:bg-primary-700"
															>
																<Camera size={24} />
															</button>
															<button
																type="button"
																onClick={stopCamera}
																className="p-3 bg-slate-800 text-white rounded-full shadow-xl hover:bg-slate-900"
															>
																<RotateCcw size={24} />
															</button>
														</div>
													</div>
												) : (
													<button
														type="button"
														onClick={() => startCamera('face')}
														className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
													>
														<Camera className="w-10 h-10 text-slate-400 mb-2" />
														<span className="text-sm text-slate-500 font-medium">Clique para abrir a câmera</span>
													</button>
												)}
												{cameraError && <p className="text-xs text-red-500 mt-2 px-4 text-center">{cameraError}</p>}
											</div>
										</div>
									</div>
								</div>

								{/* Seção 7: Assinatura Digital */}
								<div>
									<h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-6 flex items-center gap-2">
										<span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 text-xs flex items-center justify-center">
											7
										</span>
										Assinatura Digital
									</h3>
									<div className="space-y-4 relative">
										<p className="text-sm text-slate-500">Utilize o mouse ou o dedo para desenhar sua assinatura no quadro abaixo:</p>

										<div
											ref={sigContainerRef}
											className="border-2 border-slate-200 rounded-2xl bg-slate-50 overflow-hidden h-48 relative"
										>
											<div className="flex-1 w-full h-full relative">
												<SignatureCanvas
													ref={sigCanvasRef}
													penColor="black"
													canvasProps={{
														className: 'w-full h-full cursor-crosshair touch-none',
													}}
												/>
											</div>
										</div>

										<button
											type="button"
											onClick={() => sigCanvasRef.current?.clear()}
											className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
										>
											<RotateCcw size={14} />
											Limpar Assinatura
										</button>
									</div>
								</div>

								{/* Ações Finais */}
								<div className="pt-8 border-t border-slate-100">
									<button
										type="submit"
										disabled={isGenerating || pricing.blockEvent || !!pdfUrl}
										className={`w-full md:w-auto px-10 py-4 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg ${
											isGenerating || pricing.blockEvent || !!pdfUrl
												? 'bg-slate-400 cursor-not-allowed'
												: 'bg-primary-600 hover:bg-primary-700 active:scale-95 shadow-primary-500/25'
										}`}
									>
										{isGenerating ? (
											<>
												<Loader2 size={20} className="animate-spin" />
												Gerando Contrato Completo...
											</>
										) : pdfUrl ? (
											<>
												<CheckCircle size={20} />
												Contrato Gerado
											</>
										) : (
											<>
												<CheckCircle size={20} />
												Gerar Contrato Completo
											</>
										)}
									</button>
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
										O contrato gerado incluirá seus dados, sua assinatura desenhada e os anexos (documento e foto) em um único arquivo PDF. Certifique-se de que as imagens estejam nítidas.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* Canvas oculto para captura de foto */}
			<canvas ref={canvasRef} className="hidden" />

			{/* Modal de Sucesso */}
			{pdfUrl && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
					<div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in zoom-in-95 fade-in duration-200">
						<div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
							<CheckCircle size={32} />
						</div>
						<h3 className="text-2xl font-bold text-slate-900 text-center mb-2">Contrato Gerado com Sucesso!</h3>
						<p className="text-slate-600 text-center mb-8">
							Nossa equipe recebeu seu contrato e em breve entrará em contato com você.
						</p>
						<div className="space-y-3">
							<a
								href={pdfUrl}
								download={`Contrato_BIXS_${formData.contratante.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`}
								className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 transition-colors"
							>
								<FileDown size={20} />
								Baixar Contrato
							</a>
							<button
								onClick={() => {
									URL.revokeObjectURL(pdfUrl);
									setPdfUrl(null);
									window.scrollTo(0, 0);
									navigate('/');
								}}
								className="w-full px-6 py-4 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors"
							>
								Fechar e Voltar ao Início
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Contracts;
