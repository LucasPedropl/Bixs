import React from 'react';
import { ArrowRight } from 'lucide-react';
import { WHATSAPP_LINK } from '../constants';

const Hero: React.FC = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-primary-950 pt-24 md:pt-20 pb-12">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] md:w-[1000px] h-[600px] bg-primary-600/20 rounded-full blur-[80px] md:blur-[100px] opacity-50"></div>
          <div className="absolute bottom-0 right-0 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-indigo-500/10 rounded-full blur-[80px] md:blur-[120px]"></div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left w-full">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white/5 border border-white/10 text-primary-200 font-medium text-xs md:text-sm mb-6 md:mb-8 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              Líder em Automação Comercial
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.2] lg:leading-[1.1] mb-6 md:mb-8 tracking-tight">
              Automação inteligente para o <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-indigo-300">
                Sucesso do seu negócio!
              </span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-slate-300 mb-8 md:mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0 font-light px-2 lg:px-0">
              Desenvolvemos soluções inovadoras em sistemas e equipamentos para otimizar suas operações.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start w-full sm:w-auto">
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-3.5 md:py-4 rounded-xl bg-white text-primary-950 font-bold text-base md:text-lg hover:bg-slate-100 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-white/10"
              >
                Saiba Mais
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
              <a
                href="#products"
                className="inline-flex items-center justify-center px-8 py-3.5 md:py-4 rounded-xl bg-white/10 text-white font-semibold text-base md:text-lg border border-white/10 backdrop-blur-sm hover:bg-white/20 transition-all"
              >
                Nossos Produtos
              </a>
            </div>
          </div>
          
          {/* Right Content / Visual */}
          <div className="hidden lg:block flex-1 w-full relative mt-8 lg:mt-0 px-2 sm:px-0">
             <div className="relative z-10 rounded-2xl p-2 bg-gradient-to-br from-white/10 to-transparent border border-white/10 backdrop-blur-md shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426" 
                  alt="Dashboard BIXS" 
                  className="rounded-xl w-full h-auto shadow-inner"
                />
                
                {/* Floating Elements - Only Satisfaction Card kept */}
                <div className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 bg-primary-600 text-white p-4 md:p-5 rounded-xl shadow-xl hidden xs:block">
                     <p className="text-[10px] md:text-xs text-primary-200 uppercase font-bold mb-1">Satisfação</p>
                     <div className="flex items-baseline gap-1">
                        <span className="text-2xl md:text-3xl font-bold">98%</span>
                        <span className="text-xs md:text-sm opacity-80">dos clientes</span>
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