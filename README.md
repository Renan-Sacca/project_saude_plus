# 🚀 Projeto React com TypeScript usando Vite

Este é um projeto base criado com **React**, **TypeScript** e **Vite**, ideal para quem está começando no desenvolvimento de interfaces modernas e quer um ambiente rápido e enxuto.

---

## 🛠️ Tecnologias

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) - Bundler super rápido
- [ESLint](https://eslint.org/) - Validação de código

---

## 📦 Como este projeto foi criado

```bash
# Criação do projeto
npm create vite@latest my-react-app -- --template react-ts

npm create vite@latest my-app -- --template react-ts

react
Typescript
# Acessar a pasta
cd my-react-app

# Instalar as dependências
npm install
npm install -D tailwindcss @tailwindcss/cli postcss autoprefixer
npm install @tailwindcss/postcss

remover projeto
Remove-Item -Recurse -Force node_modules, package-lock.json
▶️ Como rodar o projeto
npm run dev

Abra seu navegador e acesse:
📍 http://localhost:5173



📂 Estrutura de pastas
my-react-app/
├── public/               # Arquivos públicos (ex: imagens, favicon, etc)
│   └── vite.svg
├── src/                  # Código fonte principal
│   ├── assets/           # Imagens e outros assets
│   │   └── react.svg
│   ├── App.tsx           # Componente principal da aplicação
│   ├── App.css           # Estilos do App
│   ├── index.css         # Estilos globais
│   └── main.tsx          # Ponto de entrada do React
├── index.html            # HTML base da aplicação
├── tsconfig.json         # Configuração do TypeScript
├── vite.config.ts        # Configuração do Vite
├── package.json          # Dependências e scripts
└── README.md             # Este arquivo



✅ Scripts disponíveis
Comando	O que faz
npm run dev	Inicia o servidor de desenvolvimento
npm run build	Compila o projeto para produção
npm run preview	Roda o build localmente
npm run lint	Roda o ESLint para checar erros