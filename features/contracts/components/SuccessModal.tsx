import React from 'react';
import { CheckCircle, FileDown } from 'lucide-react';

interface SuccessModalProps {
	pdfUrl: string;
	contratante: string;
	onClose: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
	pdfUrl,
	contratante,
	onClose,
}) => {
	const sanitizedContratante = contratante
		.replace(/[^a-z0-9]/gi, '_')
		.toLowerCase();

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
			<div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in zoom-in-95 fade-in duration-200">
				<div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
					<CheckCircle size={32} />
				</div>
				<h3 className="text-2xl font-bold text-slate-900 text-center mb-2">
					Contrato Gerado com Sucesso!
				</h3>
				<p className="text-slate-600 text-center mb-8">
					Nossa equipe recebeu seu contrato e em breve entrará em contato com você.
				</p>
				<div className="space-y-3">
					<a
						href={pdfUrl}
						download={`Contrato_BIXS_${sanitizedContratante}.pdf`}
						className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 transition-colors"
					>
						<FileDown size={20} />
						Baixar Contrato
					</a>
					<button
						type="button"
						onClick={onClose}
						className="w-full px-6 py-4 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors outline-none"
					>
						Fechar e Voltar ao Início
					</button>
				</div>
			</div>
		</div>
	);
};
export default SuccessModal;
