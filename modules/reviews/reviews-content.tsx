"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { useReviews } from "@/modules/reviews/queries";

export function ReviewsContent() {
  const reviewsQuery = useReviews();

  if (reviewsQuery.isLoading) {
    return <LoadingState label="Carregando avaliacoes..." />;
  }

  if (reviewsQuery.isError) {
    return <ErrorState message="Falha ao carregar reviews." />;
  }

  const reviews = reviewsQuery.data ?? [];

  if (reviews.length === 0) {
    return <EmptyState title="Sem reviews no momento" description="Nao ha avaliacoes para analise." />;
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id}>
          <div className="mb-2 flex items-center justify-between">
            <p className="font-semibold">Rating: {review.rating}/5</p>
            <Badge label={review.rating <= 2 ? "SUSPEITO" : "OK"} tone={review.rating <= 2 ? "danger" : "success"} />
          </div>
          <p className="text-sm text-shell-foreground-dim">{review.comment ?? "Sem comentario."}</p>
        </Card>
      ))}
    </div>
  );
}
