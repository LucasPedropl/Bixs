import React from 'react';
import { PRODUCTS, WHATSAPP_LINK } from '../constants';

const Products: React.FC = () => {
  return (
    <section id="products" className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Produtos em Destaque
            </h2>
            <p className="text-slate-600 text-lg">
              Ferramentas poderosas desenhadas para resolver os desafios reais do seu dia a dia.
            </p>
          </div>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 font-semibold hover:text-primary-700 flex items-center transition-colors"
          >
            Ver catálogo completo <span className="ml-2 text-xl">&rarr;</span>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {PRODUCTS.map((product) => (
            <div key={product.id} className="group relative bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 flex flex-col h-full hover:shadow-2xl transition-all duration-300">
              <div className="relative h-48 overflow-hidden bg-slate-200">
                {product.badge && (
                  <span className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded shadow-sm z-10 uppercase tracking-wide">
                    {product.badge}
                  </span>
                )}
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {product.title}
                </h3>
                <p className="text-slate-600 text-sm mb-6 flex-grow">
                  {product.description}
                </p>
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-lg border border-primary-200 text-primary-600 font-semibold text-center hover:bg-primary-50 transition-colors mt-auto"
                >
                  Solicitar Demo
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;