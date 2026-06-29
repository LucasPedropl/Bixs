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
	descontoMensalPorPdv?: number;
	description: string;
}

/**
 * Cupons aceitos pelo sistema. A fonte canônica é a variável de ambiente
 * `VALID_COUPONS` (definida em `.env.local` e injetada pelo Vite). Mantemos um
 * parsing tolerante a falhas para que a aplicação nunca quebre caso a variável
 * esteja ausente ou malformada.
 */
const parseCouponsFromEnv = (): Record<string, CouponDefinition> => {
	const raw = process.env.VALID_COUPONS;

	if (!raw) {
		console.warn(
			'[cupons] Variável de ambiente VALID_COUPONS ausente. Nenhum cupom será aceito.'
		);
		return {};
	}

	try {
		const parsed = JSON.parse(raw) as Record<string, CouponDefinition>;
		return parsed;
	} catch (error) {
		console.error('[cupons] Falha ao interpretar VALID_COUPONS do ambiente:', error);
		return {};
	}
};

export const VALID_COUPONS: Record<string, CouponDefinition> = parseCouponsFromEnv();

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
