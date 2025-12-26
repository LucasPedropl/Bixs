import React from 'react';
import { SPECIALTIES } from '../constants';

const Specialties: React.FC = () => {
  return (
    <section id="specialties" className="py-16 md:py-24 bg-white relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-16 gap-6 text-center md:text-left">
            <div className="max-w-2xl w-full">
                <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
                    Nossas Especialidades
                </h3>
            </div>
            <p className="text-slate-500 text-base md:text-lg max-w-md pb-2 w-full">
                A BIXS é sua parceira em inovação, oferecendo o que há de mais moderno em automação e tecnologia.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SPECIALTIES.map((item) => (
            <div
              key={item.id}
              className="group bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-100 hover:border-primary-200 hover:bg-white hover:shadow-xl hover:shadow-primary-900/5 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100/50 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-primary-200/50 transition-colors"></div>
              
              <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-6 md:mb-8 relative z-10 group-hover:scale-110 transition-transform duration-300">
                <div className="text-primary-600">
                  {item.icon}
                </div>
              </div>
              
              <h4 className="text-lg md:text-xl font-bold text-slate-900 mb-3 md:mb-4 relative z-10">
                {item.title}
              </h4>
              <p className="text-slate-600 leading-relaxed text-sm relative z-10">
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