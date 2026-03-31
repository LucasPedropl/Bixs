import React from 'react';
import {
	Page,
	Text,
	View,
	Document,
	StyleSheet,
	Image,
	Link,
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
		bottom: 30,
		left: 0,
		right: 0,
		textAlign: 'center',
	},
	footerLink: {
		color: '#0000EE',
		fontSize: 12,
		textDecoration: 'underline',
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

const LOGO_SRC =
	typeof window !== 'undefined'
		? `${window.location.origin}/logo.png`
		: '/logo.png';

const ContractDocument: React.FC<ContractDocumentProps> = ({ data }) => {
	const isEvent = data.segmento?.toLowerCase().includes('evento');

	const finalAdesaoNum =
		data.finalAdesao !== undefined ? data.finalAdesao : 0;
	const finalMensalidadeNum =
		data.finalMensalidade !== undefined ? data.finalMensalidade : 0;
	const totalValue = (finalAdesaoNum + finalMensalidadeNum)
		.toFixed(2)
		.replace('.', ',');

	return (
		<Document>
			<Page size="A4" style={styles.page}>
				<View
					style={[styles.header, { justifyContent: 'flex-start' }]}
					fixed
				>
					<Image style={styles.headerLogo} src={LOGO_SRC} />
				</View>
				<Text style={styles.footer} fixed>
					<Link
						style={styles.footerLink}
						src="https://www.uaipdv.com.br"
					>
						www.uaipdv.com.br
					</Link>
				</Text>

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
							{data.complemento
								? `, ${data.complemento}`
								: ''}, {data.bairro}, {data.cidade} - {data.uf},
							CEP: {data.cep}
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
					<Text style={[styles.paragraph, styles.bold]}>
						CONTRATADO: BIX SOLUÇÕES COM CNPJ: 47.054.579/0001-39 é
						responsável pelo produto UAI PDV Automação.
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
						Cláusula 2ª. A solução tem as seguintes funções e
						características, totalizando em módulos disponíveis com
						valores distintos ao CONTRATANTE:
					</Text>

					<Text style={[styles.bold, { marginTop: 5 }]}>
						Licença do Módulo Produção/ PDV:
					</Text>
					<Text>Vendas;</Text>
					<Text>Encerramento de Operador;</Text>
					<Text>Sangria.</Text>

					<Text style={[styles.bold, { marginTop: 5 }]}>
						Módulo Gerencial:
					</Text>
					<Text>Cadastro de Usuários;</Text>
					<Text>Cadastro de Colaborador;</Text>
					<Text>Cadastro de Produtos;</Text>
					<Text>Relatórios Gestão de Vendas.</Text>

					<Text style={[styles.bold, { marginTop: 5 }]}>
						Suporte a dúvidas:
					</Text>
					<Text>Telefone;</Text>
					<Text>Remoto;</Text>
					<Text>WhatsApp.</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.paragraph}>
						<Text style={styles.bold}>PARÁGRAFO PRIMEIRO:</Text>{' '}
						Caso a CONTRATANTE deseje rescindir o presente
						instrumento, antes de 30 (Trinta dias) pagará à
						CONTRATADA a título de multa, o equivalente a R$ 100,00
						(Cem Reais) e QUITAR os títulos em aberto referente aos
						equipamentos e serviços;
					</Text>
					<Text style={styles.paragraph}>
						<Text style={styles.bold}>CLÁUSULA 3ª</Text> Após
						aprovação o pagamento deve ser realizado por meio
						eletrônico ou físico, CONTRATANTE e CONTRATADO. Dará
						início a disponibilidade da solução no PARÁGRAFO QUARTO
						e treinamento, que será realizada no formato on-line na
						CONTRATANTE.
					</Text>
					<Text style={styles.paragraph}>
						<Text style={styles.bold}>PARÁGRAFO SEGUNDO:</Text>{' '}
						Havendo interesse de ambas as partes, o presente
						contrato poderá ser renovado, mediante a hipótese em que
						poderá haver reajuste dos valores e alteração dos
						serviços baseado no índice de correção do IGPM /Ano .
					</Text>
					<Text style={styles.paragraph}>
						<Text style={styles.bold}>PARÁGRAFO TERCEIRO:</Text> O
						sistema de automação para ponto de venda compreende nos
						seguintes itens:
						{'\n'}– 1 Sistema GERENCIAL e VENDAS na plataforma
						Windows e Android;
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.paragraph}>
						<Text style={styles.bold}>PARÁGRAFO QUARTO:</Text> Os
						valores e taxas da solução contratada correspondem aos
						pontos:
						{'\n'}• Ativação e Configuração do Sistema : R$:{' '}
						{finalAdesaoNum.toFixed(2).replace('.', ',')};{'\n'}•
						Mensalidade: R$:{' '}
						{finalMensalidadeNum.toFixed(2).replace('.', ',')};
						{'\n'}• Quantidade de PDVs : {data.qtdeLicencas || '1'};
						{'\n'}• Total: R$ {totalValue}
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.paragraph}>
						<Text style={styles.bold}>PARÁGRAFO QUINTO:</Text>{' '}
						Atraso no pagamento da mensalidade e/ou adesão,
						corresponde a 2,0% multa e 0,33 juros dia.
					</Text>
					<Text style={styles.paragraph}>
						<Text style={styles.bold}>Cláusula 4ª</Text> O
						CONTRATANTE é responsável pelas informações inseridas no
						software.
					</Text>
					<Text style={styles.paragraph}>
						<Text style={styles.bold}>Cláusula 5ª</Text> O
						CONTRATANTE é responsável pelo pagamento, refere-se a
						todos os serviços e equipamentos oferecidos pela
						CONTRATADO.
					</Text>
					<Text style={styles.paragraph}>
						<Text style={styles.bold}>Cláusula 6ª</Text> O
						CONTRATADO é responsável no fornecimento dos serviços
						prestados.
					</Text>
					<Text style={styles.paragraph}>
						<Text style={styles.bold}>Cláusula 9º</Text> O
						CONTRATADO é responsável na execução da Cláusula 2 º e
						Cláusula 3 º caso não cumpra o CONTRATANTE será isento,
						no valor que é citado no PARÁGRAFO QUARTO do item II.
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.paragraph}>
						<Text style={styles.bold}>Cláusula 10º</Text> O
						CONTRATANTE TEM O direito aos seguintes serviços que
						corresponde a mensalidade:
						{'\n'}1. Atualização/Correção do “Aplicativo” via acesso
						remoto;
						{'\n'}2. Disponibilização do sistema de GESTÃO em nuvem;
						{'\n'}3. Orientação técnica dos equipamentos
						homologados;
						{'\n'}4. Orientação técnica e funcional do sistema via
						telefônico;
						{'\n'}5. Suporte técnico via telefônico.
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.paragraph}>
						<Text style={styles.bold}>Cláusula 11º</Text> Serviços
						disponíveis oferecidos aos clientes, mediante APROVAÇÃO
						da proposta:
						{'\n'}1. Aquisição de nova licença e instalação física
						de equipamento;
						{'\n'}2. Desenvolvimento de nova função do “Aplicativo”;
						{'\n'}3. Serviço de consultoria funcional e técnica;
						{'\n'}4. Suporte presencial ou implantação presencial ao
						cliente, valor hora ou orçamento;
						{'\n'}5. Troca de Equipamentos;
						{'\n'}7. Novo treinamento para usuários.
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.paragraph}>
						<Text style={styles.bold}>
							Cláusula 12º Prazos e Regras:
						</Text>
						{'\n'}1. Vencimento da mensalidade é todo dia 05,
						estendendo o prazo até o dia 15 do mês corrente;
						{'\n'}2. A licença ativada, entre o dia 1º até último
						dia do mês corrente, é cobrada o valor integral da
						mensalidade;
						{'\n'}3. O CONTRATADO disponibiliza o canal direto com
						seus clientes via telefone e WhatsApp;
						{'\n'}4. Após 10 dias em Atraso, O CONTRATADO, tem o
						direito de restringir de forma total ou parcial os
						serviços. Sendo o dia 15 (Quinze) do mês corrente o
						prazo final para o pagamento, aplicando multas 2% e
						0,033% dia;
						{'\n'}5. Cancelamento do “Aplicativo”, deve ser
						FORMALIZADA por WhatsApp ou e-mail. A sua efetivação,
						cancelamento, ocorrerá MEDIANTE o pagamento da
						mensalidade do mês corrente;
						{'\n'}6. O preço da mensalidade é cobrado referente ao
						número de “Aplicativos” e módulos ativados para o
						cliente;
						{'\n'}7. A correção da mensalidade é aplicada ANUAL,
						sendo a data, assinatura/ACEITE, PARA aplicar o índice
						de correção IGPM;
						{'\n'}8. No caso de débitos, O CONTRATADO é facultativo
						a inclusão no SERASA/SPC;
						{'\n'}9. Os equipamentos tem garantia da Stone e chip de
						dados fornecido pela adquirencia;
						{'\n'}10. Mal uso dos equipamentos gera perda da
						garantia;
						{'\n'}11. É responsabilidade do CONTRATANTE, entregar o
						Certificado digital no formato A1 a CONTRATADA,
						necessário PARA ativar o módulo fiscal;
						{'\n'}12. As taxas veiculadas por parceiros e
						fornecedores dos serviços prestados, a CONTRATADA não
						tem responsabilidade referente as taxas. A CONTRATADA
						disponibiliza funções de integração e garante os
						recursos em módulos específicos, tais como: IFood, TEF e
						Stone;
						{'\n'}13. O aplicativo ou APK disponível é direcionado
						para dispositivos com sistema operacional Android;
						{'\n'}14. Título em aberto após 15 dias a CONTRATANTE
						deverá devolver todos os equipamentos relacionas;
						{'\n'}15. Liberação da plataforma, após pagamento de
						qualquer débito.
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.clauseTitle}>Forma de Pagamento</Text>
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'space-between',
							marginBottom: 5,
						}}
					>
						<Text style={{ width: '60%', ...styles.bold }}>
							Descrição
						</Text>
						<Text
							style={{
								width: '20%',
								textAlign: 'center',
								...styles.bold,
							}}
						>
							Quantidade
						</Text>
						<Text
							style={{
								width: '20%',
								textAlign: 'right',
								...styles.bold,
							}}
						>
							Total
						</Text>
					</View>
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'space-between',
							marginBottom: 3,
						}}
					>
						<Text style={{ width: '60%' }}>
							Item: A – Disponibilização
						</Text>
						<Text style={{ width: '20%', textAlign: 'center' }}>
							1
						</Text>
						<Text style={{ width: '20%', textAlign: 'right' }}>
							R$ {finalAdesaoNum.toFixed(2).replace('.', ',')}
						</Text>
					</View>
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'space-between',
							marginBottom: 10,
						}}
					>
						<Text style={{ width: '60%' }}>
							Item: B – Licença Equipamentos Mensalidade
						</Text>
						<Text style={{ width: '20%', textAlign: 'center' }}>
							{data.qtdeLicencas || '1'}
						</Text>
						<Text style={{ width: '20%', textAlign: 'right' }}>
							R${' '}
							{finalMensalidadeNum.toFixed(2).replace('.', ',')}
						</Text>
					</View>
					<Text style={[styles.bold, { marginTop: 10 }]}>
						Adesão UAI PDV Mais: R$ {totalValue}
					</Text>

					<Text style={{ marginTop: 10 }}>
						*OBS: POS Stone NÃO inclusa no contrato, deve ser
						contrato a parte
					</Text>
					<Text style={{ marginTop: 5 }}>
						Após os pagamentos realizados e confirmados em conta do
						CONTRATADO, é de responsabilidade da CONTRATANTE a
						Cláusula 10ª.
					</Text>
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
						<View style={{ height: 45 }} />
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
			</Page>

			{/* Páginas de Anexos */}
			{data.attachedDocument && (
				<Page size="A4" style={styles.page}>
					<View
						style={[
							styles.header,
							{ justifyContent: 'flex-start' },
						]}
						fixed
					>
						<Image style={styles.headerLogo} src={LOGO_SRC} />
					</View>
					<Text style={styles.footer} fixed>
						<Link
							style={styles.footerLink}
							src="https://www.uaipdv.com.br"
						>
							www.uaipdv.com.br
						</Link>
					</Text>
					<Text style={styles.title}>
						ANEXO: DOCUMENTO DO CLIENTE
					</Text>
					<View
						style={{
							flex: 1,
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<Image
							src={data.attachedDocument}
							style={{
								maxWidth: '100%',
								maxHeight: '80%',
								objectFit: 'contain',
							}}
						/>
					</View>
				</Page>
			)}

			{data.capturedPhoto && (
				<Page size="A4" style={styles.page}>
					<View
						style={[
							styles.header,
							{ justifyContent: 'flex-start' },
						]}
						fixed
					>
						<Image style={styles.headerLogo} src={LOGO_SRC} />
					</View>
					<Text style={styles.footer} fixed>
						<Link
							style={styles.footerLink}
							src="https://www.uaipdv.com.br"
						>
							www.uaipdv.com.br
						</Link>
					</Text>
					<Text style={styles.title}>ANEXO: FOTO DO CLIENTE</Text>
					<View
						style={{
							flex: 1,
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<Image
							src={data.capturedPhoto}
							style={{
								maxWidth: '100%',
								maxHeight: '80%',
								objectFit: 'contain',
							}}
						/>
					</View>
				</Page>
			)}
		</Document>
	);
};

export default ContractDocument;
