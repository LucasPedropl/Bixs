import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Registro de fontes (opcional, usando Helvetica padrão para simplificar, mas idealmente usaria fontes customizadas)
// Font.register({ family: 'Inter', src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.ttf' });

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    lineHeight: 1.5,
    color: '#000',
  },
  headerContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  logo: {
    width: 60,
    height: 60,
    objectFit: 'contain',
    marginRight: 10
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    textDecoration: 'underline',
    textAlign: 'center',
    marginBottom: 20,
    width: '100%',
  },
  section: {
    marginBottom: 10,
  },
  bold: {
    fontFamily: 'Helvetica-Bold',
    fontWeight: 'bold',
  },
  yellowHighlight: {
    backgroundColor: '#FFFF00',
  },
  fieldRow: {
    flexDirection: 'row',
    marginBottom: 5,
    flexWrap: 'wrap',
  },
  label: {
    fontFamily: 'Helvetica-Bold',
    color: '#FFD700', // Tentando simular o amarelo do PDF original no texto das labels
    marginRight: 4,
  },
  value: {
    fontFamily: 'Helvetica',
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
  list: {
    marginLeft: 15,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  bullet: {
    width: 10,
  },
  signatureSection: {
    marginTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureBlock: {
    width: '40%',
    borderTopWidth: 1,
    borderTopColor: '#000',
    paddingTop: 5,
    alignItems: 'center',
    textAlign: 'center',
  },
});

interface ContractData {
  contratante: string;
  cpfCnpj: string;
  endereco: string;
  contato: string;
  email: string;
  responsavel: string;
  cpfResponsavel: string;
}

interface ContractDocumentProps {
  data: ContractData;
}

const ContractDocument: React.FC<ContractDocumentProps> = ({ data }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Header Visual Fake - Logo Placeholder */}
        <View style={{ marginBottom: 20 }}>
             <Text style={{ fontSize: 16, fontFamily: 'Helvetica-Bold', color: '#3730a3' }}>Uai PDV / BIXS</Text>
        </View>

        <Text style={styles.title}>CONTRATO DE IMPLANTAÇÃO DE SOFTWARE</Text>

        <View style={styles.section}>
          <View style={styles.fieldRow}>
            <Text style={{ fontFamily: 'Helvetica-Bold', color: '#FACC15', marginRight: 4 }}>CONTRATANTE:</Text>
            <Text>{data.contratante}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={{ fontFamily: 'Helvetica-Bold', color: '#FACC15', marginRight: 4 }}>CPF/CNPJ:</Text>
            <Text>{data.cpfCnpj}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={{ fontFamily: 'Helvetica-Bold', color: '#FACC15', marginRight: 4 }}>ENDEREÇO:</Text>
            <Text>{data.endereco}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={{ fontFamily: 'Helvetica-Bold', color: '#FACC15', marginRight: 4 }}>CONTATO:</Text>
            <Text style={{ marginRight: 20 }}>{data.contato}</Text>
            <Text style={{ fontFamily: 'Helvetica-Bold', color: '#FACC15', marginRight: 4 }}>E-MAIL:</Text>
            <Text>{data.email}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={{ fontFamily: 'Helvetica-Bold', color: '#FACC15', marginRight: 4 }}>RESPONSÁVEL:</Text>
            <Text style={{ marginRight: 20 }}>{data.responsavel}</Text>
            <Text style={{ fontFamily: 'Helvetica-Bold', color: '#FACC15', marginRight: 4 }}>CPF:</Text>
            <Text>{data.cpfResponsavel}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.paragraph, styles.bold, { textDecoration: 'underline' }]}>
            CONTRATADO: BIX SOLUÇÕES COM CNPJ: 47.054.579/0001-39, REPRESENTADA NESTE CONTRATO PELA EMPRESA DO GRUPO UAI PDV - Unidade de Atendimento Integrado Para Ponto de Venda INSCRITA NO CNPJ:24.865.243/0001- 50.
          </Text>
          <Text style={styles.paragraph}>
            As partes acima identificadas têm, entre si, justas e acertadas o presente Contrato de Prestação de Serviços de instalação, locação, configuração de sistema para ponto de venda e automação, que se regerá pelas cláusulas seguintes e pelas condições descritas no presente contrato.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.clauseTitle}>Cláusula 1ª. O Presente Contrato</Text>
          <Text style={styles.paragraph}>
            Tem como OBJETO, a prestação de serviços e locação do sistema de automação para ponto de venda, realizado pelo CONTRATADO à CONTRATANTE, instalado/configurado na CONTRATANTE.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.clauseTitle}>Cláusula 2ª. Funções e Características</Text>
          <Text style={styles.paragraph}>
            A solução tem as seguintes funções e características, totalizando em módulos disponíveis com valores distintos ao CONTRATANTE:
          </Text>
          
          <Text style={[styles.bold, { marginTop: 5 }]}>Licença do Módulo Produção/ PDV:</Text>
          <Text>Vendas; Encerramento de Operador; Sangria.</Text>

          <Text style={[styles.bold, { marginTop: 5 }]}>Módulo Gerencial:</Text>
          <Text>Cadastro de Usuários; Cadastro de Colaborador; Cadastro de Produtos; Relatórios Gestão de Vendas.</Text>

          <Text style={[styles.bold, { marginTop: 5 }]}>Suporte a dúvidas:</Text>
          <Text>Telefone; Remoto; WhatsApp.</Text>
        </View>

        <View style={styles.section}>
             <Text style={styles.clauseTitle}>Disposições Gerais</Text>
             <Text style={styles.paragraph}>
                PARÁGRAFO PRIMEIRO: Caso a CONTRATANTE deseje rescindir o presente instrumento, antes de 30 (Trinta dias) pagará à CONTRATADA a título de multa, o equivalente a R$ 100,00 (Cem Reais) e QUITAR os títulos em aberto referente aos equipamentos e serviços.
             </Text>
             <Text style={styles.paragraph}>
                CLÁUSULA 3ª Após aprovação o pagamento deve ser realizado por meio eletrônico ou físico, CONTRATANTE e CONTRATADO. Dará início a disponibilidade da solução e treinamento.
             </Text>
             <Text style={styles.paragraph}>
                PARÁGRAFO TERCEIRO: O sistema de automação para ponto de venda compreende nos seguintes itens: 1 Sistema GERENCIAL e VENDAS na plataforma Windows e Android.
             </Text>
        </View>

        <View style={styles.section}>
            <Text style={styles.clauseTitle}>Valores</Text>
            <Text style={styles.paragraph}>
                PARÁGRAFO QUARTO: Os valores e taxas da solução contratada correspondem aos pontos:
            </Text>
             <View style={{ marginLeft: 10 }}>
                <Text>• Ativação e Configuração do Sistema Gerencial: R$ 150,00;</Text>
                <Text>• Número de licença ativa: 5 PDV: R$ 229,90</Text>
                <Text style={{ marginTop: 5, fontFamily: 'Helvetica-Bold' }}>Adesão UAI PDV Mais: R$ 379,90</Text>
            </View>
        </View>

        <View style={styles.section}>
             <Text style={styles.clauseTitle}>Prazos e Regras (Cláusula 12ª)</Text>
             <Text style={styles.paragraph}>
                1. Vencimento da mensalidade é todo dia 05, estendendo o prazo até o dia 15 do mês corrente;
             </Text>
             <Text style={styles.paragraph}>
                2. A licença ativada, entre o dia 1º até último dia do mês corrente, é cobrada o valor integral da mensalidade;
             </Text>
             <Text style={styles.paragraph}>
                3. O CONTRATADO disponibiliza o canal direto com seus clientes via telefone e WhatsApp;
             </Text>
             <Text style={styles.paragraph}>
                4. Cancelamento deve ser FORMALIZADO por WhatsApp ou e-mail.
             </Text>
        </View>
        
        <View style={styles.section}>
            <Text style={{ marginTop: 20, textAlign: 'center' }}>
                Belo Horizonte, {new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}.
            </Text>
        </View>

        <View style={styles.signatureSection}>
            <View style={styles.signatureBlock}>
                <Text style={styles.bold}>CONTRATADO</Text>
                <Text>BIX SOLUÇÕES</Text>
            </View>
            <View style={styles.signatureBlock}>
                <Text style={styles.bold}>CONTRATANTE</Text>
                <Text>{data.contratante || 'Cliente'}</Text>
            </View>
        </View>
      </Page>
    </Document>
  );
};

export default ContractDocument;