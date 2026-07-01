import React from 'react';
import { Calendar, Store, MonitorSmartphone, Info, Truck } from 'lucide-react';
import { FormData, BusinessType } from '../types';
import { SearchableSelect } from './SearchableSelect';
import {
	SEGMENTOS,
	MAQUINAS,
	LICENCAS,
	TOTENS,
} from '../constants';

const inputClasses =
	'w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none text-slate-700 placeholder:text-slate-400';
const labelClasses = 'block text-sm font-semibold text-slate-700 mb-2';

// ----------------------------------------------------
// 1. DADOS DA EMPRESA
// ----------------------------------------------------
interface SectionProps {
	formData: FormData;
	errors: Record<string, string>;
	onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
	onValueChange: (name: string, value: string | boolean) => void;
}

export const CompanyDataSection: React.FC<SectionProps> = ({
	formData,
	errors,
	onChange,
}) => {
	return (
		<div>
			<h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-6 flex items-center gap-2">
				<span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 text-xs flex items-center justify-center font-sans font-medium">
					1
				</span>
				Dados da Empresa
			</h3>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="md:col-span-2">
					<label className={labelClasses}>
						Nome da Contratante (Razão Social)
					</label>
					<input
						type="text"
						name="contratante"
						value={formData.contratante}
						onChange={onChange}
						className={`${inputClasses} ${errors.contratante ? 'border-red-500 bg-red-50' : ''}`}
						placeholder="Razão Social ou Nome Completo"
						required
					/>
					{errors.contratante && (
						<p className="text-xs text-red-500 mt-1">{errors.contratante}</p>
					)}
				</div>
				<div>
					<label className={labelClasses}>CPF / CNPJ</label>
					<input
						type="text"
						name="cpfCnpj"
						value={formData.cpfCnpj}
						onChange={onChange}
						className={`${inputClasses} ${errors.cpfCnpj ? 'border-red-500 bg-red-50' : ''}`}
						placeholder="00.000.000/0001-00"
						maxLength={18}
						required
					/>
					{errors.cpfCnpj && (
						<p className="text-xs text-red-500 mt-1">{errors.cpfCnpj}</p>
					)}
				</div>
				<div>
					<label className={labelClasses}>Contato (Telefone)</label>
					<input
						type="text"
						name="contato"
						value={formData.contato}
						onChange={onChange}
						className={`${inputClasses} ${errors.contato ? 'border-red-500 bg-red-50' : ''}`}
						placeholder="(00) 0 0000-0000"
						maxLength={15}
						required
					/>
					{errors.contato && (
						<p className="text-xs text-red-500 mt-1">{errors.contato}</p>
					)}
				</div>
				<div className="md:col-span-2">
					<label className={labelClasses}>E-mail</label>
					<input
						type="email"
						name="email"
						value={formData.email}
						onChange={onChange}
						className={`${inputClasses} ${errors.email ? 'border-red-500 bg-red-50' : ''}`}
						placeholder="exemplo@empresa.com"
						required
					/>
					{errors.email && (
						<p className="text-xs text-red-500 mt-1">{errors.email}</p>
					)}
				</div>
			</div>
		</div>
	);
};

// ----------------------------------------------------
// 2. ENDEREÇO
// ----------------------------------------------------
interface AddressSectionProps extends SectionProps {
	isFetchingCep: boolean;
}

export const AddressSection: React.FC<AddressSectionProps> = ({
	formData,
	errors,
	onChange,
	onValueChange,
	isFetchingCep,
}) => {
	return (
		<div>
			<h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-6 flex items-center gap-2">
				<span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 text-xs flex items-center justify-center font-sans font-medium">
					2
				</span>
				Endereço
			</h3>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="relative">
					<label className={labelClasses}>CEP</label>
					<div className="relative">
						<input
							type="text"
							name="cep"
							value={formData.cep}
							onChange={onChange}
							className={`${inputClasses} ${errors.cep ? 'border-red-500 bg-red-50' : ''}`}
							placeholder="00000-000"
							maxLength={9}
							required
						/>
						{isFetchingCep && (
							<div className="absolute right-3 top-1/2 -translate-y-1/2">
								<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
							</div>
						)}
					</div>
					{errors.cep && (
						<p className="text-xs text-red-500 mt-1">{errors.cep}</p>
					)}
				</div>
				<div className="md:col-span-2">
					<label className={labelClasses}>Rua / Logradouro</label>
					<input
						type="text"
						name="rua"
						value={formData.rua}
						onChange={onChange}
						className={`${inputClasses} ${errors.rua ? 'border-red-500 bg-red-50' : ''}`}
						placeholder="Av. Paulista"
						required
					/>
					{errors.rua && (
						<p className="text-xs text-red-500 mt-1">{errors.rua}</p>
					)}
				</div>
				<div>
					<label className={labelClasses}>Número</label>
					<input
						type="text"
						name="numero"
						value={formData.numero}
						onChange={onChange}
						disabled={formData.semNumero}
						className={`${inputClasses} ${errors.numero ? 'border-red-500 bg-red-50' : ''} ${formData.semNumero ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200' : ''}`}
						placeholder="123"
						required={!formData.semNumero}
					/>
					{errors.numero && (
						<p className="text-xs text-red-500 mt-1">{errors.numero}</p>
					)}
					<div className="mt-3 flex items-center">
						<label className="inline-flex items-center text-xs font-semibold text-slate-500 cursor-pointer select-none">
							<input
								type="checkbox"
								name="semNumero"
								checked={formData.semNumero}
								onChange={(e) => {
									onValueChange('semNumero', e.target.checked);
									if (e.target.checked) {
										onValueChange('numero', '');
									}
								}}
								className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 mr-2"
							/>
							Sem número
						</label>
					</div>
				</div>
				<div>
					<label className={labelClasses}>Bairro</label>
					<input
						type="text"
						name="bairro"
						value={formData.bairro}
						onChange={onChange}
						className={`${inputClasses} ${errors.bairro ? 'border-red-500 bg-red-50' : ''}`}
						placeholder="Bairro"
						required
					/>
					{errors.bairro && (
						<p className="text-xs text-red-500 mt-1">{errors.bairro}</p>
					)}
				</div>
				<div>
					<div className="grid grid-cols-3 gap-3">
						<div className="col-span-2">
							<label className={labelClasses}>Cidade</label>
							<input
								type="text"
								name="cidade"
								value={formData.cidade}
								onChange={onChange}
								className={`${inputClasses} ${errors.cidade ? 'border-red-500 bg-red-50' : ''}`}
								placeholder="Cidade"
								required
							/>
							{errors.cidade && (
								<p className="text-xs text-red-500 mt-1">{errors.cidade}</p>
							)}
						</div>
						<div>
							<label className={labelClasses}>UF</label>
							<input
								type="text"
								name="uf"
								value={formData.uf}
								onChange={onChange}
								className={`${inputClasses} text-center ${errors.uf ? 'border-red-500 bg-red-50' : ''}`}
								placeholder="SP"
								maxLength={2}
								required
							/>
							{errors.uf && (
								<p className="text-xs text-red-500 mt-1">{errors.uf}</p>
							)}
						</div>
					</div>
				</div>
				<div className="md:col-span-3">
					<label className={labelClasses}>Complemento</label>
					<input
						type="text"
						name="complemento"
						value={formData.complemento}
						onChange={onChange}
						className={inputClasses}
						placeholder="Apto, Bloco, Sala, etc. (Opcional)"
					/>
				</div>
			</div>
		</div>
	);
};

// ----------------------------------------------------
// 3. DADOS DO NEGÓCIO
// ----------------------------------------------------
interface BusinessSectionProps extends SectionProps {
	businessType: BusinessType | null;
	setBusinessType: (type: BusinessType | null) => void;
}

export const BusinessSection: React.FC<BusinessSectionProps> = ({
	formData,
	errors,
	onChange,
	onValueChange,
	businessType,
	setBusinessType,
}) => {
	return (
		<div>
			<h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-6 flex items-center gap-2">
				<span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 text-xs flex items-center justify-center font-sans font-medium">
					3
				</span>
				Dados do Negócio
			</h3>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="md:col-span-2">
					<label className="block text-sm font-semibold text-slate-700 mb-2">
						Tipo de Negócio <span className="text-red-500">*</span>
					</label>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
						<button
							type="button"
							onClick={() => {
								setBusinessType('evento');
								onValueChange('segmento', 'Evento');
								onValueChange('qtdeLicencas', '');
								onValueChange('qtdeTotens', '');
								onValueChange('controleEstoque', false);
								onValueChange('emissaoFiscal', false);
							}}
							className={`flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200 outline-none ${
								businessType === 'evento'
									? 'border-primary-600 bg-primary-50/30 ring-4 ring-primary-500/10'
									: 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
							}`}
						>
							<div
								className={`p-2.5 rounded-lg border ${
									businessType === 'evento'
										? 'bg-primary-100 border-primary-200 text-primary-600'
										: 'bg-slate-50 border-slate-200 text-slate-500'
								}`}
							>
								<Calendar size={24} />
							</div>
							<div>
								<div className="font-bold text-slate-800">Eventos</div>
								<div className="text-xs text-slate-500 mt-0.5 leading-relaxed">
									Contratos temporários com data e quantidade de PDVs personalizadas.
								</div>
							</div>
						</button>

						<button
							type="button"
							onClick={() => {
								setBusinessType('mensalidade');
								onValueChange('segmento', '');
								onValueChange('dataInicio', '');
								onValueChange('dataFim', '');
								onValueChange('qtdeMaquinas', '');
								onValueChange('gestaoEventos', false);
								onValueChange('qtdeInstancias', '');
								onValueChange('qtdeTotens', '');
								onValueChange('controleEstoque', false);
								onValueChange('emissaoFiscal', false);
							}}
							className={`flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200 outline-none ${
								businessType === 'mensalidade' || businessType === 'autoatendimento'
									? 'border-primary-600 bg-primary-50/30 ring-4 ring-primary-500/10'
									: 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
							}`}
						>
							<div
								className={`p-2.5 rounded-lg border ${
									businessType === 'mensalidade' || businessType === 'autoatendimento'
										? 'bg-primary-100 border-primary-200 text-primary-600'
										: 'bg-slate-50 border-slate-200 text-slate-500'
								}`}
							>
								<Store size={24} />
							</div>
							<div>
								<div className="font-bold text-slate-800">Mensalidade</div>
								<div className="text-xs text-slate-500 mt-0.5 leading-relaxed">
									Soluções contínuas: PDV padrão ou Autoatendimento (totem).
								</div>
							</div>
						</button>
					</div>
				</div>

				{(businessType === 'mensalidade' || businessType === 'autoatendimento') && (
					<div className="md:col-span-2 animate-in fade-in slide-in-from-top-1 duration-200">
						<label className="block text-sm font-semibold text-slate-700 mb-2">
							Modalidade da Mensalidade <span className="text-red-500">*</span>
						</label>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<button
								type="button"
								onClick={() => {
									setBusinessType('mensalidade');
									onValueChange('segmento', '');
									onValueChange('qtdeTotens', '');
									onValueChange('controleEstoque', false);
									onValueChange('emissaoFiscal', false);
								}}
								className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200 outline-none ${
									businessType === 'mensalidade'
										? 'border-primary-600 bg-primary-50/30 ring-4 ring-primary-500/10'
										: 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
								}`}
							>
								<div
									className={`p-2 rounded-lg border ${
										businessType === 'mensalidade'
											? 'bg-primary-100 border-primary-200 text-primary-600'
											: 'bg-slate-50 border-slate-200 text-slate-500'
									}`}
								>
									<Store size={20} />
								</div>
								<div>
									<div className="font-bold text-slate-800 text-sm">Sistema PDV (Padrão)</div>
									<div className="text-xs text-slate-500 mt-0.5 leading-relaxed">
										Licenças recorrentes por segmento de negócio.
									</div>
								</div>
							</button>

							<button
								type="button"
								onClick={() => {
									setBusinessType('autoatendimento');
									onValueChange('segmento', 'Autoatendimento');
									onValueChange('qtdeLicencas', '');
								}}
								className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200 outline-none ${
									businessType === 'autoatendimento'
										? 'border-primary-600 bg-primary-50/30 ring-4 ring-primary-500/10'
										: 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
								}`}
							>
								<div
									className={`p-2 rounded-lg border ${
										businessType === 'autoatendimento'
											? 'bg-primary-100 border-primary-200 text-primary-600'
											: 'bg-slate-50 border-slate-200 text-slate-500'
									}`}
								>
									<MonitorSmartphone size={20} />
								</div>
								<div>
									<div className="font-bold text-slate-800 text-sm">Autoatendimento</div>
									<div className="text-xs text-slate-500 mt-0.5 leading-relaxed">
										Totem com módulos opcionais de estoque e fiscal.
									</div>
								</div>
							</button>
						</div>
					</div>
				)}

				{businessType === 'mensalidade' && (
					<div className="md:col-span-2 animate-in fade-in slide-in-from-top-1 duration-200">
						<SearchableSelect
							label="Segmento de Negócio"
							name="segmento"
							value={formData.segmento}
							options={SEGMENTOS.filter((s) => s !== 'Evento')}
							placeholder="Selecione ou digite o segmento"
							onChange={onValueChange}
							required
							error={errors.segmento}
						/>
					</div>
				)}

				{businessType === 'evento' && (
					<>
						<div>
							<label className={labelClasses}>Data de Início</label>
							<input
								type="date"
								name="dataInicio"
								value={formData.dataInicio || ''}
								onChange={onChange}
								className={`${inputClasses} ${errors.dataInicio ? 'border-red-500 bg-red-50' : ''}`}
								required
							/>
							{errors.dataInicio && (
								<p className="text-xs text-red-500 mt-1">{errors.dataInicio}</p>
							)}
						</div>
						<div>
							<label className={labelClasses}>Data de Fim</label>
							<input
								type="date"
								name="dataFim"
								min={
									formData.dataInicio ||
									new Date().toISOString().split('T')[0]
								}
								value={formData.dataFim || ''}
								onChange={onChange}
								className={`${inputClasses} ${errors.dataFim ? 'border-red-500 bg-red-50' : ''}`}
								required
							/>
							{errors.dataFim && (
								<p className="text-xs text-red-500 mt-1">{errors.dataFim}</p>
							)}
						</div>
						<div>
							<SearchableSelect
								label="Quantidade de PDVs"
								name="qtdeMaquinas"
								value={formData.qtdeMaquinas || ''}
								options={MAQUINAS}
								placeholder="Selecione ou digite a quantidade"
								onChange={onValueChange}
								required
								error={errors.qtdeMaquinas}
							/>
							<div className="mt-2 flex items-start gap-2 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg p-3">
								<Info size={14} className="shrink-0 mt-0.5 text-primary-500" />
								<span>
									É cobrada uma taxa de ativação única de{' '}
									<span className="font-semibold text-slate-700">R$ 20,00 por PDV</span>.
									Essa taxa pode ser anulada com um cupom de desconto válido.
								</span>
							</div>
						</div>

						<div className="md:col-span-2 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
							<label className="flex items-start gap-3 cursor-pointer select-none">
								<input
									type="checkbox"
									checked={!!formData.comodato}
									onChange={(e) => onValueChange('comodato', e.target.checked)}
									className="w-5 h-5 mt-0.5 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
								/>
								<span>
									<span className="flex items-center gap-2 font-bold text-slate-800">
										<Truck size={18} className="text-primary-600" />
										Solicitar máquinas Stone em comodato
									</span>
									<span className="block text-xs text-slate-500 mt-1 leading-relaxed">
										Smart POS da Stone em comodato (média de taxas). A
										quantidade segue a de PDVs informada acima. Não soma nos
										valores do contrato.
									</span>
								</span>
							</label>
						</div>
					</>
				)}

				{businessType === 'autoatendimento' && (
					<>
						<div>
							<SearchableSelect
								label="Quantidade de Totens (PDVs)"
								name="qtdeTotens"
								value={formData.qtdeTotens || ''}
								options={TOTENS}
								placeholder="Selecione ou digite a quantidade"
								onChange={onValueChange}
								required
								error={errors.qtdeTotens}
							/>
							<div className="mt-2 flex items-start gap-2 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg p-3">
								<Info size={14} className="shrink-0 mt-0.5 text-primary-500" />
								<span>
									Cada totem inclui o{' '}
									<span className="font-semibold text-slate-700">Sistema PDV (R$ 119,90/mês + R$ 100,00 de ativação)</span>{' '}
									e os{' '}
									<span className="font-semibold text-slate-700">Equipamentos (R$ 600,00)</span>.
								</span>
							</div>
						</div>

						<div className="md:col-span-2 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
							<p className="text-sm font-semibold text-slate-700 mb-3">
								Módulos opcionais (por totem)
							</p>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								<label className="flex items-start gap-3 cursor-pointer select-none rounded-lg border border-slate-200 bg-white p-3">
									<input
										type="checkbox"
										checked={!!formData.controleEstoque}
										onChange={(e) =>
											onValueChange('controleEstoque', e.target.checked)
										}
										className="w-5 h-5 mt-0.5 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
									/>
									<span>
										<span className="block font-semibold text-slate-800 text-sm">
											Controle de Estoque
										</span>
										<span className="block text-xs text-slate-500 mt-0.5">
											R$ 69,90/mês + R$ 50,00 de ativação
										</span>
									</span>
								</label>

								<label className="flex items-start gap-3 cursor-pointer select-none rounded-lg border border-slate-200 bg-white p-3">
									<input
										type="checkbox"
										checked={!!formData.emissaoFiscal}
										onChange={(e) =>
											onValueChange('emissaoFiscal', e.target.checked)
										}
										className="w-5 h-5 mt-0.5 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
									/>
									<span>
										<span className="block font-semibold text-slate-800 text-sm">
											Emissão Fiscal
										</span>
										<span className="block text-xs text-slate-500 mt-0.5">
											R$ 69,90/mês + R$ 50,00 de ativação
										</span>
									</span>
								</label>
							</div>
						</div>
					</>
				)}

				{businessType === 'mensalidade' && formData.segmento && (
					<div>
						<SearchableSelect
							label="Quantidade de Licenças"
							name="qtdeLicencas"
							value={formData.qtdeLicencas || ''}
							options={LICENCAS}
							placeholder="Selecione ou digite a quantidade"
							onChange={onValueChange}
							required
							error={errors.qtdeLicencas}
						/>
					</div>
				)}
			</div>
		</div>
	);
};

// ----------------------------------------------------
// 4. DADOS DO RESPONSÁVEL
// ----------------------------------------------------
export const ResponsibleSection: React.FC<SectionProps> = ({
	formData,
	errors,
	onChange,
}) => {
	return (
		<div>
			<h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-6 flex items-center gap-2">
				<span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 text-xs flex items-center justify-center font-sans font-medium">
					4
				</span>
				Dados do Responsável
			</h3>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div>
					<label className={labelClasses}>Nome do Responsável</label>
					<input
						type="text"
						name="responsavel"
						value={formData.responsavel}
						onChange={onChange}
						className={`${inputClasses} ${errors.responsavel ? 'border-red-500 bg-red-50' : ''}`}
						placeholder="Nome Completo"
						required
					/>
					{errors.responsavel && (
						<p className="text-xs text-red-500 mt-1">{errors.responsavel}</p>
					)}
				</div>
				<div>
					<label className={labelClasses}>CPF do Responsável</label>
					<input
						type="text"
						name="cpfResponsavel"
						value={formData.cpfResponsavel}
						onChange={onChange}
						className={`${inputClasses} ${errors.cpfResponsavel ? 'border-red-500 bg-red-50' : ''}`}
						placeholder="000.000.000-00"
						maxLength={14}
						required
					/>
					{errors.cpfResponsavel && (
						<p className="text-xs text-red-500 mt-1">{errors.cpfResponsavel}</p>
					)}
				</div>
				<div>
					<label className={labelClasses}>Data de Nascimento</label>
					<input
						type="date"
						name="dataNascimento"
						value={formData.dataNascimento || ''}
						onChange={onChange}
						max={new Date().toISOString().split('T')[0]}
						className={`${inputClasses} ${errors.dataNascimento ? 'border-red-500 bg-red-50' : ''}`}
						required
					/>
					{errors.dataNascimento && (
						<p className="text-xs text-red-500 mt-1">{errors.dataNascimento}</p>
					)}
				</div>
			</div>
		</div>
	);
};
