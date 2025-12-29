import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PRODUCTS, WHATSAPP_LINK } from '../constants';
import { ChevronRight, ChevronLeft, ArrowRight, Lock } from 'lucide-react';

const Products: React.FC = () => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(1);
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Determinar quantos itens mostrar baseado na largura da tela
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setItemsToShow(3); // Desktop
      else if (window.innerWidth >= 768) setItemsToShow(2); // Tablet
      else setItemsToShow(1); // Mobile
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const extendedProducts = [
    ...PRODUCTS.slice(-itemsToShow), 
    ...PRODUCTS,
    ...PRODUCTS.slice(0, itemsToShow) 
  ];

  const [realIndex, setRealIndex] = useState(itemsToShow);

  const moveCarousel = useCallback((direction: 'next' | 'prev') => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setRealIndex((prev) => {
      if (direction === 'next') return prev + 1;
      return prev - 1;
    });
  }, [isTransitioning]);

  useEffect(() => {
    if (!isTransitioning) return;

    const totalOriginal = PRODUCTS.length;
    
    const transitionEndHandler = () => {
      setIsTransitioning(false);
      if (realIndex >= totalOriginal + itemsToShow) {
        setRealIndex(itemsToShow + (realIndex - (totalOriginal + itemsToShow))); 
      }
      else if (realIndex < itemsToShow) {
        setRealIndex(totalOriginal + realIndex); 
      }
    };

    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('transitionend', transitionEndHandler);
    }

    return () => {
      if (carousel) {
        carousel.removeEventListener('transitionend', transitionEndHandler);
      }
    };
  }, [realIndex, itemsToShow, isTransitioning]);

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, [moveCarousel]);

  const startAutoPlay = () => {
    stopAutoPlay();
    // Velocidade aumentada para 2500ms (antes era 4000ms)
    autoPlayRef.current = setInterval(() => {
      moveCarousel('next');
    }, 2500);
  };

  const stopAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  };

  const handleManualNav = (direction: 'next' | 'prev') => {
    stopAutoPlay();
    moveCarousel(direction);
    startAutoPlay(); 
  };

  return (
    <section id="products" className="py-24 bg-white overflow-hidden relative">
      {/* Elementos decorativos de fundo */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-primary-50 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
              Ecossistema <br className="md:hidden"/>
              <span className="text-primary-600">de Soluções</span>
            </h2>
            <p className="text-slate-500 text-lg">
              Explore nossa linha completa de produtos desenvolvidos para potencializar cada aspecto do seu negócio.
            </p>
        </div>
        
        {/* Carousel Wrapper com Controles Laterais */}
        <div className="relative group">
            
            {/* Botão Anterior (Lateral Esquerda) - Desktop */}
            <button
              onClick={() => handleManualNav('prev')}
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -ml-4 lg:-ml-12 z-20 w-12 h-12 rounded-full bg-white border border-slate-100 shadow-lg text-slate-600 items-center justify-center hover:bg-primary-600 hover:text-white hover:scale-110 transition-all duration-300"
              aria-label="Anterior"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Viewport do Carrossel */}
            {/* Adicionado padding maior (py-10) e mascara de gradiente para evitar o corte visual brusco */}
            <div className="overflow-hidden py-10 -mx-4 px-4" style={{ 
                maskImage: 'linear-gradient(to right, transparent, black 2%, black 98%, transparent)',
                WebkitMaskImage: 'linear-gradient(to right, transparent, black 2%, black 98%, transparent)' 
            }}>
                <div
                ref={carouselRef}
                className="flex"
                style={{
                    transform: `translateX(-${(realIndex * 100) / itemsToShow}%)`,
                    transition: isTransitioning ? 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)' : 'none',
                }}
                >
                {extendedProducts.map((product, index) => (
                    <div
                    key={`${product.id}-${index}`}
                    className="flex-shrink-0 px-3 md:px-4"
                    style={{ width: `${100 / itemsToShow}%` }}
                    >
                    <div 
                        className="group/card h-full relative bg-white rounded-[2rem] p-3 transition-all duration-500 hover:-translate-y-2"
                        onMouseEnter={stopAutoPlay}
                        onMouseLeave={startAutoPlay}
                    >
                        {/* Shadow Layer */}
                        <div className="absolute inset-0 bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 group-hover/card:shadow-2xl group-hover/card:shadow-primary-900/10 transition-shadow duration-500 border border-slate-50"></div>

                        <div className="relative z-10 flex flex-col h-full">
                        
                        {/* Image/Icon Container - Alterado para aspect-[3/2] (mais retangular/wide) */}
                        <div className={`relative aspect-[3/2] rounded-[1.5rem] overflow-hidden ${product.logoColor || 'bg-slate-50'} flex items-center justify-center mb-4 transition-colors duration-500 group-hover/card:bg-opacity-80`}>
                            {product.badge && (
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase text-slate-900 shadow-sm z-20">
                                {product.badge}
                            </div>
                            )}
                            
                            <div className="w-full h-full p-8 flex items-center justify-center">
                            {product.image ? (
                                <img
                                src={product.image}
                                alt={product.title}
                                className="w-full h-full object-contain transform group-hover/card:scale-110 transition-transform duration-700 drop-shadow-lg"
                                />
                            ) : (
                                <div className="transform group-hover/card:scale-110 transition-transform duration-700">
                                {product.icon}
                                </div>
                            )}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="px-3 pb-3 flex-grow flex flex-col">
                            <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover/card:text-primary-600 transition-colors">
                            {product.title}
                            </h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3">
                            {product.description}
                            </p>

                            <div className="mt-auto">
                            {product.isComingSoon ? (
                                <div className="w-full py-4 rounded-xl border border-slate-100 bg-slate-50 text-slate-400 font-semibold text-sm flex items-center justify-center gap-2 cursor-not-allowed select-none">
                                <Lock size={16} />
                                <span>Em Breve</span>
                                </div>
                            ) : (
                                <a
                                href={product.link || WHATSAPP_LINK}
                                target={product.link?.startsWith('#') ? '_self' : '_blank'}
                                rel="noopener noreferrer"
                                className="w-full py-4 rounded-xl bg-slate-900 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 group-hover/card:bg-primary-600 shadow-lg shadow-slate-900/10 hover:shadow-primary-600/30 overflow-hidden relative"
                                >
                                <span className="relative z-10 flex items-center gap-2">
                                    Acessar Produto
                                    <ArrowRight size={18} className="transition-transform duration-300 group-hover/card:translate-x-1" />
                                </span>
                                </a>
                            )}
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            </div>

            {/* Botão Próximo (Lateral Direita) - Desktop */}
            <button
              onClick={() => handleManualNav('next')}
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 -mr-4 lg:-mr-12 z-20 w-12 h-12 rounded-full bg-white border border-slate-100 shadow-lg text-slate-600 items-center justify-center hover:bg-primary-600 hover:text-white hover:scale-110 transition-all duration-300"
              aria-label="Próximo"
            >
              <ChevronRight size={24} />
            </button>
        </div>

        {/* Dots Indicators e Controles Mobile */}
        <div className="flex flex-col items-center gap-6 mt-4">
            {/* Dots */}
            <div className="flex justify-center gap-2">
                {PRODUCTS.map((_, idx) => {
                    const normalizedIndex = (realIndex - itemsToShow) % PRODUCTS.length;
                    const isActive = normalizedIndex === idx;
                    
                    return (
                        <button 
                            key={idx} 
                            onClick={() => {
                                stopAutoPlay();
                                setIsTransitioning(true);
                                // Lógica simplificada para ir direto ao slide (aproximação visual)
                                setRealIndex(itemsToShow + idx);
                                startAutoPlay();
                            }}
                            className={`h-2 rounded-full transition-all duration-300 ${isActive ? 'w-8 bg-primary-600' : 'w-2 bg-slate-200 hover:bg-slate-300'}`}
                            aria-label={`Ir para slide ${idx + 1}`}
                        />
                    )
                })}
            </div>

            {/* Mobile Nav Only */}
            <div className="flex md:hidden gap-4">
                <button
                onClick={() => handleManualNav('prev')}
                className="w-12 h-12 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 active:scale-95 shadow-sm"
                >
                <ChevronLeft size={24} />
                </button>
                <button
                onClick={() => handleManualNav('next')}
                className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-white active:scale-95 shadow-lg shadow-slate-900/20"
                >
                <ChevronRight size={24} />
                </button>
            </div>
        </div>

      </div>
    </section>
  );
};

export default Products;