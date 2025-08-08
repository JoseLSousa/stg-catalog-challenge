# STG Catalog Challenge

Este repositório contém o desafio técnico final da **STG Company** para criar um sistema de e-commerce completo com autenticação e integração via WhatsApp.

## 📖 Descrição
Construção de uma aplicação de catálogo de produtos que permite:
- Cadastro e login de usuários (proteção de rotas)
- Exibição de produtos em grid responsivo
- Visualização de detalhes de cada produto
- Adicionar, editar e remover itens do carrinho
- Finalização de pedido via link e mensagem no WhatsApp

## 🛠 Tecnologias
- **TypeScript**
- **Next.js**
- **Supabase** (Auth + Database)
- **Tailwind CSS**
- **Headledss-UI** 

## 🚀 Funcionalidades
1. **Autenticação**
   - Registro e login por email
   - Rotas protegidas e logout
2. **Catálogo**
   - Grid responsivo
   - Scroll horizontal em mobile
   - Truncamento de títulos longos
3. **Detalhes do Produto**
   - Página, descrição e preço
4. **Carrinho de Compras**
   - Lista de itens adicionados
   - Edição de quantidade
   - Total calculado dinamicamente
5. **Integração WhatsApp**
   - Geração de mensagem formatada
   - Link automático para o WhatsApp
   - Limpeza do carrinho após envio

## ⚙️ Como Executar Localmente
1. Clone este repositório
   ```bash
   git clone https://github.com/seu-usuario/stg-catalog-challenge.git
   cd stg-catalog-challenge
   ```
2. Instale dependências
   ```bash
   npm install
   # ou yarn install
   ```
3. Configure variáveis de ambiente em `.env.local`
   ```env
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
4. Execute em modo de desenvolvimento
   ```bash
   npm run dev
   # ou yarn dev
   ```
5. Acesse `http://localhost:3000`

## 📦 IA Utilizada
- ChatGPT (OpenAI) para auxílio na geração de trechos de código e refatoração

## ✅ Checklist de Funcionalidades
| Funcionalidade                     | Status  |
|------------------------------------|---------|
| Registro / Login                   | ✅       |
| Proteção de Rotas                  | ✅       |
| Logout                             | ✅       |
| Grid Responsivo de Produtos        | ✅       |
| Scroll Horizontal em Mobile        | ✅       |
| Truncamento de Títulos             | ✅       |
| Página de Detalhes                 | ✅       |
| Adicionar ao Carrinho              | ✅       |
| Edição de Quantidade               | ✅       |
| Carrinho de Compras                | ✅       |
| Integração e Envio via WhatsApp    | ✅       |

## 🌐 Deploy
Aplicação em produção disponível em: https://stg-catalog-challenge.vercel.app/