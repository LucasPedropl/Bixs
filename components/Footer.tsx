import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
             <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                B
              </div>
              <span className="text-2xl font-bold text-white">BIXS</span>
          </div>
          <p className="text-center md:text-right text-slate-400 max-w-md">
            Automação Inteligente para o Sucesso do seu Negócio.
          </p>
        </div>
        
        <div className="w-full h-px bg-slate-800 my-8"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-center text-sm">
          <p>&copy; {currentYear} BIXS. Todos os direitos reservados.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-primary-400 transition-colors">Política de Privacidade</a>
            <a href="#" className="hover:text-primary-400 transition-colors">Termos de Uso</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;