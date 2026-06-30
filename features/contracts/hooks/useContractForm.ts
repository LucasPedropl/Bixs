import { useState, useCallback } from 'react';
import { FormData, Pricing, PricingItem, BusinessType } from '../types';
import {
	SEGMENTOS,
	MAQUINAS,
	LICENCAS,
	TOTENS,
	INSTANCIAS_EVENTO,
	VALID_COUPONS,
	AUTOATENDIMENTO,
} from '../constants';
import { isValidCPF, isValidCNPJ, isValidEmail, isValidPhone } from '../utils/validation';
import { sendToWhatsApp } from '../services/whatsapp';
import { pdf, DocumentProps } from '@react-pdf/renderer';
import React from 'react';

// Constantes locais de teste
const TEST_PHONE = '3172532104';
const isDevEnvironment = import.meta.env.DEV;

export const useContractForm = (ContractDocumentComponent: React.ComponentType<{ data: any }>) => {
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
		dataNascimento: '',
		segmento: '',
		qtdeTotens: '',
		controleEstoque: false,
		emissaoFiscal: false,
		gestaoEventos: false,
		qtdeInstancias: '',
		comodato: false,
		qtdeComodato: '',
		cupomDesconto: '',
		semFidelidade: true,
	});

	const [businessType, setBusinessType] = useState<BusinessType | null>(null);
	const [isGenerating, setIsGenerating] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [pdfUrl, setPdfUrl] = useState<string | null>(null);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [isFetchingCep, setIsFetchingCep] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);

	// Funções auxiliares de máscara
	const formatCpfCnpj = (value: string) => {
		const cleanValue = value.replace(/\D/g, '');
		if (cleanValue.length <= 11) {
			return cleanValue
				.replace(/(\d{3})(\d)/, '$1.$2')
				.replace(/(\d{3})(\d)/, '$1.$2')
				.replace(/(\d{3})(\d{1,2})/, '$1-$2')
				.replace(/(-\d{2})\d+?$/, '$1');
		} else {
			return cleanValue
				.replace(/(\d{2})(\d)/, '$1.$2')
				.replace(/(\d{3})(\d)/, '$1.$2')
				.replace(/(\d{3})(\d)/, '$1/$2')
				.replace(/(\d{4})(\d)/, '$1-$2')
				.replace(/(-\d{2})\d+?$/, '$1');
		}
	};

	const formatCpf = (value: string) => {
		const cleanValue = value.replace(/\D/g, '');
		return cleanValue
			.replace(/(\d{3})(\d)/, '$1.$2')
			.replace(/(\d{3})(\d)/, '$1.$2')
			.replace(/(\d{3})(\d{1,2})/, '$1-$2')
			.replace(/(-\d{2})\d+?$/, '$1');
	};

	const formatPhone = (value: string) => {
		const cleanValue = value.replace(/\D/g, '');
		if (cleanValue.length <= 10) {
			return cleanValue
				.replace(/(\d{2})(\d)/, '($1) $2')
				.replace(/(\d{4})(\d)/, '$1-$2')
				.replace(/(-\d{4})\d+?$/, '$1');
		} else {
			return cleanValue
				.replace(/(\d{2})(\d)/, '($1) $2')
				.replace(/(\d{5})(\d)/, '$1-$2')
				.replace(/(-\d{4})\d+?$/, '$1');
		}
	};

	const fetchAddressByCep = async (cep: string) => {
		const cleanCep = cep.replace(/\D/g, '');
		if (cleanCep.length !== 8) return;

		setIsFetchingCep(true);
		try {
			const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
			const data = await response.json();

			if (data.erro) {
				setErrors((prev) => ({ ...prev, cep: 'CEP não encontrado.' }));
			} else {
				setFormData((prev) => ({
					...prev,
					rua: data.logradouro || '',
					bairro: data.bairro || '',
					cidade: data.localidade || '',
					uf: data.uf || '',
				}));
				setErrors((prev) => {
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
			setErrors((prev) => ({ ...prev, cep: 'Erro ao buscar CEP.' }));
		} finally {
			setIsFetchingCep(false);
		}
	};

	const handleValueChange = useCallback((name: string, value: string | boolean) => {
		let formattedValue = value;

		if (name === 'cpfCnpj' && typeof value === 'string') {
			formattedValue = formatCpfCnpj(value);
		} else if (name === 'contato' && typeof value === 'string') {
			formattedValue = formatPhone(value);
		} else if (name === 'cpfResponsavel' && typeof value === 'string') {
			formattedValue = formatCpf(value);
		} else if (name === 'cep' && typeof value === 'string') {
			formattedValue = value
				.replace(/\D/g, '')
				.replace(/^(\d{5})(\d)/, '$1-$2')
				.substring(0, 9);
			if (formattedValue.replace(/\D/g, '').length === 8) {
				fetchAddressByCep(formattedValue);
			}
		}

		setFormData((prev) => ({ ...prev, [name]: formattedValue }));

		setErrors((prev) => {
			const newErrors = { ...prev };

			if (name === 'contratante' && typeof value === 'string') {
				if (!value)
					newErrors.contratante = 'Nome da contratante é obrigatório.';
				else if (value.trim().split(/\s+/).length < 2)
					newErrors.contratante = 'Informe o nome completo ou razão social.';
				else delete newErrors.contratante;
			}

			if (name === 'cpfCnpj' && typeof value === 'string') {
				const clean = value.replace(/\D/g, '');
				if (clean.length <= 11) {
					if (clean.length > 0 && !isValidCPF(clean))
						newErrors.cpfCnpj = 'CPF inválido.';
					else delete newErrors.cpfCnpj;
				} else {
					if (!isValidCNPJ(clean))
						newErrors.cpfCnpj = 'CNPJ inválido.';
					else delete newErrors.cpfCnpj;
				}
			}

			if (name === 'email' && typeof value === 'string') {
				if (value && !isValidEmail(value))
					newErrors.email = 'E-mail inválido.';
				else delete newErrors.email;
			}

			if (name === 'contato' && typeof value === 'string') {
				if (value && !isValidPhone(value))
					newErrors.contato = 'Número de telefone inválido.';
				else delete newErrors.contato;
			}

			if (name === 'responsavel' && typeof value === 'string') {
				if (!value)
					newErrors.responsavel = 'Nome do responsável é obrigatório.';
				else if (value.trim().split(/\s+/).length < 2)
					newErrors.responsavel = 'Informe o nome completo do responsável.';
				else delete newErrors.responsavel;
			}

			if (name === 'cpfResponsavel' && typeof value === 'string') {
				const clean = value.replace(/\D/g, '');
				if (clean.length > 0 && !isValidCPF(clean))
					newErrors.cpfResponsavel = 'CPF inválido.';
				else delete newErrors.cpfResponsavel;
			}

			if (name === 'segmento' && typeof value === 'string') {
				if (value && !SEGMENTOS.includes(value))
					newErrors.segmento = 'Selecione uma opção válida.';
				else delete newErrors.segmento;
			}

			if (name === 'qtdeMaquinas' && typeof value === 'string') {
				if (value && !MAQUINAS.includes(value))
					newErrors.qtdeMaquinas = 'Quantidade inválida (1-30).';
				else delete newErrors.qtdeMaquinas;
			}

			if (name === 'qtdeLicencas' && typeof value === 'string') {
				if (value && !LICENCAS.includes(value))
					newErrors.qtdeLicencas = 'Quantidade inválida (1-99).';
				else delete newErrors.qtdeLicencas;
			}

			if (name === 'qtdeTotens' && typeof value === 'string') {
				if (value && !TOTENS.includes(value))
					newErrors.qtdeTotens = 'Quantidade inválida (1-30).';
				else delete newErrors.qtdeTotens;
			}

			if (name === 'qtdeInstancias' && typeof value === 'string') {
				if (value && !INSTANCIAS_EVENTO.includes(value))
					newErrors.qtdeInstancias = 'Quantidade inválida (1-30).';
				else delete newErrors.qtdeInstancias;
			}

			if (name === 'qtdeComodato' && typeof value === 'string') {
				if (value && !MAQUINAS.includes(value))
					newErrors.qtdeComodato = 'Quantidade inválida (1-30).';
				else delete newErrors.qtdeComodato;
			}

			if (name === 'dataNascimento' && typeof value === 'string') {
				if (!value) newErrors.dataNascimento = 'Data de nascimento é obrigatória.';
				else delete newErrors.dataNascimento;
			}

			if (name === 'dataInicio' || name === 'dataFim') {
				const isEvent = formData.segmento?.toLowerCase().includes('evento');
				if (isEvent) {
					const dataInicio = name === 'dataInicio' ? (value as string) : formData.dataInicio;
					const dataFim = name === 'dataFim' ? (value as string) : formData.dataFim;

					if (dataInicio && dataFim) {
						const start = new Date(dataInicio);
						const end = new Date(dataFim);
						if (end < start) {
							newErrors.dataFim = 'A data de fim não pode ser anterior à data de início.';
						} else {
							delete newErrors.dataFim;
						}
					}
				}
			}

			return newErrors;
		});
	}, [formData.segmento, formData.dataInicio, formData.dataFim]);

	const handleChange = useCallback((
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		handleValueChange(name, value);
	}, [handleValueChange]);

	const validateForm = (): boolean => {
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
		if (!formData.numero && !formData.semNumero)
			newErrors.numero = 'Número é obrigatório.';
		if (!formData.bairro) newErrors.bairro = 'Bairro é obrigatório.';
		if (!formData.cidade) newErrors.cidade = 'Cidade é obrigatória.';
		if (!formData.uf) newErrors.uf = 'UF é obrigatória.';

		if (!formData.contato) {
			newErrors.contato = 'Contato é obrigatório.';
		} else if (!isValidPhone(formData.contato)) {
			newErrors.contato = 'Número de telefone inválido. Informe um DDD válido.';
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

		if (!formData.dataNascimento) {
			newErrors.dataNascimento = 'Data de nascimento é obrigatória.';
		} else {
			const [ny, nm, nd] = formData.dataNascimento.split('-').map(Number);
			const nascimento = new Date(ny, nm - 1, nd);
			const hoje = new Date();
			hoje.setHours(0, 0, 0, 0);
			if (nascimento > hoje) {
				newErrors.dataNascimento = 'Data de nascimento não pode ser no futuro.';
			}
		}

		if (businessType === 'evento') {
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

			if (!formData.qtdeMaquinas)
				newErrors.qtdeMaquinas = 'Quantidade de PDVs é obrigatória.';

			if (formData.comodato && !formData.qtdeComodato)
				newErrors.qtdeComodato = 'Informe a quantidade de máquinas em comodato.';
		} else if (businessType === 'autoatendimento') {
			if (!formData.qtdeTotens)
				newErrors.qtdeTotens = 'Quantidade de totens é obrigatória.';
		} else if (businessType === 'mensalidade') {
			if (!formData.segmento) newErrors.segmento = 'Segmento é obrigatório.';
			else if (!SEGMENTOS.includes(formData.segmento))
				newErrors.segmento = 'Selecione um segmento válido.';

			if (!formData.qtdeLicencas)
				newErrors.qtdeLicencas = 'Quantidade de licenças é obrigatória.';
		} else {
			newErrors.tipoNegocio = 'Selecione o tipo de negócio.';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const calculatePricing = (): Pricing => {
		let blockEvent = false;
		let eventBlockMessage = '';
		const items: PricingItem[] = [];

		const isEvent = businessType === 'evento';
		const isAuto = businessType === 'autoatendimento';

		if (isEvent) {
			const pdvs = parseInt(formData.qtdeMaquinas || '1') || 1;
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
					eventBlockMessage =
						'Para eventos com mais de 30 dias, por favor, entre em contato com nosso time comercial pelo WhatsApp.';
				}
			}

			// Eventos não possuem mensalidade: todo o valor é adesão/ativação (pagamento único).
			items.push({
				label: 'Valor do evento (uso do sistema por PDV)',
				quantidade: pdvs,
				mensalidadeTotal: 0,
				adesaoTotal: pdvs * 89,
			});
			items.push({
				label: 'Taxa de ativação por PDV',
				quantidade: pdvs,
				mensalidadeTotal: 0,
				adesaoTotal: pdvs * 20,
			});

			if (dif > 0) {
				items.push({
					label: 'Adicional de duração do evento',
					quantidade: 1,
					mensalidadeTotal: 0,
					adesaoTotal: dif,
				});
			}

		} else if (isAuto) {
			const qty = parseInt(formData.qtdeTotens || '1') || 1;

			items.push({
				label: 'Sistema PDV Autoatendimento (Mensal)',
				quantidade: qty,
				mensalidadeTotal: qty * AUTOATENDIMENTO.pdv.mensalidade,
				adesaoTotal: qty * AUTOATENDIMENTO.pdv.ativacao,
			});
			items.push({
				label: 'Equipamentos (Leitor, adaptador, acrílico)',
				quantidade: qty,
				mensalidadeTotal: 0,
				adesaoTotal: qty * AUTOATENDIMENTO.equipamento.ativacao,
			});

			if (formData.controleEstoque) {
				items.push({
					label: 'Controle de Estoque (Mensal)',
					quantidade: qty,
					mensalidadeTotal: qty * AUTOATENDIMENTO.controleEstoque.mensalidade,
					adesaoTotal: qty * AUTOATENDIMENTO.controleEstoque.ativacao,
				});
			}
			if (formData.emissaoFiscal) {
				items.push({
					label: 'Emissão Fiscal (Mensal)',
					quantidade: qty,
					mensalidadeTotal: qty * AUTOATENDIMENTO.emissaoFiscal.mensalidade,
					adesaoTotal: qty * AUTOATENDIMENTO.emissaoFiscal.ativacao,
				});
			}
		} else {
			const pdvs = parseInt(formData.qtdeLicencas || '1') || 1;
			let mensalidade = 189.9;
			if (pdvs <= 5) mensalidade = 189.9;
			else if (pdvs === 6) mensalidade = 215.0;
			else if (pdvs === 7) mensalidade = 230.0;
			else if (pdvs === 8) mensalidade = 240.0;
			else if (pdvs === 9) mensalidade = 248.0;
			else if (pdvs === 10) mensalidade = 259.0;
			else mensalidade = 259.0 + (pdvs - 10) * 8;

			items.push({
				label: `Sistema UAI PDV — Mensalidade${formData.segmento ? ` (${formData.segmento})` : ''}`,
				quantidade: pdvs,
				mensalidadeTotal: mensalidade,
				adesaoTotal: 250,
			});
		}

		const baseAdesao = items.reduce((sum, item) => sum + item.adesaoTotal, 0);
		const baseMensalidade = items.reduce((sum, item) => sum + item.mensalidadeTotal, 0);

		let finalAdesao = baseAdesao;
		let finalMensalidade = baseMensalidade;
		let economia = 0;
		let cupomValido = false;
		let mensagemCupom = '';

		const equipamentosEvento = parseInt(formData.qtdeMaquinas || '1') || 1;

		if (formData.cupomDesconto) {
			const cupom = VALID_COUPONS[formData.cupomDesconto.toUpperCase()];
			if (cupom) {
				const allowedForEvent = cupom.type === 'adesao' || cupom.type === 'evento_custom';
				const allowedForAuto = cupom.type === 'adesao';

				if (isEvent && !allowedForEvent) {
					mensagemCupom =
						'Este cupom não é válido para o segmento de Eventos (apenas cupons de adesão ou de eventos são aceitos).';
				} else if (isAuto && !allowedForAuto) {
					mensagemCupom =
						'Este cupom não é válido para o Autoatendimento (apenas cupons de adesão são aceitos).';
				} else if (!isEvent && cupom.type === 'evento_custom') {
					mensagemCupom = 'Este cupom é exclusivo para o segmento de Eventos.';
				} else {
					cupomValido = true;
					if (cupom.type === 'adesao' && cupom.discount) {
						const desconto = baseAdesao * cupom.discount;
						finalAdesao = baseAdesao - desconto;
						economia = desconto;
					} else if (cupom.type === 'custom') {
						finalAdesao = cupom.adesao ?? baseAdesao;
						finalMensalidade = cupom.mensalidade ?? baseMensalidade;
						economia =
							baseAdesao - finalAdesao + (baseMensalidade - finalMensalidade);
					} else if (cupom.type === 'evento_custom') {
						// Isenção da taxa de ativação (R$ 20 por PDV) + desconto por equipamento.
						const ativacaoEvento = equipamentosEvento * 20;
						const descontoEquipamento =
							equipamentosEvento * (cupom.descontoMensalPorPdv || 0);
						finalAdesao = baseAdesao - ativacaoEvento - descontoEquipamento;
						if (finalAdesao < 0) finalAdesao = 0;
						economia = baseAdesao - finalAdesao;
					}
					mensagemCupom = `Cupom válido! Você economizou R$ ${economia.toFixed(2).replace('.', ',')}. Este é um cupom de uso único e não será mais válido para este usuário após a geração.`;
				}
			} else {
				mensagemCupom = 'Cupom inválido ou expirado.';
			}
		}

		return {
			baseAdesao,
			baseMensalidade,
			finalAdesao,
			finalMensalidade,
			economia,
			cupomValido,
			mensagemCupom,
			blockEvent,
			eventBlockMessage,
			items,
			showMensalidade: !isEvent,
		};
	};

	const pricing = calculatePricing();

	const fillWithMockData = () => {
		const mockData: FormData = {
			contratante: 'Empresa Teste LTDA',
			cpfCnpj: formatCpfCnpj('52998224725'),
			rua: 'Rua das Palmeiras',
			numero: '123',
			semNumero: false,
			bairro: 'Centro',
			cidade: 'Vitoria',
			uf: 'ES',
			cep: '29010-120',
			complemento: 'Sala 101',
			contato: formatPhone(TEST_PHONE),
			email: 'teste.contrato@bixs.com.br',
			responsavel: 'Joao da Silva',
			cpfResponsavel: formatCpf('52998224725'),
			dataNascimento: '1990-01-15',
			segmento: 'Loja',
			qtdeLicencas: '3',
			qtdeMaquinas: undefined,
			dataInicio: undefined,
			dataFim: undefined,
			cupomDesconto: '',
			semFidelidade: true,
		};

		setFormData(mockData);
		setBusinessType('mensalidade');
		setErrors({});
		setSubmitError(null);

		if (pdfUrl) {
			URL.revokeObjectURL(pdfUrl);
			setPdfUrl(null);
		}
	};

	const generateAndSendContract = async (
		signatureDataUrl: string | null,
		attachedDocument: string | null,
		capturedPhoto: string | null
	) => {
		setSubmitError(null);

		if (pricing.blockEvent) {
			setSubmitError(pricing.eventBlockMessage);
			return;
		}

		if (!validateForm()) {
			setSubmitError('Por favor, preencha todos os campos obrigatórios corretamente.');
			return;
		}

		if (!signatureDataUrl) {
			setSubmitError('Por favor, desenhe sua assinatura antes de gerar o contrato.');
			return;
		}

		if (!attachedDocument) {
			setSubmitError('Por favor, anexe o documento (RG/CNH).');
			return;
		}

		if (!capturedPhoto) {
			setSubmitError('Por favor, tire uma foto do rosto.');
			return;
		}

		setIsGenerating(true);

		try {
			// Gera o blob do PDF com todos os dados e imagens anexas
			const blob = await pdf(
				React.createElement(ContractDocumentComponent, {
					data: {
						...formData,
						businessType,
						items: pricing.items,
						baseAdesao: pricing.baseAdesao,
						baseMensalidade: pricing.baseMensalidade,
						finalAdesao: pricing.finalAdesao,
						finalMensalidade: pricing.finalMensalidade,
						signature: signatureDataUrl,
						attachedDocument: attachedDocument || undefined,
						capturedPhoto: capturedPhoto || undefined,
					}
				}) as React.ReactElement<DocumentProps>
			).toBlob();

			const url = URL.createObjectURL(blob);
			setPdfUrl(url);

			// Envia para o WhatsApp via serviço
			await sendToWhatsApp(blob, formData, isDevEnvironment, TEST_PHONE);

			setIsSubmitted(true);
		} catch (error) {
			console.error('Erro ao gerar PDF/Enviar WhatsApp:', error);
			setSubmitError(
				'Ocorreu um erro ao gerar o PDF ou enviar para o WhatsApp. ' + 
				(error instanceof Error ? error.message : 'Tente novamente.')
			);
		} finally {
			setIsGenerating(false);
		}
	};

	return {
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
	};
};
