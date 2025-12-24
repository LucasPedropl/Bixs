import React from 'react';
import { SPECIALTIES } from '../constants';

const Specialties: React.FC = () => {
  return (
    <section id="specialties" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-primary-600 font-semibold tracking-wide uppercase text-sm mb-3">
            Por que escolher a BIXS
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            Nossas Especialidades
          </h3>
          <p className="text-slate-600 text-lg">
            A BIXS é sua parceira em inovação, oferecendo o que há de mais moderno em automação e tecnologia para o seu crescimento.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {SPECIALTIES.map((item) => (
            <div
              key={item.id}
              className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary-100 group"
            >
              <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary-600 transition-colors duration-300">
                <div className="text-primary-600 group-hover:text-white transition-colors duration-300">
                  {item.icon}
                </div>
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary-600 transition-colors">
                {item.title}
              </h4>
              <p className="text-slate-600 leading-relaxed text-sm">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Specialties;