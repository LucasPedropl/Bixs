import React from 'react';
import { AlertCircle, FileDown, MessageCircle } from 'lucide-react';
import { buildBixsCompanyWhatsAppUrl } from '../constants/bixsApi';

const MANUAL_WHATSAPP_MESSAGE =
	'Olá, o envio automático do contrato falhou. Vou anexar o PDF do contrato neste chat.';

function buildContractPdfFileName(contratante: string): string {
	const slug = contratante.replace(/[^a-z0-9]/gi, '_').toLowerCase();
	return `Contrato_BIXS_${slug}.pdf`;
}

type ManualSendActionsProps = {
	pdfUrl: string;
	contratante: string;
};

export const ManualContractSendActions: React.FC<ManualSendActionsProps> = ({
	pdfUrl,
	contratante,
}) => {
	const whatsAppUrl = buildBixsCompanyWhatsAppUrl(MANUAL_WHATSAPP_MESSAGE);

	return (
		<div className="space-y-3">
			<a
				href={pdfUrl}
				download={buildContractPdfFileName(contratante)}
				className="w-full flex items-center justify-center gap-2 px-6 py-4 min-h-11 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
			>
				<FileDown size={20} aria-hidden />
				Baixar Contrato
			</a>
			<a
				href={whatsAppUrl}
				target="_blank"
				rel="noopener noreferrer"
				className="w-full flex items-center justify-center gap-2 px-6 py-4 min-h-11 rounded-xl bg-[#128C7E] text-white font-bold hover:bg-[#0e6e63] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#128C7E] focus-visible:ring-offset-2"
			>
				<MessageCircle size={20} aria-hidden />
				Enviar no WhatsApp da BIXs
			</a>
		</div>
	);
};

type SendFailureModalProps = {
	pdfUrl: string;
	contratante: string;
	errorMessage: string;
	onClose: () => void;
};

export const SendFailureModal: React.FC<SendFailureModalProps> = ({
	pdfUrl,
	contratante,
	errorMessage,
	onClose,
}) => {
	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
			role="alertdialog"
			aria-labelledby="send-failure-title"
			aria-describedby="send-failure-description"
		>
			<div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
				<div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
					<AlertCircle size={32} aria-hidden />
				</div>
				<h3 id="send-failure-title" className="text-2xl font-bold text-slate-900 text-center mb-2">
					Contrato gerado, envio falhou
				</h3>
				<p id="send-failure-description" className="text-slate-600 text-center mb-4">
					Baixe o PDF e envie para o WhatsApp da BIXs. O arquivo não entra sozinho no chat: anexe depois de abrir.
				</p>
				<div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-100">
					<p className="text-xs font-bold uppercase tracking-wide text-red-700 mb-1">Erro</p>
					<p className="text-sm text-red-800 break-words whitespace-pre-wrap">{errorMessage}</p>
				</div>
				<ManualContractSendActions pdfUrl={pdfUrl} contratante={contratante} />
				<button
					type="button"
					onClick={onClose}
					className="w-full mt-3 px-6 py-4 min-h-11 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
				>
					Fechar
				</button>
			</div>
		</div>
	);
};
