# Backend Gaps Mapeados para o Admin Web

Estado atualizado em 17/04/2026 apos etapas de correcao.

## Endpoints admin agora disponiveis

- `PATCH /api/v1/admin/users/:userId/role`
- `POST /api/v1/admin/listings/:listingId/approve`
- `POST /api/v1/admin/listings/:listingId/reject`
- `GET /api/v1/reviews`
- `GET /api/v1/boosts`
- `GET /api/v1/admin/reports` (filtros + paginacao)
- `GET /api/v1/admin/reports/critical`

## Gaps atuais

Sem gaps criticos de endpoint para os fluxos principais do painel admin.

## Observacoes

- O modulo de notificacoes ainda opera com polling no frontend; nao ha websocket dedicado no backend.
- A tela de reports agora usa listagem paginada real e filtros por status/risco/busca.
