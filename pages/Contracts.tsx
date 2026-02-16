import React, { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import ContractDocument from '../components/ContractDocument';
import {
	FileDown,
	CheckCircle,
	AlertCircle,
	FileText,
	Loader2,
	ExternalLink,
	Upload,
	Send,
	MessageCircle,
	Mail,
} from 'lucide-react';

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
	const [pdfUrl, setPdfUrl] = useState<string | null>(null);
	const [signedFile, setSignedFile] = useState<File | null>(null);

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
		// Se o usuário mudar algo, invalida o PDF anterior para forçar nova geração e limpa upload
		if (pdfUrl) {
			URL.revokeObjectURL(pdfUrl);
			setPdfUrl(null);
			setSignedFile(null);
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			if (file.type !== 'application/pdf') {
				alert('Por favor, envie apenas arquivos PDF.');
				return;
			}
			setSignedFile(file);
		}
	};

	const sendToWhatsApp = () => {
		if (!signedFile) {
			alert('Por favor, anexe o documento assinado primeiro.');
			return;
		}
		const message = `Olá, estou enviando o contrato assinado da empresa *${formData.contratante}*.\n\nPor favor, confirmem o recebimento.`;
		const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
		window.open(whatsappUrl, '_blank');
		alert(
			'Como o envio é via WhatsApp Web, anexe o arquivo PDF manualmente na conversa que se abrirá.',
		);
	};

	const sendToEmail = () => {
		if (!signedFile) {
			alert('Por favor, anexe o documento assinado primeiro.');
			return;
		}
		const subject = `Contrato Assinado - ${formData.contratante}`;
		const body = `Olá,\n\nSegue em anexo o contrato assinado da empresa ${formData.contratante}.\n\nAtenciosamente,\n${formData.responsavel}`;
		const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
		window.location.href = mailtoUrl;
		alert(
			'Seu cliente de e-mail será aberto. Por favor, anexe o arquivo PDF manualmente na mensagem.',
		);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsGenerating(true);

		try {
			// Gera o blob do PDF manualmente
			const blob = await pdf(
				<ContractDocument data={formData} />,
			).toBlob();
			const url = URL.createObjectURL(blob);
			setPdfUrl(url);
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
							Preencha os dados abaixo para gerar automaticamente
							o contrato de implantação de software pronto para
							assinatura.
						</p>
					</div>

					<div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
						<div className="p-8 md:p-10">
							<form onSubmit={handleSubmit} className="space-y-8">
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
											<label className={labelClasses}>
												Segmento de Negócio
											</label>
											<select
												name="segmento"
												value={formData.segmento}
												onChange={handleChange}
												className={inputClasses}
												required
											>
												<option value="">
													Selecione o segmento
												</option>
												<option value="Evento">
													Evento
												</option>
												<option value="Bar">Bar</option>
												<option value="Restaurante">
													Restaurante
												</option>
												<option value="Loja">
													Loja
												</option>
												<option value="Hortifruti">
													Hortifruti
												</option>
												<option value="Conveniência">
													Conveniência
												</option>
											</select>
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
													<label
														className={labelClasses}
													>
														Quantidade de Máquinas
													</label>
													<select
														name="qtdeMaquinas"
														value={
															formData.qtdeMaquinas ||
															''
														}
														onChange={handleChange}
														className={inputClasses}
														required
													>
														<option value="">
															Selecione a
															quantidade
														</option>
														{Array.from(
															{ length: 31 },
															(_, i) => (
																<option
																	key={i}
																	value={i}
																>
																	{i}
																</option>
															),
														)}
													</select>
												</div>
											</>
										)}

										{formData.segmento &&
											formData.segmento !== 'Evento' && (
												<div>
													<label
														className={labelClasses}
													>
														Quantidade de Licenças
													</label>
													<input
														type="number"
														name="qtdeLicencas"
														min="1"
														value={
															formData.qtdeLicencas ||
															''
														}
														onChange={handleChange}
														className={inputClasses}
														placeholder="Número de licenças"
														required
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

								{/* Ações */}
								<div className="pt-6 border-t border-slate-50 flex flex-col md:flex-row items-center gap-4">
									{!pdfUrl ? (
										<button
											type="submit"
											disabled={isGenerating}
											className={`w-full md:w-auto px-8 py-4 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg ${
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
													Gerando PDF...
												</>
											) : (
												<>
													<CheckCircle size={20} />
													Gerar Contrato
												</>
											)}
										</button>
									) : (
										<div className="w-full space-y-8 animate-in fade-in slide-in-from-left-4">
											{/* Ações do Contrato Gerado */}
											<div className="flex flex-col md:flex-row gap-4">
												<a
													href={pdfUrl}
													download={`Contrato_BIXS_${formData.contratante.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`}
													className="flex-1 md:flex-none px-8 py-4 rounded-xl bg-green-600 text-white font-bold text-lg hover:bg-green-700 active:scale-95 transition-all shadow-lg shadow-green-500/25 flex items-center justify-center gap-2"
												>
													<FileDown size={20} />
													Baixar PDF
												</a>
												<button
													type="button"
													onClick={() => {
														URL.revokeObjectURL(
															pdfUrl,
														);
														setPdfUrl(null);
														setSignedFile(null);
													}}
													className="px-6 py-4 rounded-xl bg-slate-100 text-slate-600 font-semibold hover:bg-slate-200 transition-colors"
												>
													Gerar Novo
												</button>
											</div>

											{/* Fluxo de Assinatura */}
											<div className="border-t border-slate-100 pt-8">
												<h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
													<span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm flex items-center justify-center">
														→
													</span>
													Assinatura e Envio
												</h3>

												<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
													{/* Passo 1: Assinar */}
													<div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
														<h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
															1. Assinar
															Digitalmente
														</h4>
														<p className="text-sm text-blue-700 mb-4">
															Utilize o assinador
															do Governo Federal
															(.GOV) para assinar
															o PDF baixado
															gratuitamente.
														</p>
														<a
															href="https://assinador.iti.br/assinatura/index.xhtml"
															target="_blank"
															rel="noopener noreferrer"
															className="inline-flex items-center gap-2 text-blue-700 font-semibold hover:text-blue-900 hover:underline"
														>
															Acessar
															Assinador.ITI.BR{' '}
															<ExternalLink
																size={16}
															/>
														</a>
													</div>

													{/* Passo 2: Anexar Assinado */}
													<div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
														<h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
															2. Anexar Contrato
															Assinado
														</h4>
														<label className="block w-full">
															<div
																className={`relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${signedFile ? 'border-green-400 bg-green-50' : 'border-slate-300 hover:bg-white hover:border-primary-400'}`}
															>
																<input
																	type="file"
																	accept="application/pdf"
																	onChange={
																		handleFileChange
																	}
																	className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
																/>
																{signedFile ? (
																	<div className="text-center px-4">
																		<CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
																		<span className="text-sm font-medium text-green-700 line-clamp-2">
																			{
																				signedFile.name
																			}
																		</span>
																		<span className="text-xs text-green-600 block mt-1">
																			{(
																				signedFile.size /
																				1024
																			).toFixed(
																				0,
																			)}{' '}
																			KB
																		</span>
																	</div>
																) : (
																	<div className="text-center">
																		<Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
																		<span className="text-sm text-slate-500 font-medium">
																			Clique
																			para
																			anexar
																			o
																			PDF
																			assinado
																		</span>
																	</div>
																)}
															</div>
														</label>
													</div>
												</div>

												{/* Passo 3: Enviar */}
												<div className="mt-8 pt-8 border-t border-slate-100">
													<h4 className="font-bold text-slate-900 mb-4">
														3. Enviar para a Equipe
													</h4>
													<div className="flex flex-col sm:flex-row gap-4">
														<button
															type="button"
															onClick={
																sendToWhatsApp
															}
															className={`flex-1 px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
																signedFile
																	? 'bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-500/20 active:scale-95'
																	: 'bg-slate-100 text-slate-400 cursor-not-allowed'
															}`}
															disabled={
																!signedFile
															}
														>
															<MessageCircle
																size={20}
															/>
															Enviar via WhatsApp
														</button>
														<button
															type="button"
															onClick={
																sendToEmail
															}
															className={`flex-1 px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
																signedFile
																	? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:scale-95'
																	: 'bg-slate-100 text-slate-400 cursor-not-allowed'
															}`}
															disabled={
																!signedFile
															}
														>
															<Mail size={20} />
															Enviar via E-mail
														</button>
													</div>
													{!signedFile && (
														<p className="text-center text-sm text-slate-400 mt-3">
															Anexe o arquivo
															assinado para
															liberar o envio.
														</p>
													)}
												</div>
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
										Ao clicar em "Gerar Contrato", um
										arquivo PDF será gerado com os dados
										inseridos. Certifique-se de que todas as
										informações estejam corretas.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Contracts;
