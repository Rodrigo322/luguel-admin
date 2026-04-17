import { ListingsContent } from "@/modules/listings/listings-content";

export default function ListingsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-4xl font-bold">Listing Management</h1>
        <p className="text-shell-foreground-dim">Controle anuncios, risco operacional e acoes administrativas.</p>
      </div>
      <ListingsContent />
    </div>
  );
}
