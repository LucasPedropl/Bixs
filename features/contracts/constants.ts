export const SEGMENTOS = [
	'Evento',
	'Bar',
	'Restaurante',
	'Loja',
	'Hortifruti',
	'Conveniência',
];

export const MAQUINAS = Array.from({ length: 30 }, (_, i) => (i + 1).toString());
export const LICENCAS = Array.from({ length: 99 }, (_, i) => (i + 1).toString());
export const TOTENS = Array.from({ length: 30 }, (_, i) => (i + 1).toString());
export const INSTANCIAS_EVENTO = Array.from({ length: 30 }, (_, i) => (i + 1).toString());

export type CouponType = 'adesao' | 'custom' | 'evento_custom';

export interface CouponDefinition {
	type: CouponType;
	discount?: number;
	adesao?: number;
	mensalidade?: number;
	/** Desconto adicional por PDV (legado; use valorPorPdv + ativacaoPorPdv). */
	descontoMensalPorPdv?: number;
	/** Preço fixo por PDV/máquina em eventos (substitui R$ 89,00 padrão). */
	valorPorPdv?: number;
	/** Taxa de ativação fixa por PDV/máquina em eventos (substitui R$ 20,00 padrão). */
	ativacaoPorPdv?: number;
	description: string;
}

/** Cupons aceitos pelo sistema (definidos em código). */
export const VALID_COUPONS: Record<string, CouponDefinition> = {
	'ADE30%W': {
		type: 'adesao',
		discount: 0.3,
		description: '30% de desconto na adesão',
	},
	ADE50Y: {
		type: 'adesao',
		discount: 0.5,
		description: '50% de desconto na adesão',
	},
	ADE70JZ: {
		type: 'adesao',
		discount: 0.7,
		description: '70% de desconto na adesão',
	},
	MEN2B: {
		type: 'custom',
		adesao: 50,
		mensalidade: 179.9,
		description: 'Mensalidade R$ 179,90 e Adesão R$ 50,00',
	},
	MEN3A: {
		type: 'custom',
		adesao: 0,
		mensalidade: 169.9,
		description: 'Mensalidade R$ 169,90 e Adesão Grátis',
	},
	MEN189SA: {
		type: 'custom',
		adesao: 0,
		mensalidade: 189.9,
		description: 'Mensalidade R$ 189,90 e Adesão Grátis',
	},
	MEN160AB: {
		type: 'custom',
		adesao: 100,
		mensalidade: 169.9,
		description: 'Mensalidade R$ 169,90 e Ativação R$ 100,00',
	},
	MEN149AB: {
		type: 'custom',
		adesao: 50,
		mensalidade: 149.9,
		description: 'Mensalidade R$ 149,90 e Ativação R$ 50,00',
	},
	MAQFREE10: {
		type: 'evento_custom',
		valorPorPdv: 79,
		ativacaoPorPdv: 10,
		description: 'Evento: R$ 79,00 por máquina + R$ 10,00 de ativação por máquina',
	},
};

/**
 * Tabela de preços do produto Autoatendimento (totem). Valores fixos: PDV +
 * equipamento. Controle de Estoque e Emissão Fiscal são módulos opcionais.
 */
export const AUTOATENDIMENTO = {
	pdv: { mensalidade: 119.9, ativacao: 100 },
	equipamento: { ativacao: 600 },
	controleEstoque: { mensalidade: 69.9, ativacao: 50 },
	emissaoFiscal: { mensalidade: 69.9, ativacao: 50 },
} as const;

/**
 * Add-on de Gestão de Eventos UAI PDV (Emissão de Fichas, acompanhamento online
 * e integração com a máquina de cartão Stone). Cobrado por instância (telas).
 */
export const GESTAO_EVENTOS = {
	valorPorInstancia: 89.9,
	ativacao: 100,
	recursos: [
		'Controle de Vendas - Emissão de Fichas',
		'Acompanhar as vendas de forma online',
		'Integração com Máquina de Cartão Stone',
	],
} as const;
