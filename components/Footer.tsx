import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (id: string) => {
    if (location.pathname !== '/') {
        navigate('/');
        // Small timeout to allow route change before scrolling
        setTimeout(() => {
            const element = document.getElementById(id);
            element?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    } else {
        const element = document.getElementById(id);
        element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-white text-slate-500 py-16 border-t border-slate-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div className="flex items-center gap-3 mb-6 md:mb-0">
             <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary-500/30">
                B
              </div>
              <span className="text-2xl font-bold text-slate-900">BIXS</span>
          </div>
          <div className="flex gap-8 text-sm font-medium">
             <button onClick={() => handleNavigation('home')} className="hover:text-primary-600 transition-colors">Início</button>
             <button onClick={() => handleNavigation('specialties')} className="hover:text-primary-600 transition-colors">Soluções</button>
             <button onClick={() => handleNavigation('products')} className="hover:text-primary-600 transition-colors">Produtos</button>
          </div>
        </div>
        
        <div className="w-full h-px bg-slate-100 mb-8"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-slate-400 gap-4">
          <p className="text-center md:text-left">Automação Inteligente para o Sucesso do seu Negócio.</p>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <p>&copy; {currentYear} BIXS. Todos os direitos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;