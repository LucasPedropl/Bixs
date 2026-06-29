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

	return (
		<div>
			<h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-6 flex items-center gap-2">
				<span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 text-xs flex items-center justify-center font-sans font-medium">
					5
				</span>
				Resumo do Contrato
			</h3>
			<div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div className="p-4 bg-green-50 rounded-xl border border-green-200 shadow-sm relative overflow-hidden">
						<div className="absolute -right-2 -top-2 w-16 h-16 bg-green-100 rounded-full opacity-50"></div>
						<p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-1">
							Fidelidade
						</p>
						<div className="flex items-center gap-2 relative z-10">
							<div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white">
								<Check size={14} strokeWidth={3} />
							</div>
							<span className="text-lg font-bold text-green-900">
								Sem Fidelidade
							</span>
						</div>
					</div>
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
				</div>

				{pricing.items.length > 0 && (
					<div className="pt-4 border-t border-slate-200">
						<p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
							Detalhamento
						</p>
						<div className="space-y-2">
							<div className="hidden sm:grid grid-cols-12 gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
								<span className="col-span-6">Item</span>
								<span className="col-span-2 text-center">Qtd</span>
								<span className="col-span-2 text-right">Mensal</span>
								<span className="col-span-2 text-right">Ativação</span>
							</div>
							{pricing.items.map((item, idx) => (
								<div
									key={`${item.label}-${idx}`}
									className="grid grid-cols-12 gap-2 items-center text-sm bg-white rounded-lg border border-slate-100 px-3 py-2"
								>
									<span className="col-span-12 sm:col-span-6 text-slate-700 font-medium">
										{item.label}
									</span>
									<span className="col-span-4 sm:col-span-2 text-slate-500 sm:text-center text-xs">
										<span className="sm:hidden text-slate-400">Qtd: </span>
										{item.quantidade}
									</span>
									<span className="col-span-4 sm:col-span-2 text-slate-700 sm:text-right text-xs">
										<span className="sm:hidden text-slate-400">Mensal: </span>
										R$ {item.mensalidadeTotal.toFixed(2).replace('.', ',')}
									</span>
									<span className="col-span-4 sm:col-span-2 text-slate-700 sm:text-right text-xs">
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
