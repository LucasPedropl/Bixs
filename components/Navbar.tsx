import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { WHATSAPP_LINK } from '../constants';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Bloquear o scroll do corpo quando o menu mobile estiver aberto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: 'Início', href: '#home' },
    { name: 'Soluções', href: '#specialties' },
    { name: 'Produtos', href: '#products' },
  ];

  // Lógica de cores para a Navbar principal (Desktop/Estado Fechado)
  const useDarkTheme = isScrolled;

  return (
    <>
      {/* Barra de Navegação Principal */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          useDarkTheme
            ? 'bg-white/90 backdrop-blur-md border-b border-slate-200 py-3 shadow-sm'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo Principal */}
            <a href="#" className="flex items-center gap-2.5 group">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg transition-all duration-300 ${useDarkTheme ? 'bg-primary-600 text-white' : 'bg-white text-primary-600'}`}>
                B
              </div>
              <span className={`text-2xl font-bold tracking-tight transition-colors duration-300 ${useDarkTheme ? 'text-slate-900' : 'text-white'}`}>
                BIXS
              </span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              <div className={`flex space-x-1 mr-6 px-4 py-2 rounded-full ${isScrolled ? 'bg-slate-100/50' : 'bg-white/10 backdrop-blur-sm border border-white/10'}`}>
                  {navLinks.map((link) => (
                  <a
                      key={link.name}
                      href={link.href}
                      className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-300 hover:bg-white hover:text-primary-600 ${
                      isScrolled ? 'text-slate-600' : 'text-white'
                      }`}
                  >
                      {link.name}
                  </a>
                  ))}
              </div>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg ${
                    isScrolled 
                    ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-primary-500/30' 
                    : 'bg-white text-primary-600 hover:bg-slate-50 shadow-white/20'
                }`}
              >
                Fale Conosco
              </a>
            </div>

            {/* Mobile Menu Trigger Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className={`p-2 rounded-lg backdrop-blur-sm transition-colors ${
                    useDarkTheme ? 'text-slate-900 bg-slate-100' : 'text-white bg-white/10'
                }`}
                aria-label="Abrir menu"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 
        MENU MOBILE REIMAGINADO 
        Overlay de tela cheia que sobrepõe tudo (z-60)
      */}
      <div 
        className={`fixed inset-0 z-[60] bg-white flex flex-col transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          isMobileMenuOpen 
            ? 'opacity-100 translate-y-0 visible' 
            : 'opacity-0 translate-y-4 invisible pointer-events-none'
        }`}
      >
        {/* Background Decorativo Mobile */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100 rounded-full blur-3xl -mr-20 -mt-20 opacity-50 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-100 rounded-full blur-3xl -ml-20 -mb-20 opacity-50 pointer-events-none"></div>

        {/* Header do Menu Mobile (Logo + Fechar) */}
        <div className="flex justify-between items-center p-4 sm:px-6 py-6 border-b border-slate-100 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
              B
            </div>
            <span className="text-2xl font-bold text-slate-900">
              BIXS
            </span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors"
            aria-label="Fechar menu"
          >
            <X size={24} />
          </button>
        </div>

        {/* Links do Menu Mobile */}
        <div className="flex-1 flex flex-col justify-center px-6 relative z-10">
          <nav className="flex flex-col space-y-6">
            {navLinks.map((link, index) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="group flex items-center justify-between text-3xl font-bold text-slate-900 hover:text-primary-600 transition-colors"
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <span>{link.name}</span>
                <ArrowRight className="w-6 h-6 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary-600" />
              </a>
            ))}
          </nav>
        </div>

        {/* Footer do Menu Mobile (CTA) */}
        <div className="p-6 pb-8 bg-slate-50 border-t border-slate-100 relative z-10">
          <p className="text-slate-500 text-sm mb-4 text-center">Precisa de ajuda com automação?</p>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full py-4 rounded-xl bg-primary-600 text-white font-bold text-lg shadow-xl shadow-primary-500/20 active:scale-95 transition-transform"
          >
            Fale Conosco Agora
          </a>
        </div>
      </div>
    </>
  );
};

export default Navbar;