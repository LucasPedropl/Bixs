import { ReactNode } from 'react';

export interface Specialty {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  image?: string;
  icon?: ReactNode; // Para produtos que usam ícones/logos vetoriais
  logoColor?: string; // Cor de fundo para o placeholder da logo
  badge?: string;
  link?: string;
  isComingSoon?: boolean;
}

export interface NavItem {
  label: string;
  href: string;
}