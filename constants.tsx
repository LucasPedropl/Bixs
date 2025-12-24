import React from 'react';
import { Lightbulb, TrendingUp, Users, Cpu } from 'lucide-react';
import { Specialty, Product } from './types';

export const WHATSAPP_LINK = "https://api.whatsapp.com/send?l=pt_BR&phone=553193585185";

export const SPECIALTIES: Specialty[] = [
  {
    id: '1',
    title: 'Inovação Constante',
    description: 'Sempre buscando as melhores tecnologias e tendências globais para aplicar no seu negócio.',
    icon: <Lightbulb className="w-8 h-8 text-primary-600" />,
  },
  {
    id: '2',
    title: 'Eficiência Operacional',
    description: 'Otimize processos, reduza desperdícios e corte custos com nossas soluções integradas.',
    icon: <TrendingUp className="w-8 h-8 text-primary-600" />,
  },
  {
    id: '3',
    title: 'Suporte Especializado',
    description: 'Conte com uma equipe técnica pronta para atender suas necessidades com rapidez.',
    icon: <Users className="w-8 h-8 text-primary-600" />,
  },
  {
    id: '4',
    title: 'Tecnologia de Ponta',
    description: 'Sistemas e equipamentos robustos que impulsionam seu crescimento sustentável.',
    icon: <Cpu className="w-8 h-8 text-primary-600" />,
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 'uai-pdv-mais',
    title: 'UAI PDV Mais',
    description: 'Versão avançada com ainda mais recursos para sua gestão completa de vendas.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=800&h=600',
    badge: 'Premium',
  },
  {
    id: 'print-app',
    title: 'Print APP',
    description: 'Solução de impressão móvel para agilizar suas operações e reduzir filas.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800&h=600',
  },
  {
    id: 'uai-pdv',
    title: 'UAI PDV',
    description: 'Frente de caixa intuitiva, rápida e completa para o seu varejo diário.',
    image: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&q=80&w=800&h=600',
  },
  {
    id: 'papi-fast',
    title: 'Papi Fast',
    description: 'Automação e controle extremo para estabelecimentos com grande fluxo de clientes.',
    image: 'https://images.unsplash.com/photo-1594535182308-8ff2409d014a?auto=format&fit=crop&q=80&w=800&h=600',
    badge: 'High Speed',
  },
];