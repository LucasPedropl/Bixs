import React from 'react';
import { Check } from 'lucide-react';
import { FormData, Pricing } from '../types';

interface PricingSummaryProps {
	pricing: Pricing;
	formData: FormData;
	onValueChange: (name: string, value: string) => void;
}

export const PricingSummary: React.FC<PricingSummaryProps> = ({
	pricing,
	formData,
	onValueChange,
}) => {
	const inputClasses =
		'w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none text-slate-700 placeholder:text-slate-400';
	const labelClasses = 'block text-sm font-semibold text-slate-700 mb-2';

	const totalAPagar = pricing.finalMensalidade + pricing.finalAdesao;
	const totalBase = pricing.baseMensalidade + pricing.baseAdesao;
	const totalComDesconto = pricing.cupomValido && totalAPagar !== totalBase;

	return (
		<div>
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-2 mb-6">
				<h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
					<span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 text-xs flex items-center justify-center font-sans font-medium">
						5
					</span>
					Resumo do Contrato
				</h3>
				<div className="inline-flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 rounded-full bg-green-50 border border-green-200 text-sm font-semibold text-green-800">
					<span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-white shrink-0">
						<Check size={10} strokeWidth={3} />
					</span>
					Sem Fidelidade
				</div>
			</div>
			<div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-6">
				<div
					className={`grid grid-cols-1 gap-6 ${
						pricing.showMensalidade ? 'md:grid-cols-3' : 'md:grid-cols-2'
					}`}
				>
					<div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
						<p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
							Valor da Adesão / Ativação
						</p>
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
					{pricing.showMensalidade && (
						<div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
							<p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
								Valor Mensalidade
							</p>
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
							<p className="text-[10px] text-slate-400 font-medium mt-1">
								* Conforme variação de licenças
							</p>
						</div>
					)}
					<div className="p-4 bg-primary-50 rounded-xl border border-primary-200 shadow-sm">
						<p className="text-xs font-bold text-primary-700 uppercase tracking-wider mb-1">
							Valor Total a Pagar
						</p>
						<div className="flex items-baseline gap-2">
							<p className="text-xl font-extrabold text-primary-700">
								R$ {totalAPagar.toFixed(2).replace('.', ',')}
							</p>
							{totalComDesconto && (
								<p className="text-sm text-slate-400 line-through">
									R$ {totalBase.toFixed(2).replace('.', ',')}
								</p>
							)}
						</div>
						<p className="text-[10px] text-primary-600/80 font-medium mt-1">
							{pricing.showMensalidade
								? 'Mensalidade + adesão/ativação (1º pagamento)'
								: 'Adesão/ativação (pagamento único)'}
						</p>
					</div>
				</div>

				{pricing.items.length > 0 && (
					<div className="pt-4 border-t border-slate-200">
						<p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
							Detalhamento
						</p>
						<div className="space-y-2">
							<div className="hidden sm:grid grid-cols-12 gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
								<span className={pricing.showMensalidade ? 'col-span-6' : 'col-span-7'}>
									Item
								</span>
								<span className="col-span-2 text-center">Qtd</span>
								{pricing.showMensalidade && (
									<span className="col-span-2 text-right">Mensal</span>
								)}
								<span
									className={pricing.showMensalidade ? 'col-span-2 text-right' : 'col-span-3 text-right'}
								>
									Ativação
								</span>
							</div>
							{pricing.items.map((item, idx) => (
								<div
									key={`${item.label}-${idx}`}
									className="grid grid-cols-12 gap-2 items-center text-sm bg-white rounded-lg border border-slate-100 px-3 py-2"
								>
									<span
										className={`text-slate-700 font-medium col-span-12 ${
											pricing.showMensalidade ? 'sm:col-span-6' : 'sm:col-span-7'
										}`}
									>
										{item.label}
									</span>
									<span className="col-span-4 sm:col-span-2 text-slate-500 sm:text-center text-xs">
										<span className="sm:hidden text-slate-400">Qtd: </span>
										{item.quantidade}
									</span>
									{pricing.showMensalidade && (
										<span className="col-span-4 sm:col-span-2 text-slate-700 sm:text-right text-xs">
											<span className="sm:hidden text-slate-400">Mensal: </span>
											R$ {item.mensalidadeTotal.toFixed(2).replace('.', ',')}
										</span>
									)}
									<span
										className={`text-slate-700 sm:text-right text-xs col-span-4 ${
											pricing.showMensalidade ? 'sm:col-span-2' : 'sm:col-span-3'
										}`}
									>
										<span className="sm:hidden text-slate-400">Ativação: </span>
										R$ {item.adesaoTotal.toFixed(2).replace('.', ',')}
									</span>
								</div>
							))}
						</div>
					</div>
				)}

				<div className="pt-4 border-t border-slate-200">
					<label className={labelClasses}>Cupom de Desconto</label>
					<input
						type="text"
						name="cupomDesconto"
						value={formData.cupomDesconto}
						onChange={(e) =>
							onValueChange(
								'cupomDesconto',
								e.target.value.toUpperCase()
							)
						}
						onBlur={(e) => {
							const trimmed = e.target.value.replace(/\s+$/, '');
							if (trimmed !== formData.cupomDesconto) {
								onValueChange('cupomDesconto', trimmed.toUpperCase());
							}
						}}
						className={`${inputClasses} uppercase`}
						placeholder="Digite seu cupom aqui"
					/>
					{formData.cupomDesconto && (
						<p
							className={`text-sm font-medium mt-2 p-3 rounded-lg ${
								pricing.cupomValido
									? 'bg-green-50 text-green-700 border border-green-200'
									: 'bg-red-50 text-red-600 border border-red-200'
							}`}
						>
							{pricing.mensagemCupom}
						</p>
					)}
				</div>
			</div>
		</div>
	);
};
export default PricingSummary;
