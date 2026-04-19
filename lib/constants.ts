export const APP_NAME = "Luguel Admin";

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Painel" },
  { href: "/users", label: "Usuarios" },
  { href: "/listings", label: "Anuncios" },
  { href: "/rentals", label: "Locacoes" },
  { href: "/reviews", label: "Avaliacoes" },
  { href: "/reports", label: "Denuncias" },
  { href: "/moderation", label: "Moderacao" },
  { href: "/boost", label: "Impulsionamento" },
  { href: "/settings", label: "Configuracoes" }
] as const;

export const POLLING_INTERVAL_MS = 30_000;
