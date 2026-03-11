# NanoGPT — Setup & Deploy Guide

## Stack
- React 18 + Vite + TypeScript
- Tailwind CSS 3
- React Router v6
- Supabase (Auth + Database)
- Vercel (Hosting)

---

## 1. Supabase Setup

1. Acesse https://supabase.com e crie um novo projeto
2. Vá em **SQL Editor** e execute o arquivo `supabase/schema.sql` completo
3. Vá em **Project Settings → API** e copie:
   - `Project URL`
   - `anon public key`

---

## 2. Variáveis de Ambiente

Crie o arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://SEU_PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=sua_anon_key_aqui
```

---

## 3. Deploy no Vercel

### Opção A — Via CLI (recomendado)
```bash
npm install -g vercel
vercel login
vercel --prod
```

Quando perguntar sobre variáveis de ambiente, adicione:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Opção B — Via Dashboard Vercel
1. Acesse https://vercel.com/new
2. Importe o repositório GitHub
3. Em **Environment Variables**, adicione as duas variáveis acima
4. Clique em **Deploy**

---

## 4. Configuração Supabase Auth

No painel do Supabase:
1. Vá em **Authentication → URL Configuration**
2. Em **Site URL**, coloque a URL do seu deploy Vercel (ex: `https://nanogpt.vercel.app`)
3. Em **Redirect URLs**, adicione: `https://nanogpt.vercel.app/*`

---

## 5. Rodar Localmente

```bash
npm install
npm run dev
```

Acesse: http://localhost:5173

---

## Páginas da Aplicação

| Rota | Descrição |
|------|-----------|
| `/` | Landing page |
| `/login` | Login |
| `/register` | Cadastro |
| `/home` | Dashboard principal |
| `/power` | Meu poder de computação |
| `/task` | Centro de tarefas (LV0-LV6) |
| `/ai` | Chat com NanoGPT AI |
| `/profile` | Perfil do usuário |
| `/notifications` | Notificações |
| `/node-partner` | Parceiros de nó |
| `/tutorials` | Tutoriais |
| `/my/device` | Meu dispositivo |
| `/my/team` | Minha equipe |
| `/my/orders` | Meus pedidos |
| `/my/share` | Convidar amigos |
| `/my/kyc` | Verificação KYC |
| `/my/deposit` | Depósito |
| `/my/withdraw` | Saque |
| `/my/about-us` | Sobre nós |
