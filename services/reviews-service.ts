import { api } from "@/services/http";

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
  const response = await api.get<{ reviews: ReviewListItem[] }>("/reviews");
  return response.data.reviews;
}
