import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignatureCanvas from 'react-signature-canvas';
import { FileText, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { BIXS_COMPANY_WHATSAPP_E164 } from '../features/contracts/constants/bixsApi';

import ContractDocument from '../components/ContractDocument';

// Hooks customizados
import { useCamera } from '../features/contracts/hooks/useCamera';
import { useContractForm } from '../features/contracts/hooks/useContractForm';

// Componentes da feature
import { SuccessModal } from '../features/contracts/components/SuccessModal';
import {
	ManualContractSendActions,
	SendFailureModal,
} from '../features/contracts/components/SendFailureModal';
import { SignaturePad } from '../features/contracts/components/SignaturePad';
import { CameraCapture } from '../features/contracts/components/CameraCapture';
import { PricingSummary } from '../features/contracts/components/PricingSummary';
import {
	CompanyDataSection,
	AddressSection,
	BusinessSection,
	ResponsibleSection,
} from '../features/contracts/components/FormSections';

const Contracts: React.FC = () => {
	const navigate = useNavigate();
	const [isSendFailureModalOpen, setIsSendFailureModalOpen] = useState(false);
	
	// Inicialização do hook de câmera
	const camera = useCamera();

	// Inicialização do hook do formulário
	const {
		formData,
		businessType,
		isGenerating,
		isSubmitted,
		pdfUrl,
		errors,
		isFetchingCep,
		pricing,
		submitError,
		setSubmitError,
		setBusinessType,
		setPdfUrl,
		handleChange,
		handleValueChange,
		fillWithMockData,
		generateAndSendContract,
	} = useContractForm(ContractDocument);

	const whatsappSendFailed = Boolean(pdfUrl && submitError && !isSubmitted);

	useEffect(() => {
		if (whatsappSendFailed) {
			setIsSendFailureModalOpen(true);
		} else {
			setIsSendFailureModalOpen(false);
		}
	}, [whatsappSendFailed]);

	// Referência para o Canvas de Assinatura
	const sigCanvasRef = useRef<SignatureCanvas>(null);
	const sigContainerRef = useRef<HTMLDivElement>(null);

	// Ajusta o tamanho do canvas de assinatura ao redimensionar
	const resizeCanvas = () => {
		if (sigCanvasRef.current && sigContainerRef.current) {
			const canvas = sigCanvasRef.current.getCanvas();
			const container = sigContainerRef.current;
			const newWidth = container.offsetWidth;
			const newHeight = container.offsetHeight;

			if (newWidth === 0 || newHeight === 0) return;

			const isEmpty = sigCanvasRef.current.isEmpty();
			const data = !isEmpty ? sigCanvasRef.current.toData() : null;

			canvas.width = newWidth;
			canvas.height = newHeight;

			if (data) {
				sigCanvasRef.current.fromData(data);
			} else {
				sigCanvasRef.current.clear();
			}
		}
	};

	useEffect(() => {
		const timer = setTimeout(resizeCanvas, 100);
		window.addEventListener('resize', resizeCanvas);
		return () => {
			clearTimeout(timer);
			window.removeEventListener('resize', resizeCanvas);
		};
	}, []);

	// Envio do formulário
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const signatureDataUrl = sigCanvasRef.current && !sigCanvasRef.current.isEmpty()
			? sigCanvasRef.current.toDataURL('image/png')
			: null;

		await generateAndSendContract(
			signatureDataUrl,
			camera.attachedDocument,
			camera.capturedPhoto
		);
	};

	// Resetar e voltar ao início
	const handleCloseSuccess = () => {
		if (pdfUrl) {
			URL.revokeObjectURL(pdfUrl);
			setPdfUrl(null);
		}
		window.scrollTo(0, 0);
		navigate('/');
	};

	const isDevEnvironment = import.meta.env.DEV;

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
							{/* Alerta de erro de submissão do formulário */}
							{submitError && !whatsappSendFailed && (
								<div className="p-4 mb-8 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 relative animate-in fade-in slide-in-from-top-2">
									<AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
									<div className="flex-1 pr-6">
										<h4 className="text-red-800 font-bold">Atenção</h4>
										<p className="text-red-700 text-sm mt-1">{submitError}</p>
									</div>
									<button
										type="button"
										onClick={() => setSubmitError(null)}
										className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold text-sm px-2 py-1 rounded"
									>
										✕
									</button>
								</div>
							)}

							{whatsappSendFailed && !isSendFailureModalOpen && pdfUrl && (
								<div className="p-4 mb-8 bg-red-50 border border-red-200 rounded-xl animate-in fade-in slide-in-from-top-2">
									<div className="flex items-start gap-3 mb-4">
										<AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
										<div>
											<h4 className="text-red-800 font-bold">Envio automático falhou</h4>
											<p className="text-red-700 text-sm mt-1 break-words">{submitError}</p>
											<p className="text-slate-700 text-sm mt-3">
												Baixe o PDF e envie para o WhatsApp da BIXs. Depois de abrir o chat, anexe o arquivo.
											</p>
										</div>
									</div>
									<ManualContractSendActions
										pdfUrl={pdfUrl}
										contratante={formData.contratante}
									/>
								</div>
							)}

							{pricing.blockEvent && (
								<div className="p-4 mb-8 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
									<AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
									<div>
										<h4 className="text-red-800 font-bold">Atenção</h4>
										<p className="text-red-700 text-sm mt-1">{pricing.eventBlockMessage}</p>
										{pricing.eventBlockMessage.includes('WhatsApp') && (
											<a
												href={`https://wa.me/${BIXS_COMPANY_WHATSAPP_E164}`}
												target="_blank"
												rel="noopener noreferrer"
												className="inline-block mt-2 text-sm font-bold text-red-700 underline"
											>
												Falar com o Comercial no WhatsApp
											</a>
										)}
									</div>
								</div>
							)}

							<form onSubmit={handleSubmit} className="space-y-10">
								<CompanyDataSection
									formData={formData}
									errors={errors}
									onChange={handleChange}
									onValueChange={handleValueChange}
								/>

								<AddressSection
									formData={formData}
									errors={errors}
									onChange={handleChange}
									onValueChange={handleValueChange}
									isFetchingCep={isFetchingCep}
								/>

								<BusinessSection
									formData={formData}
									errors={errors}
									onChange={handleChange}
									onValueChange={handleValueChange}
									businessType={businessType}
									setBusinessType={setBusinessType}
								/>

								<ResponsibleSection
									formData={formData}
									errors={errors}
									onChange={handleChange}
									onValueChange={handleValueChange}
								/>

								<PricingSummary
									pricing={pricing}
									formData={formData}
									onValueChange={handleValueChange}
								/>

								<div>
									<h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-6 flex items-center gap-2">
										<span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 text-xs flex items-center justify-center font-sans font-medium">
											6
										</span>
										Anexos Obrigatórios
									</h3>
									<CameraCapture
										docCaptureMode={camera.docCaptureMode}
										setDocCaptureMode={camera.setDocCaptureMode}
										attachedDocument={camera.attachedDocument}
										setAttachedDocument={camera.setAttachedDocument}
										capturedPhoto={camera.capturedPhoto}
										setCapturedPhoto={camera.setCapturedPhoto}
										activeCamera={camera.activeCamera}
										cameraError={camera.cameraError}
										videoRef={camera.videoRef}
										startCamera={camera.startCamera}
										stopCamera={camera.stopCamera}
										takePhoto={camera.takePhoto}
										handleDocumentUpload={camera.handleDocumentUpload}
									/>
								</div>

								<div>
									<h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-6 flex items-center gap-2">
										<span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 text-xs flex items-center justify-center font-sans font-medium">
											7
										</span>
										Assinatura Digital
									</h3>
									<SignaturePad
										sigCanvasRef={sigCanvasRef}
										sigContainerRef={sigContainerRef}
									/>
								</div>

								<div className="pt-8 border-t border-slate-100">
									<div className="flex flex-col md:flex-row md:items-center gap-3">
										{isDevEnvironment && (
											<button
												type="button"
												onClick={() => {
													fillWithMockData();
													// Seta imagens de teste mockadas caso queira pular
													camera.setAttachedDocument('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
													camera.setCapturedPhoto('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
												}}
												className="w-full md:w-auto px-6 py-4 rounded-xl bg-amber-100 text-amber-800 font-bold hover:bg-amber-200 transition-colors outline-none"
											>
												Preencher Dados de Teste
											</button>
										)}
										<button
											type="submit"
											disabled={isGenerating || pricing.blockEvent || !!pdfUrl}
											className={`w-full md:w-auto px-10 py-4 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg outline-none ${
												isGenerating || pricing.blockEvent || !!pdfUrl
													? 'bg-slate-400 cursor-not-allowed shadow-none'
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
								</div>
							</form>
						</div>

						<div className="bg-slate-50 p-6 md:p-8 border-t border-slate-100">
							<div className="flex items-start gap-4">
								<AlertCircle className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
								<div>
									<h4 className="font-bold text-slate-900 mb-1">Informações Importantes</h4>
									<p className="text-sm text-slate-500 leading-relaxed">
										O contrato gerado incluirá seus dados, sua assinatura desenhada e os anexos (documento e foto) em um único arquivo PDF. Certifique-se de que as imagens estejam nítidas.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<canvas ref={camera.canvasRef} className="hidden" />

			{isSubmitted && pdfUrl && (
				<SuccessModal
					pdfUrl={pdfUrl}
					contratante={formData.contratante}
					onClose={handleCloseSuccess}
				/>
			)}

			{whatsappSendFailed && isSendFailureModalOpen && pdfUrl && submitError && (
				<SendFailureModal
					pdfUrl={pdfUrl}
					contratante={formData.contratante}
					errorMessage={submitError}
					onClose={() => setIsSendFailureModalOpen(false)}
				/>
			)}
		</div>
	);
};

export default Contracts;
