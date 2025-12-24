import React from 'react';
import { PRODUCTS, WHATSAPP_LINK } from '../constants';
import { ChevronRight } from 'lucide-react';

const Products: React.FC = () => {
  return (
    <section id="products" className="py-24 bg-slate-50 border-t border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Nossos Produtos em Destaque
            </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {PRODUCTS.map((product) => (
            <div key={product.id} className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-primary-900/10 transition-all duration-500 border border-slate-100">
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-50/50 p-6 flex items-center justify-center">
                {product.badge && (
                  <span className="absolute top-4 left-4 bg-primary-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full z-10 uppercase tracking-wider shadow-lg">
                    {product.badge}
                  </span>
                )}
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-500 drop-shadow-sm"
                />
              </div>
              
              <div className="p-8 flex-grow flex flex-col">
                <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-primary-600 transition-colors">
                  {product.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-grow">
                  {product.description}
                </p>
                
                <div className="mt-auto">
                    <a
                    href={WHATSAPP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 rounded-xl flex items-center justify-center gap-2 bg-slate-50 text-slate-900 font-bold text-sm border border-slate-200 group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-600 transition-all duration-300"
                    >
                    Saiba Mais
                    <ChevronRight size={16} />
                    </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;