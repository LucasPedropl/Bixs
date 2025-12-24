import React from 'react';
import { ArrowRight } from 'lucide-react';
import { WHATSAPP_LINK } from '../constants';

const Hero: React.FC = () => {
  return (
    <section id="home" className="relative min-h-[90vh] flex items-center overflow-hidden bg-white">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-primary-100 rounded-full blur-3xl opacity-50 mix-blend-multiply filter animate-pulse"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[600px] h-[600px] bg-blue-100 rounded-full blur-3xl opacity-50 mix-blend-multiply filter"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-2xl">
            <div className="inline-block px-4 py-1.5 rounded-full bg-primary-50 text-primary-600 font-semibold text-sm mb-6 border border-primary-100">
              Soluções Inovadoras para Varejo
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
              Automação inteligente para o <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-400">Sucesso do seu negócio</span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg">
              Desenvolvemos soluções completas em sistemas e equipamentos para otimizar suas operações, reduzir custos e aumentar sua lucratividade.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-primary-600 text-white font-bold text-lg shadow-lg shadow-primary-500/30 transition-all hover:bg-primary-700 hover:scale-105 active:scale-95"
              >
                Falar com Especialista
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
              <a
                href="#products"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white text-slate-700 font-bold text-lg border border-slate-200 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300"
              >
                Ver Produtos
              </a>
            </div>
          </div>
          
          <div className="relative hidden lg:block">
             <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/20 border border-slate-100 bg-white p-2">
                <img 
                  src="https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=1600&h=1200" 
                  alt="Dashboard de Vendas" 
                  className="rounded-xl w-full h-auto object-cover"
                />
                
                {/* Floating Stats Card */}
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-slate-100 flex items-center gap-4 animate-bounce" style={{ animationDuration: '3s' }}>
                   <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                     </svg>
                   </div>
                   <div>
                     <p className="text-xs text-slate-500 font-semibold uppercase">Eficiência</p>
                     <p className="text-lg font-bold text-slate-900">+125%</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;