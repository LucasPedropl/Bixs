import React from 'react';
import { ArrowRight } from 'lucide-react';
import { WHATSAPP_LINK } from '../constants';

const Hero: React.FC = () => {
	const heroVideoSrc = 'hero-video.mp4';
	return (
		<section
			id="home"
			className="relative min-h-screen flex items-center overflow-hidden bg-primary-950 pt-24 md:pt-20 pb-12"
		>
			{/* Background Effects */}
			<div className="absolute inset-0 z-0 pointer-events-none">
				<div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] md:w-[1000px] h-[600px] bg-primary-600/20 rounded-full blur-[80px] md:blur-[100px] opacity-50"></div>
				<div className="absolute bottom-0 right-0 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-indigo-500/10 rounded-full blur-[80px] md:blur-[120px]"></div>

				{/* Grid Pattern */}
				<div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
			</div>

			<div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
				<div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
					{/* Left Content */}
					<div className="flex-1 text-center lg:text-left w-full lg:max-w-[50%]">
						<div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white/5 border border-white/10 text-primary-200 font-medium text-xs md:text-sm mb-6 md:mb-8 backdrop-blur-sm">
							<span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
							Líder em Automação Comercial
						</div>

						<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.2] lg:leading-[1.1] mb-6 md:mb-8 tracking-tight">
							Automação inteligente para{' '}
							<br className="hidden md:block" />o{' '}
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-indigo-300">
								Sucesso do seu negócio!
							</span>
						</h1>

						<p className="text-base sm:text-lg md:text-xl text-slate-300 mb-8 md:mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0 font-light px-2 lg:px-0">
							Desenvolvemos soluções inovadoras em sistemas e
							equipamentos para otimizar suas operações.
						</p>

						<div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start w-full sm:w-auto">
							<a
								href={WHATSAPP_LINK}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center justify-center px-8 py-3.5 md:py-4 rounded-xl bg-white text-primary-950 font-bold text-base md:text-lg hover:bg-slate-100 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-white/10"
							>
								Saiba Mais
								<ArrowRight className="ml-2 w-5 h-5" />
							</a>
							<a
								href="#products"
								className="inline-flex items-center justify-center px-8 py-3.5 md:py-4 rounded-xl bg-white/10 text-white font-semibold text-base md:text-lg border border-white/10 backdrop-blur-sm hover:bg-white/20 transition-all"
							>
								Nossos Produtos
							</a>
						</div>
					</div>

					{/* Right Content / Visual Composition */}
					<div className="hidden lg:flex flex-1 w-full justify-center items-center relative">
						{/* Decorative Background Blur */}
						<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-primary-500/20 to-indigo-500/20 rounded-full blur-[80px] -z-10"></div>

						{/* Single Notebook Video Container with Modern Frame */}
						<div className="relative w-full max-w-[650px] transform hover:scale-[1.02] transition-transform duration-700 ease-out">
							{/* Glassmorphism Border Container */}
							<div className="p-3 md:p-4 bg-white/5 rounded-[2rem] border border-white/10 backdrop-blur-sm shadow-2xl shadow-primary-900/50">
								<div className="relative aspect-video rounded-[1.5rem] overflow-hidden bg-slate-900 shadow-inner group">
									{/* Video Element */}
									<video
										autoPlay
										loop
										muted
										playsInline
										className="absolute inset-0 w-full h-full object-cover rounded-[1.5rem]"
									>
										<source
											src={heroVideoSrc}
											type="video/mp4"
										/>
										Seu navegador não suporta a tag de
										vídeo.
									</video>

									{/* Overlay brilho sutil */}
									<div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/10 pointer-events-none mix-blend-overlay"></div>
								</div>
							</div>

							{/* Decorative Elements */}
							<div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-primary-400/20 to-transparent rounded-full blur-xl animate-pulse"></div>
							<div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-tr from-indigo-500/20 to-transparent rounded-full blur-xl"></div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Hero;
