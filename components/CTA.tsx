import React from 'react';
import { WHATSAPP_LINK } from '../constants';
import { MessageCircle } from 'lucide-react';

const CTA: React.FC = () => {
  return (
    <section className="py-12 md:py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="rounded-[2rem] md:rounded-[2.5rem] bg-gradient-to-r from-primary-600 to-indigo-700 relative overflow-hidden shadow-2xl shadow-indigo-500/30">
            {/* Abstract Shapes */}
            <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-white opacity-5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-indigo-900 opacity-20 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none"></div>
            
            <div className="relative z-10 px-6 py-16 md:px-8 md:py-24 text-center">
              <h2 className="text-2xl md:text-5xl font-extrabold text-white mb-6 tracking-tight leading-tight">
                Transforme seu Negócio com a BIXS
              </h2>
              <p className="text-indigo-100 text-base md:text-xl max-w-2xl mx-auto mb-8 md:mb-10 font-light">
                Pronto para inovar? Fale conosco e descubra como podemos impulsionar seu crescimento.
              </p>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 md:px-10 md:py-5 rounded-full bg-white text-primary-700 font-bold text-base md:text-lg shadow-lg hover:bg-slate-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group w-full sm:w-auto"
              >
                <MessageCircle className="w-5 h-5 md:w-6 md:h-6 mr-2 group-hover:rotate-12 transition-transform" />
                Fale Conosco Agora!
              </a>
            </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;