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
  image: string;
  badge?: string;
}

export interface NavItem {
  label: string;
  href: string;
}