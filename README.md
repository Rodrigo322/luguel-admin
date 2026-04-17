# Luguel Admin Web

Painel administrativo web em **Next.js App Router** integrado ao backend real do projeto Luguel.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- TanStack Query
- Zod
- Axios

## Estrutura

```text
app/
components/
modules/
services/
hooks/
schemas/
lib/
```

## Modulos implementados

- Dashboard
- Users
- Listings
- Rentals
- Reviews
- Reports
- Moderation
- Boost
- Settings

## Autenticacao e seguranca

- Login email/senha via backend (`/api/v1/auth/signin`)
- Login social Google (`/api/v1/auth/social/google`)
- Protecao de rotas admin via `proxy.ts` + `app/(admin)/layout.tsx`
- Refresh de sessao periodico
- Logout
- Role check (`ADMIN` obrigatorio)

## Notificacoes

- Polling a cada 30s para:
  - anuncios pendentes
  - denuncias criticas
- Browser notifications com `Notification API`

## Configuracao

1. Copie variaveis:

```bash
copy .env.example .env.local
```

2. Ajuste backend origin se necessario:

```env
BACKEND_ORIGIN=http://localhost:3333
```

## Scripts

```bash
npm run dev
npm run typecheck
npm run lint
npm run build
```

## Importante

- Algumas funcionalidades dependem de endpoints ainda nao expostos no backend atual.
- Veja detalhes em [`BACKEND_GAPS.md`](./BACKEND_GAPS.md).
