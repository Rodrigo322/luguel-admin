# Backend Gaps Mapeados para o Admin Web

O painel foi integrado aos endpoints reais disponiveis no backend atual (`backend/src/interfaces/http/routes/*`).

## Endpoints faltantes para fechamento total do escopo

1. Alteracao de role de usuario por admin
- Esperado pelo frontend: `PATCH /api/v1/admin/users/:userId/role`
- Disponivel hoje: apenas `PATCH /api/v1/users/me/role`

2. Aprovacao/Reprovacao de anuncio na moderacao
- Esperado pelo frontend:
  - `POST /api/v1/admin/listings/:listingId/approve`
  - `POST /api/v1/admin/listings/:listingId/reject`
- Disponivel hoje:
  - `POST /api/v1/admin/listings/:listingId/suspend`
  - `POST /api/v1/admin/listings/:listingId/archive`

3. Listagem de reviews para auditoria
- Esperado pelo frontend: `GET /api/v1/reviews`
- Disponivel hoje: apenas `POST /api/v1/reviews`

4. Listagem de boosts
- Esperado pelo frontend: `GET /api/v1/boosts`
- Disponivel hoje: apenas `POST /api/v1/boosts`

5. Listagem completa de reports
- Esperado pelo frontend: `GET /api/v1/admin/reports` (com filtros/paginacao)
- Disponivel hoje: apenas `GET /api/v1/admin/reports/critical`

## Comportamento atual do frontend para esses gaps

- Funcionalidades com endpoint ausente foram mantidas na UI com feedback explicito de indisponibilidade.
- Nenhum dado foi mockado.
- Nenhum fluxo foi hardcoded como sucesso sem endpoint real.
