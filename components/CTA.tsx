import React from 'react';
import { WHATSAPP_LINK } from '../constants';
import { MessageCircle } from 'lucide-react';

const CTA: React.FC = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-primary-700 rounded-3xl overflow-hidden shadow-2xl relative">
            {/* Abstract Shapes */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary-500 rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-blue-400 rounded-full opacity-20 blur-3xl"></div>
            
            <div className="relative z-10 px-8 py-16 md:py-20 text-center">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Transforme seu Negócio com a BIXS
              </h2>
              <p className="text-primary-100 text-lg md:text-xl max-w-2xl mx-auto mb-10">
                Pronto para inovar? Fale conosco e descubra como nossas soluções de automação podem impulsionar seu crescimento hoje mesmo.
              </p>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-white text-primary-700 font-bold text-lg shadow-lg hover:bg-slate-100 transition-all hover:scale-105"
              >
                <MessageCircle className="w-6 h-6 mr-2" />
                Fale Conosco Agora
              </a>
            </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;