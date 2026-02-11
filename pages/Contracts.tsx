import React, { useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ContractDocument from '../components/ContractDocument';
import { FileDown, CheckCircle, AlertCircle, FileText } from 'lucide-react';

interface FormData {
  contratante: string;
  cpfCnpj: string;
  endereco: string;
  contato: string;
  email: string;
  responsavel: string;
  cpfResponsavel: string;
}

const Contracts: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    contratante: '',
    cpfCnpj: '',
    endereco: '',
    contato: '',
    email: '',
    responsavel: '',
    cpfResponsavel: '',
  });

  const [isReady, setIsReady] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsReady(false); // Reset ready state on change to force user to review? Optional.
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsReady(true);
  };

  const inputClasses = "w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none text-slate-700 placeholder:text-slate-400";
  const labelClasses = "block text-sm font-semibold text-slate-700 mb-2";

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-100 text-primary-600 mb-6 shadow-inner">
                <FileText size={32} />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
              Geração de Contrato
            </h1>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Preencha os dados abaixo para gerar automaticamente o contrato de implantação de software pronto para assinatura.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="p-8 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Seção Empresa */}
                <div>
                    <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-6 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 text-xs flex items-center justify-center">1</span>
                        Dados da Empresa
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className={labelClasses}>Nome da Contratante (Razão Social)</label>
                            <input
                            type="text"
                            name="contratante"
                            value={formData.contratante}
                            onChange={handleChange}
                            className={inputClasses}
                            placeholder="Ex: Lusa Log & Distribuição LTDA"
                            required
                            />
                        </div>
                        <div>
                            <label className={labelClasses}>CPF / CNPJ</label>
                            <input
                            type="text"
                            name="cpfCnpj"
                            value={formData.cpfCnpj}
                            onChange={handleChange}
                            className={inputClasses}
                            placeholder="00.000.000/0001-00"
                            required
                            />
                        </div>
                        <div>
                            <label className={labelClasses}>Endereço Completo</label>
                            <input
                            type="text"
                            name="endereco"
                            value={formData.endereco}
                            onChange={handleChange}
                            className={inputClasses}
                            placeholder="Rua, Número, Bairro, Cidade - UF"
                            required
                            />
                        </div>
                        <div>
                            <label className={labelClasses}>Contato (Telefone)</label>
                            <input
                            type="text"
                            name="contato"
                            value={formData.contato}
                            onChange={handleChange}
                            className={inputClasses}
                            placeholder="(00) 0 0000-0000"
                            required
                            />
                        </div>
                        <div>
                            <label className={labelClasses}>E-mail</label>
                            <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={inputClasses}
                            placeholder="contato@empresa.com"
                            required
                            />
                        </div>
                    </div>
                </div>

                {/* Seção Responsável */}
                <div>
                    <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-6 flex items-center gap-2">
                         <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 text-xs flex items-center justify-center">2</span>
                        Dados do Responsável
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelClasses}>Nome do Responsável</label>
                            <input
                            type="text"
                            name="responsavel"
                            value={formData.responsavel}
                            onChange={handleChange}
                            className={inputClasses}
                            placeholder="Nome Completo"
                            required
                            />
                        </div>
                        <div>
                            <label className={labelClasses}>CPF do Responsável</label>
                            <input
                            type="text"
                            name="cpfResponsavel"
                            value={formData.cpfResponsavel}
                            onChange={handleChange}
                            className={inputClasses}
                            placeholder="000.000.000-00"
                            required
                            />
                        </div>
                    </div>
                </div>

                {/* Ações */}
                <div className="pt-6 border-t border-slate-50 flex flex-col md:flex-row items-center gap-4">
                  <button
                    type="submit"
                    className="w-full md:w-auto px-8 py-4 rounded-xl bg-primary-600 text-white font-bold text-lg hover:bg-primary-700 active:scale-95 transition-all shadow-lg shadow-primary-500/25 flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={20} />
                    Gerar PDF
                  </button>

                  {isReady && (
                    <PDFDownloadLink
                      document={<ContractDocument data={formData} />}
                      fileName={`Contrato_BIXS_${formData.contratante.replace(/\s+/g, '_')}.pdf`}
                      className="w-full md:w-auto px-8 py-4 rounded-xl bg-green-600 text-white font-bold text-lg hover:bg-green-700 active:scale-95 transition-all shadow-lg shadow-green-500/25 flex items-center justify-center gap-2 animate-in fade-in slide-in-from-left-4"
                    >
                      <FileDown size={20} />
                      Baixar Contrato
                    </PDFDownloadLink>
                  )}
                </div>
              </form>
            </div>
            
            <div className="bg-slate-50 p-6 md:p-8 border-t border-slate-100">
                <div className="flex items-start gap-4">
                    <AlertCircle className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
                    <div>
                        <h4 className="font-bold text-slate-900 mb-1">Informações Importantes</h4>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            Ao clicar em "Gerar PDF", um arquivo contendo o contrato padrão da BIXS Soluções será criado com os dados inseridos acima. Certifique-se de que todas as informações estejam corretas antes de imprimir e assinar.
                        </p>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contracts;