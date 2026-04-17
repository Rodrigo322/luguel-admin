import { RentalsContent } from "@/modules/rentals/rentals-content";

export default function RentalsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-4xl font-bold">Rentals Tracking</h1>
        <p className="text-shell-foreground-dim">Acompanhe transacoes de locacao e atualize status operacionais.</p>
      </div>
      <RentalsContent />
    </div>
  );
}
