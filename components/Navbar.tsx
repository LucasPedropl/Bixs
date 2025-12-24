import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
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

  const navLinks = [
    { name: 'Início', href: '#home' },
    { name: 'Soluções', href: '#specialties' },
    { name: 'Produtos', href: '#products' },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled
          ? 'glass-nav border-b border-white/20 py-3 shadow-sm'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group relative z-50">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg transition-all duration-300 ${isScrolled ? 'bg-primary-600 text-white' : 'bg-white text-primary-600'}`}>
              B
            </div>
            <span className={`text-2xl font-bold tracking-tight transition-colors duration-300 ${isScrolled ? 'text-slate-900' : 'text-white'}`}>
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

          {/* Mobile Menu Button */}
          <div className="md:hidden z-50">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-lg backdrop-blur-sm transition-colors ${
                  isScrolled || isMobileMenuOpen ? 'text-slate-900 bg-slate-100' : 'text-white bg-white/10'
              }`}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-40 bg-white transform transition-transform duration-300 ease-in-out md:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full justify-center px-8 space-y-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-2xl font-bold text-slate-800 hover:text-primary-600 transition-colors"
              >
                {link.name}
              </a>
            ))}
            <div className="h-px bg-slate-100 w-full my-4"></div>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center px-8 py-4 rounded-xl bg-primary-600 text-white font-bold text-lg shadow-xl shadow-primary-500/20 active:scale-95 transition-transform"
            >
              Fale Conosco
            </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;