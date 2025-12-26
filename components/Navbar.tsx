import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, Home, Zap, Box, MessageCircle, ChevronRight } from 'lucide-react';
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

  // Configuração estendida para o menu mobile (ícones e descrições)
  const mobileLinks = [
    { 
      name: 'Início', 
      href: '#home', 
      icon: Home, 
      desc: 'Voltar ao topo da página' 
    },
    { 
      name: 'Soluções', 
      href: '#specialties', 
      icon: Zap, 
      desc: 'Conheça nossas especialidades' 
    },
    { 
      name: 'Produtos', 
      href: '#products', 
      icon: Box, 
      desc: 'Explore nosso catálogo completo' 
    },
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
        MENU MOBILE REDESENHADO 
      */}
      <div 
        className={`fixed inset-0 z-[60] bg-slate-50 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          isMobileMenuOpen 
            ? 'opacity-100 translate-y-0 visible' 
            : 'opacity-0 translate-y-4 invisible pointer-events-none'
        }`}
      >
        {/* Background Decorativo Mobile */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary-100/60 rounded-full blur-3xl -mr-20 -mt-20 opacity-70 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-100/60 rounded-full blur-3xl -ml-20 -mb-20 opacity-70 pointer-events-none"></div>

        {/* Header do Menu Mobile */}
        <div className="flex justify-between items-center p-4 py-5 bg-white/50 backdrop-blur-sm border-b border-slate-200/60 relative z-10">
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
            className="p-2.5 rounded-xl bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-sm border border-slate-100"
            aria-label="Fechar menu"
          >
            <X size={24} />
          </button>
        </div>

        {/* Links do Menu Mobile - Estilo Cartão */}
        <div className="flex-1 px-4 py-8 overflow-y-auto relative z-10">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6 pl-2">Navegação</p>
          <div className="space-y-4">
            {mobileLinks.map((link, index) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="group flex items-center p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-primary-100 active:scale-[0.98] transition-all duration-300"
                style={{ transitionDelay: `${index * 75}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors duration-300">
                  <link.icon size={24} />
                </div>
                <div className="ml-4 flex-1">
                  <span className="block text-lg font-bold text-slate-900 group-hover:text-primary-700 transition-colors">
                    {link.name}
                  </span>
                  <span className="block text-sm text-slate-500 font-medium">
                    {link.desc}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 group-hover:bg-primary-50 group-hover:text-primary-600 transition-all">
                   <ChevronRight size={20} />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Footer do Menu Mobile (CTA) */}
        <div className="p-6 pb-8 bg-white border-t border-slate-100 relative z-10 rounded-t-3xl shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]">
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full py-4 rounded-xl bg-primary-600 text-white font-bold text-lg shadow-xl shadow-primary-500/25 active:scale-95 transition-all hover:bg-primary-700 group"
          >
            <MessageCircle className="mr-2 group-hover:animate-bounce" size={20}/>
            Fale Conosco
          </a>
          <p className="text-slate-400 text-xs text-center mt-4">
            Segunda a Sexta, das 8h às 18h
          </p>
        </div>
      </div>
    </>
  );
};

export default Navbar;