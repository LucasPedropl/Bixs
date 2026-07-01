export type BusinessType = 'evento' | 'mensalidade' | 'autoatendimento';

export interface FormData {
	contratante: string;
	cpfCnpj: string;
	rua: string;
	numero: string;
	semNumero: boolean;
	bairro: string;
	cidade: string;
	uf: string;
	cep: string;
	complemento: string;
	contato: string;
	email: string;
	responsavel: string;
	cpfResponsavel: string;
	dataNascimento?: string;
	segmento: string;
	dataInicio?: string;
	dataFim?: string;
	qtdeMaquinas?: string;
	qtdeLicencas?: string;
	// Autoatendimento
	qtdeTotens?: string;
	controleEstoque?: boolean;
	emissaoFiscal?: boolean;
	// Gestão de Eventos (add-on do tipo Evento)
	gestaoEventos?: boolean;
	qtdeInstancias?: string;
	// Máquinas em comodato (add-on informativo do tipo Evento, usa qtdeMaquinas, não soma nos valores)
	comodato?: boolean;
	cupomDesconto: string;
	semFidelidade: boolean;
}

/**
 * Linha de detalhamento de preço. Os valores já representam o total da linha
 * (mensalidade e adesão), facilitando a renderização tanto no resumo quanto no
 * contrato em PDF.
 */
export interface PricingItem {
	label: string;
	quantidade: number;
	mensalidadeTotal: number;
	adesaoTotal: number;
}

export interface Pricing {
	baseAdesao: number;
	baseMensalidade: number;
	finalAdesao: number;
	finalMensalidade: number;
	economia: number;
	cupomValido: boolean;
	mensagemCupom: string;
	blockEvent: boolean;
	eventBlockMessage: string;
	items: PricingItem[];
	/** Indica se o valor de mensalidade é aplicável (false para Eventos). */
	showMensalidade: boolean;
}
