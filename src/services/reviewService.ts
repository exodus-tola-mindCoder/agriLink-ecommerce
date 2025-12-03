import { api } from './api';

export interface Review {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ReviewsResponse {
  reviews: Review[];
  totalReviews: number;
  averageRating: number;
  currentPage: number;
  totalPages: number;
}

export const reviewService = {
  // Get product reviews
  async getProductReviews(productId: string, page = 1, limit = 10): Promise<ReviewsResponse> {
    const response = await api.get(`/reviews/${productId}?page=${page}&limit=${limit}`);
    return response.data.data;
  },

  // Add product review
  async addReview(productId: string, rating: number, comment?: string): Promise<any> {
    const response = await api.post(`/reviews/${productId}`, {
      rating,
      comment,
    });
    return response.data.data;
  },

  // Update review
  async updateReview(productId: string, reviewId: string, rating: number, comment?: string): Promise<Review> {
    const response = await api.put(`/reviews/${productId}/${reviewId}`, {
      rating,
      comment,
    });
    return response.data.data;
  },

  // Delete review
  async deleteReview(productId: string, reviewId: string): Promise<void> {
    await api.delete(`/reviews/${productId}/${reviewId}`);
  },
};