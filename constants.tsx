import React from 'react';
import { Lightbulb, TrendingUp, Users, Cpu, Wallet, Calendar, ShieldCheck } from 'lucide-react';
import { Specialty, Product } from './types';

export const WHATSAPP_LINK = "https://api.whatsapp.com/send?l=pt_BR&phone=553193585185";

export const SPECIALTIES: Specialty[] = [
  {
    id: '1',
    title: 'Inovação Constante',
    description: 'Sempre buscando as melhores tecnologias para seu negócio.',
    icon: <Lightbulb className="w-8 h-8 text-primary-600" />,
  },
  {
    id: '2',
    title: 'Eficiência Operacional',
    description: 'Otimize processos e reduza custos com nossas soluções.',
    icon: <TrendingUp className="w-8 h-8 text-primary-600" />,
  },
  {
    id: '3',
    title: 'Suporte Especializado',
    description: 'Conte com uma equipe pronta para atender suas necessidades.',
    icon: <Users className="w-8 h-8 text-primary-600" />,
  },
  {
    id: '4',
    title: 'Tecnologia de Ponta',
    description: 'Sistemas e equipamentos que impulsionam seu crescimento.',
    icon: <Cpu className="w-8 h-8 text-primary-600" />,
  },
];

// Ordem alterada para exibir Papi Fast e UAI PDV primeiro. Print APP readicionado.
export const PRODUCTS: Product[] = [
  {
    id: 'papi-fast',
    title: 'Papi Fast',
    description: 'Automação e controle para estabelecimentos com grande fluxo.',
    image: 'https://papifast.com.br/images/Design_sem_nome-removebg-preview.png',
    link: 'https://PapiFast.com.br',
    logoColor: 'bg-orange-50', // Cor de fundo personalizada
  },
  {
    id: 'uai-pdv',
    title: 'UAI PDV',
    description: 'Frente de caixa intuitiva e completa para seu varejo.',
    image: 'https://uaipdv.com.br/images/Logo7-removebg-preview.png',
    link: 'https://uaipdv.com.br',
    logoColor: 'bg-blue-50',
  },
  {
    id: 'uai-pdv-mais',
    title: 'UAI PDV Mais',
    description: 'Versão avançada com ainda mais recursos para sua gestão.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvsMXM793lO9BJtCIZAsNPJ0jqZiLBT5HMfg&s',
    link: 'https://uaipdv.com.br/#solutions',
    logoColor: 'bg-cyan-50',
  },
  {
    id: 'print-app',
    title: 'Print App',
    description: 'Imprima com facilidade Etiquetas, Comandas e Cartazes direto do Celular ou Tablet.',
    image: 'https://uaipdv.com.br/printapp/images/ImagemdoWhatsAppde2025-06-10s19.46.23_e676c340.jpg?rand=bdb2',
    link: 'https://uaipdv.com.br/printapp/',
    logoColor: 'bg-purple-50',
  },
  {
    id: 'pagweb',
    title: 'PagWeb',
    description: 'Solução de pagamentos web integrada e segura.',
    icon: (
      <div className="flex items-center gap-3">
        <Wallet className="w-16 h-16 text-slate-800" strokeWidth={2} />
        <span className="text-4xl font-bold text-slate-800 tracking-tight">PagWeb</span>
      </div>
    ),
    logoColor: 'bg-emerald-50',
    isComingSoon: true, // Sem link = Em breve
  },
  {
    id: 'agenda-ai',
    title: 'AgendaAi',
    description: 'Agendamento inteligente potencializado por IA.',
    icon: (
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
          <Calendar className="w-9 h-9" />
        </div>
        <span className="text-4xl font-bold text-slate-900">AgendaAi</span>
      </div>
    ),
    logoColor: 'bg-blue-50',
    isComingSoon: true, // Sem link = Em breve
  },
  {
    id: 'agente-mais',
    title: 'Agente+',
    description: 'Monitoramento e segurança avançada para seu sistema.',
    icon: (
      <div className="flex flex-col items-center">
        <div className="relative">
          <ShieldCheck className="w-20 h-20 text-primary-600" />
          <div className="absolute -top-1 -right-1 bg-green-500 rounded-full w-6 h-6 border-4 border-white"></div>
        </div>
        <span className="text-2xl font-bold text-primary-700 mt-2">Agente+</span>
      </div>
    ),
    logoColor: 'bg-violet-50',
    isComingSoon: true, // Sem link = Em breve
  },
];