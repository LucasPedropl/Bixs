import React from 'react';
import {
	Page,
	Text,
	View,
	Document,
	StyleSheet,
	Image,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
	page: {
		paddingTop: 85, // Espaço para o cabeçalho fixo
		paddingBottom: 60,
		paddingHorizontal: 40,
		fontSize: 10,
		fontFamily: 'Helvetica',
		lineHeight: 1.5,
		color: '#000',
	},
	header: {
		position: 'absolute',
		top: 20,
		left: 40,
		right: 40,
		height: 60,
		borderBottomWidth: 1,
		borderBottomColor: '#ccc',
		paddingBottom: 10,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	headerLogo: {
		width: 100,
		height: 40,
		objectFit: 'contain',
	},
	headerText: {
		fontSize: 8,
		color: '#666',
		textAlign: 'right',
	},
	title: {
		fontSize: 12,
		fontWeight: 'bold',
		textDecoration: 'underline',
		textAlign: 'center',
		marginBottom: 20,
		marginTop: 10,
		width: '100%',
	},
	section: {
		marginBottom: 10,
	},
	bold: {
		fontFamily: 'Helvetica-Bold',
		fontWeight: 'bold',
	},
	fieldRow: {
		flexDirection: 'row',
		marginBottom: 5,
		flexWrap: 'wrap',
	},
	label: {
		fontFamily: 'Helvetica-Bold',
		color: '#000', // Preto oficial, sem destaques coloridos
		marginRight: 4,
	},
	value: {
		fontFamily: 'Helvetica',
		textDecoration: 'underline',
	},
	paragraph: {
		marginBottom: 10,
		textAlign: 'justify',
	},
	clauseTitle: {
		fontFamily: 'Helvetica-Bold',
		textDecoration: 'underline',
		marginTop: 10,
		marginBottom: 5,
	},
	signatureSection: {
		marginTop: 40,
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	signatureBlock: {
		width: '45%',
		alignItems: 'center',
		textAlign: 'center',
	},
	signatureLine: {
		width: '100%',
		borderTopWidth: 1,
		borderTopColor: '#000',
		paddingTop: 5,
		alignItems: 'center',
	},
	signatureImage: {
		width: 120,
		height: 45,
		marginBottom: -5, // Puxa a assinatura um pouco para cima da linha
	},
	footer: {
		position: 'absolute',
		bottom: 20,
		left: 40,
		right: 40,
		textAlign: 'center',
		color: '#999',
		fontSize: 8,
		borderTopWidth: 1,
		borderTopColor: '#eee',
		paddingTop: 10,
	},
});

interface ContractData {
	contratante: string;
	cpfCnpj: string;
	rua: string;
	numero: string;
	semNumero: boolean;
	bairro: string;
	cidade: string;
	uf: string;
	cep: string;
	complemento?: string;
	contato: string;
	email: string;
	responsavel: string;
	cpfResponsavel: string;
	segmento: string;
	// Campos opcionais dependendo do segmento
	dataInicio?: string;
	dataFim?: string;
	qtdeMaquinas?: string;
	qtdeLicencas?: string;
	cupomDesconto?: string;
	semFidelidade?: boolean;
	baseAdesao?: number;
	baseMensalidade?: number;
	finalAdesao?: number;
	finalMensalidade?: number;
	// Novos campos para assinatura e anexos
	signature?: string; // Data URL
	attachedDocument?: string; // Data URL
	capturedPhoto?: string; // Data URL
}

interface ContractDocumentProps {
	data: ContractData;
}

const ContractDocument: React.FC<ContractDocumentProps> = ({ data }) => {
	const isEvent = data.segmento?.toLowerCase().includes('evento');

	return (
		<Document>
			<Page size="A4" style={styles.page}>
				{/* Cabeçalho Fixo (prop 'fixed') garante repetição em todas as páginas */}
				<View style={styles.header} fixed>
					<Image
						style={styles.headerLogo}
						src={typeof window !== 'undefined' ? `${window.location.origin}/logo-bix-automacao.png` : '/logo-bix-automacao.png'}
					/>
					<Image
						style={styles.headerLogo}
						src="https://uaipdv.com.br/images/Logo7-removebg-preview.png"
					/>
				</View>

				<Text style={styles.title}>
					CONTRATO DE IMPLANTAÇÃO DE SOFTWARE
				</Text>

				<View style={styles.section}>
					<View style={styles.fieldRow}>
						<Text style={styles.label}>CONTRATANTE:</Text>
						<Text style={styles.value}>{data.contratante}</Text>
					</View>
					<View style={styles.fieldRow}>
						<Text style={styles.label}>CPF/CNPJ:</Text>
						<Text style={styles.value}>{data.cpfCnpj}</Text>
					</View>
					<View style={styles.fieldRow}>
						<Text style={styles.label}>ENDEREÇO:</Text>
						<Text style={styles.value}>
							{data.rua}, {data.semNumero ? 'S/N' : data.numero}
							{data.complemento ? `, ${data.complemento}` : ''}, {data.bairro}, {data.cidade} - {data.uf}, CEP: {data.cep}
						</Text>
					</View>
					<View style={styles.fieldRow}>
						<Text style={styles.label}>CONTATO:</Text>
						<Text style={[styles.value, { marginRight: 20 }]}>
							{data.contato}
						</Text>
						<Text style={styles.label}>E-MAIL:</Text>
						<Text style={styles.value}>{data.email}</Text>
					</View>
					<View style={styles.fieldRow}>
						<Text style={styles.label}>RESPONSÁVEL:</Text>
						<Text style={[styles.value, { marginRight: 20 }]}>
							{data.responsavel}
						</Text>
						<Text style={styles.label}>CPF:</Text>
						<Text style={styles.value}>{data.cpfResponsavel}</Text>
					</View>
				</View>

				<View style={styles.section}>
					<Text
						style={[
							styles.paragraph,
							styles.bold,
							{ textDecoration: 'underline' },
						]}
					>
						CONTRATADO: BIX SOLUÇÕES COM CNPJ: 47.054.579/0001-39,
						REPRESENTADA NESTE CONTRATO PELA EMPRESA DO GRUPO UAI
						PDV - Unidade de Atendimento Integrado Para Ponto de
						Venda INSCRITA NO CNPJ:24.865.243/0001- 50.
					</Text>
					<Text style={styles.paragraph}>
						As partes acima identificadas têm, entre si, justas e
						acertadas o presente Contrato de Prestação de Serviços
						de instalação, locação, configuração de sistema para
						ponto de venda e automação, que se regerá pelas
						cláusulas seguintes e pelas condições descritas no
						presente contrato.
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.clauseTitle}>
						Cláusula 1ª. O Presente Contrato
					</Text>
					<Text style={styles.paragraph}>
						Tem como OBJETO, a prestação de serviços e locação do
						sistema de automação para ponto de venda, realizado pelo
						CONTRATADO à CONTRATANTE, instalado/configurado na
						CONTRATANTE.
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.clauseTitle}>
						Cláusula 2ª. Funções e Características
					</Text>
					<Text style={styles.paragraph}>
						A solução tem as seguintes funções e características,
						totalizando em módulos disponíveis com valores distintos
						ao CONTRATANTE:
					</Text>

					<Text style={[styles.bold, { marginTop: 5 }]}>
						Licença do Módulo Produção/ PDV:
					</Text>
					<Text>Vendas; Encerramento de Operador; Sangria.</Text>

					<Text style={[styles.bold, { marginTop: 5 }]}>
						Módulo Gerencial:
					</Text>
					<Text>
						Cadastro de Usuários; Cadastro de Colaborador; Cadastro
						de Produtos; Relatórios Gestão de Vendas.
					</Text>

					<Text style={[styles.bold, { marginTop: 5 }]}>
						Suporte a dúvidas:
					</Text>
					<Text>Telefone; Remoto; WhatsApp.</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.clauseTitle}>Disposições Gerais</Text>
					<Text style={styles.paragraph}>
						PARÁGRAFO PRIMEIRO: {data.semFidelidade ? 'O presente contrato NÃO POSSUI FIDELIDADE.' : 'Caso a CONTRATANTE deseje rescindir o presente instrumento, antes de 30 (Trinta dias) pagará à CONTRATADA a título de multa, o equivalente a R$ 100,00 (Cem Reais) e QUITAR os títulos em aberto referente aos equipamentos e serviços.'}
					</Text>
					<Text style={styles.paragraph}>
						CLÁUSULA 3ª Após aprovação o pagamento deve ser
						realizado por meio eletrônico ou físico, CONTRATANTE e
						CONTRATADO. Dará início a disponibilidade da solução e
						treinamento.
					</Text>
					<Text style={styles.paragraph}>
						PARÁGRAFO TERCEIRO: O sistema de automação para ponto de
						venda compreende nos seguintes itens: 1 Sistema
						GERENCIAL e VENDAS na plataforma Windows e Android.
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.clauseTitle}>Valores</Text>
					<Text style={styles.paragraph}>
						PARÁGRAFO QUARTO: Os valores e taxas da solução
						contratada correspondem aos pontos:
					</Text>
					<View style={{ marginLeft: 10 }}>
						{!isEvent && data.qtdeLicencas && (
							<Text>
								• Número de licença ativa: ({data.qtdeLicencas})
								PDV
							</Text>
						)}
						<Text
							style={{
								marginTop: 5,
								fontFamily: 'Helvetica-Bold',
							}}
						>
							Adesão UAI PDV Mais: R$ {data.finalAdesao !== undefined ? data.finalAdesao.toFixed(2).replace('.', ',') : '250,00'}
							{data.baseAdesao && data.finalAdesao !== data.baseAdesao ? ` (De R$ ${data.baseAdesao.toFixed(2).replace('.', ',')})` : ''}
						</Text>
						<Text
							style={{
								marginTop: 2,
								fontFamily: 'Helvetica-Bold',
							}}
						>
							Valor da Mensalidade: R$ {data.finalMensalidade !== undefined ? data.finalMensalidade.toFixed(2).replace('.', ',') : '189,90'} (Conforme variação de licenças)
							{data.baseMensalidade && data.finalMensalidade !== data.baseMensalidade ? ` (De R$ ${data.baseMensalidade.toFixed(2).replace('.', ',')})` : ''}
						</Text>
						{data.cupomDesconto && (
							<Text style={{ marginTop: 2, color: '#059669' }}>
								• Cupom de Desconto Aplicado: {data.cupomDesconto}
							</Text>
						)}
					</View>
				</View>

				<View style={styles.section}>
					<Text style={styles.clauseTitle}>
						Prazos e Regras (Cláusula 12ª)
					</Text>
					<Text style={styles.paragraph}>
						1. Vencimento da mensalidade é todo dia 05, estendendo o
						prazo até o dia 15 do mês corrente;
					</Text>
					<Text style={styles.paragraph}>
						2. A licença ativada, entre o dia 1º até último dia do
						mês corrente, é cobrada o valor integral da mensalidade;
					</Text>
					<Text style={styles.paragraph}>
						3. O CONTRATADO disponibiliza o canal direto com seus
						clientes via telefone e WhatsApp;
					</Text>
					<Text style={styles.paragraph}>
						4. Cancelamento deve ser FORMALIZADO por WhatsApp ou
						e-mail.
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.clauseTitle}>
						Regras Gerais
					</Text>
					{isEvent ? (
						<View style={{ marginLeft: 10 }}>
							<Text style={styles.paragraph}>
								• Período do Evento: {data.dataInicio ? data.dataInicio.split('-').reverse().join('/') : ''} a {data.dataFim ? data.dataFim.split('-').reverse().join('/') : ''}
							</Text>
							<Text style={styles.paragraph}>
								• Quantidade de Máquinas: {data.qtdeMaquinas}
							</Text>
						</View>
					) : (
						<View style={{ marginLeft: 10 }}>
							<Text style={styles.paragraph}>
								• Quantidade de Licenças: {data.qtdeLicencas}
							</Text>
						</View>
					)}
				</View>

				<View style={styles.section}>
					<Text style={{ marginTop: 20, textAlign: 'center' }}>
						Belo Horizonte,{' '}
						{new Date().toLocaleDateString('pt-BR', {
							day: 'numeric',
							month: 'long',
							year: 'numeric',
						})}
						.
					</Text>
				</View>

				<View style={styles.signatureSection} wrap={false}>
					<View style={styles.signatureBlock}>
						<View style={{ height: 45 }} /> {/* Espaço para alinhar com o outro lado */}
						<View style={styles.signatureLine}>
							<Text style={styles.bold}>CONTRATADO</Text>
							<Text>BIX SOLUÇÕES</Text>
						</View>
					</View>
					<View style={styles.signatureBlock}>
						{data.signature ? (
							<Image
								src={data.signature}
								style={styles.signatureImage}
							/>
						) : (
							<View style={{ height: 45 }} />
						)}
						<View style={styles.signatureLine}>
							<Text style={styles.bold}>CONTRATANTE</Text>
							<Text>{data.contratante || 'Cliente'}</Text>
						</View>
					</View>
				</View>

				<Text
					style={styles.footer}
					fixed
					render={({ pageNumber, totalPages }) =>
						`${pageNumber} / ${totalPages}`
					}
				/>
			</Page>

			{/* Páginas de Anexos */}
			{data.attachedDocument && (
				<Page size="A4" style={styles.page}>
					<Text style={styles.title}>ANEXO: DOCUMENTO DO CLIENTE</Text>
					<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
						<Image
							src={data.attachedDocument}
							style={{ maxWidth: '100%', maxHeight: '80%', objectFit: 'contain' }}
						/>
					</View>
					<Text style={styles.footer} fixed render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
				</Page>
			)}

			{data.capturedPhoto && (
				<Page size="A4" style={styles.page}>
					<Text style={styles.title}>ANEXO: FOTO DO CLIENTE</Text>
					<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
						<Image
							src={data.capturedPhoto}
							style={{ maxWidth: '100%', maxHeight: '80%', objectFit: 'contain' }}
						/>
					</View>
					<Text style={styles.footer} fixed render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
				</Page>
			)}
		</Document>
	);
};

export default ContractDocument;
