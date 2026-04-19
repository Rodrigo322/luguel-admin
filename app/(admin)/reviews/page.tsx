import { ReviewsContent } from "@/modules/reviews/reviews-content";

export default function ReviewsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-4xl font-bold">Monitoramento de Reputacao</h1>
        <p className="text-shell-foreground-dim">Monitore feedbacks, avaliacoes suspeitas e sinais de abuso.</p>
      </div>
      <ReviewsContent />
    </div>
  );
}
