import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { WHATSAPP_LINK } from '../constants';

const Hero: React.FC = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-primary-950 pt-20">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary-600/20 rounded-full blur-[100px] opacity-50"></div>
          <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px]"></div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary-200 font-medium text-sm mb-8 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              Líder em Automação Comercial
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-8 tracking-tight">
              Automação inteligente para o <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-indigo-300">
                Sucesso do seu negócio!
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
              Desenvolvemos soluções inovadoras em sistemas e equipamentos para otimizar suas operações.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white text-primary-950 font-bold text-lg hover:bg-slate-100 transition-all hover:scale-105 active:scale-95"
              >
                Saiba Mais
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
              <a
                href="#products"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white/10 text-white font-semibold text-lg border border-white/10 backdrop-blur-sm hover:bg-white/20 transition-all"
              >
                Nossos Produtos
              </a>
            </div>

            <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 text-sm font-medium text-slate-400">
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary-400" />
                    <span>Suporte 24/7</span>
                </div>
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary-400" />
                    <span>Instalação Rápida</span>
                </div>
            </div>
          </div>
          
          {/* Right Content / Visual */}
          <div className="flex-1 w-full relative">
             <div className="relative z-10 rounded-2xl p-2 bg-gradient-to-br from-white/10 to-transparent border border-white/10 backdrop-blur-md shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426" 
                  alt="Dashboard BIXS" 
                  className="rounded-xl w-full h-auto shadow-inner"
                />
                
                {/* Floating Elements */}
                <div className="absolute top-10 -right-10 bg-white p-4 rounded-xl shadow-glow border border-slate-100 hidden md:block animate-[bounce_4s_infinite]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                            <ArrowRight className="w-5 h-5 text-green-600 rotate-[-45deg]" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-semibold">Vendas Hoje</p>
                            <p className="text-lg font-bold text-slate-900">R$ 14.250</p>
                        </div>
                    </div>
                </div>

                <div className="absolute -bottom-6 -left-6 bg-primary-600 text-white p-5 rounded-xl shadow-xl hidden md:block">
                     <p className="text-xs text-primary-200 uppercase font-bold mb-1">Satisfação</p>
                     <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold">98%</span>
                        <span className="text-sm opacity-80">dos clientes</span>
                     </div>
                </div>
             </div>
             
             {/* Decorative blob behind image */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-500/20 rounded-full blur-3xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;