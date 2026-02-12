import React, { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import ContractDocument from '../components/ContractDocument';
import { FileDown, CheckCircle, AlertCircle, FileText, Loader2 } from 'lucide-react';

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

  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  // Funções auxiliares de máscara
  const formatCpfCnpj = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    
    if (cleanValue.length <= 11) {
      // CPF: 000.000.000-00
      return cleanValue
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
    } else {
      // CNPJ: 00.000.000/0000-00
      return cleanValue
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
    }
  };

  const formatPhone = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    // Remove formatação anterior para recalcular
    if (cleanValue.length <= 10) {
      // Fixo: (XX) XXXX-XXXX
      return cleanValue
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1');
    } else {
      // Celular: (XX) XXXXX-XXXX
      return cleanValue
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1');
    }
  };

  const formatCpf = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    // CPF: 000.000.000-00
    return cleanValue
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Aplicar máscaras baseadas no nome do campo
    if (name === 'cpfCnpj') {
        formattedValue = formatCpfCnpj(value);
    } else if (name === 'contato') {
        formattedValue = formatPhone(value);
    } else if (name === 'cpfResponsavel') {
        formattedValue = formatCpf(value);
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    // Se o usuário mudar algo, invalida o PDF anterior para forçar nova geração
    if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
        setPdfUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    
    try {
        // Gera o blob do PDF manualmente
        const blob = await pdf(<ContractDocument data={formData} />).toBlob();
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
    } catch (error) {
        console.error("Erro ao gerar PDF:", error);
        alert("Ocorreu um erro ao gerar o PDF. Tente novamente.");
    } finally {
        setIsGenerating(false);
    }
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
                            placeholder="Razão Social ou Nome Completo"
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
                            maxLength={18}
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
                            maxLength={15}
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
                            maxLength={14}
                            required
                            />
                        </div>
                    </div>
                </div>

                {/* Ações */}
                <div className="pt-6 border-t border-slate-50 flex flex-col md:flex-row items-center gap-4">
                  {!pdfUrl ? (
                      <button
                        type="submit"
                        disabled={isGenerating}
                        className={`w-full md:w-auto px-8 py-4 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg ${
                            isGenerating 
                            ? 'bg-slate-400 cursor-not-allowed' 
                            : 'bg-primary-600 hover:bg-primary-700 active:scale-95 shadow-primary-500/25'
                        }`}
                      >
                        {isGenerating ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                Gerando PDF...
                            </>
                        ) : (
                            <>
                                <CheckCircle size={20} />
                                Gerar Contrato
                            </>
                        )}
                      </button>
                  ) : (
                     <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                        <a
                            href={pdfUrl}
                            download={`Contrato_BIXS_${formData.contratante.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`}
                            className="w-full md:w-auto px-8 py-4 rounded-xl bg-green-600 text-white font-bold text-lg hover:bg-green-700 active:scale-95 transition-all shadow-lg shadow-green-500/25 flex items-center justify-center gap-2 animate-in fade-in slide-in-from-left-4"
                        >
                            <FileDown size={20} />
                            Baixar Contrato
                        </a>
                        <button
                            type="button"
                            onClick={() => {
                                URL.revokeObjectURL(pdfUrl);
                                setPdfUrl(null);
                            }}
                            className="px-6 py-4 rounded-xl bg-slate-100 text-slate-600 font-semibold hover:bg-slate-200 transition-colors"
                        >
                            Gerar Novo
                        </button>
                     </div>
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
                            Ao clicar em "Gerar Contrato", um arquivo PDF será gerado com os dados inseridos. Certifique-se de que todas as informações estejam corretas.
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