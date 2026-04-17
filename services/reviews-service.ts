import { BackendFeatureUnavailableError } from "@/lib/http-errors";

export interface ReviewListItem {
  id: string;
  listingId: string;
  rentalId: string;
  reviewerId: string;
  reviewedId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export async function listReviews(): Promise<ReviewListItem[]> {
  throw new BackendFeatureUnavailableError("listagem de avaliacoes");
}
