export const APP_NAME = "Tactical Observer";

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/users", label: "Users" },
  { href: "/listings", label: "Ads" },
  { href: "/rentals", label: "Rentals" },
  { href: "/reviews", label: "Reviews" },
  { href: "/reports", label: "Reports" },
  { href: "/moderation", label: "Moderation" },
  { href: "/boost", label: "Boost" },
  { href: "/settings", label: "Settings" }
] as const;

export const POLLING_INTERVAL_MS = 30_000;
