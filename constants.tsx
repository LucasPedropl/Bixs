import React from 'react';
import { Lightbulb, TrendingUp, Users, Cpu } from 'lucide-react';
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

export const PRODUCTS: Product[] = [
  {
    id: 'uai-pdv-mais',
    title: 'UAI PDV Mais',
    description: 'Versão avançada com ainda mais recursos para sua gestão.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvsMXM793lO9BJtCIZAsNPJ0jqZiLBT5HMfg&s',
    badge: 'Premium',
  },
  {
    id: 'print-app',
    title: 'Print APP',
    description: 'Solução de impressão móvel para agilizar suas operações.',
    image: 'https://bixs.com.br/images/3.png',
  },
  {
    id: 'uai-pdv',
    title: 'UAI PDV',
    description: 'Frente de caixa intuitiva e completa para seu varejo.',
    image: 'https://uaipdv.com.br/images/Logo7-removebg-preview.png',
  },
  {
    id: 'papi-fast',
    title: 'Papi Fast',
    description: 'Automação e controle para estabelecimentos com grande fluxo.',
    image: 'https://papifast.com.br/images/Design_sem_nome-removebg-preview.png',
    badge: 'High Speed',
  },
];