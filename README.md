# Desafios Frontend SIAPESQ

Este é um projeto frontend desenvolvido com [Next.js](https://nextjs.org), com foco em autenticação e visualização de dados científicos e acadêmicos. A aplicação integra com a API do [GBIF](https://www.gbif.org/developer/summary) (Global Biodiversity Information Facility) para exibição de dados de biodiversidade.

##  Tecnologias

- [Next.js](https://nextjs.org)
- [React](https://react.dev)
- [Firebase](https://firebase.google.com)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org)
- [GBIF API](https://www.gbif.org/developer/summary)

##  Funcionalidades

- Página de login e registro de usuários
- Integração com Firebase Auth e Firestore
- Consumo da API do GBIF para busca e exibição de dados científicos
- Rotas protegidas com autenticação
- Componentes reutilizáveis de UI (Navbar, Footer)
- API endpoints internos (`/api/register`, `/api/hello`)

##  Como rodar

Clone o repositório e instale as dependências:


npm install
Inicie o servidor local:
npm run dev

 Estrutura de Pastas
src/
├── Components/       # Componentes reutilizáveis (Navbar, Footer)
├── pages/            # Páginas do app (index, login, registro, info)
│   └── api/          # Rotas de API (hello.ts, register.ts)
├── styles/           # Estilos globais
├── firebase.ts       # Configuração do Firebase
└── firebaseAdmin.ts  # Administração Firebase para backend


 Deploy
Este projeto está configurado para deploy com Firebase Hosting. Veja os arquivos firebase.json e apphosting.yaml.




This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.
