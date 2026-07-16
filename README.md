# Bixs - Diretrizes de Desenvolvimento e Arquitetura

Bem-vindo ao **Bixs**! Este documento serve como guia de onboarding técnico para desenvolvedores e agentes de IA, descrevendo a stack tecnológica, a estrutura e o fluxo do portal de integração de pagamentos.

---

## 1. Visão Geral do Projeto
O Bixs é a aplicação encarregada da gestão de transações, tokenização e autorização de pagamentos, servindo como portal financeiro e gateway central de conciliação para os estabelecimentos comerciais integrados à UaiPDV.

---

## 2. Stack Tecnológica
* **Interface (Core)**: React (Vite) & TypeScript.
* **Estilização**: CSS modular e utilitários globais (`global.css`).
* **Estado e Domínios**: Mapeado através de features e componentes focados em segurança transacional.

---

## 3. Estrutura de Diretórios
```
apps/Bixs/
├── components/           # Componentes UI reutilizáveis
├── pages/                # Páginas da aplicação (Telas do portal e fluxos)
├── features/             # Submódulos e fluxos específicos por domínio
├── bix/                  # Lógicas internas e rotinas de controle do Bixs
├── utils/                # Utilitários de formatação e cálculos
├── types.ts              # Interfaces e contratos TypeScript compartilhados
├── App.tsx               # Roteador e ponto de entrada da aplicação
├── package.json          # Dependências e scripts npm
└── vite.config.ts        # Configurações do Vite
```

---

## 4. Diretrizes de Atuação
* **Segurança**: Como este projeto lida diretamente com credenciais, chaves e tokens transacionais, garanta que chaves privadas de homologação ou credenciais mockadas nunca sejam enviadas ao repositório git. Utilize variáveis de ambiente parametrizadas no `.env.local`.
* **Separação de Domínios**: Insira novos fluxos financeiros preferencialmente sob a pasta `features/` para manter a organização orientada a módulos.
