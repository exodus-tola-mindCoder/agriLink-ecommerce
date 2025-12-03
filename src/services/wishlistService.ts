import { api } from './api';

export interface WishlistItem {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: Array<{ url: string; isMain: boolean }>;
  seller: {
    _id: string;
    businessName?: string;
    firstName: string;
    lastName: string;
  };
  stock: number;
  ratings: {
    average: number;
    count: number;
  };
  addedAt: string;
}

export interface WishlistResponse {
  items: WishlistItem[];
  totalPages: number;
  currentPage: number;
  total: number;
}

export const wishlistService = {
  // Get user's wishlist
  async getWishlist(page = 1, limit = 12): Promise<WishlistResponse> {
    const response = await api.get(`/users/wishlist?page=${page}&limit=${limit}`);
    return response.data.data;
  },

  // Add product to wishlist
  async addToWishlist(productId: string): Promise<{ wishlistCount: number }> {
    const response = await api.post('/users/wishlist', { productId });
    return response.data.data;
  },

  // Remove product from wishlist
  async removeFromWishlist(productId: string): Promise<{ wishlistCount: number }> {
    const response = await api.delete(`/users/wishlist/${productId}`);
    return response.data.data;
  },

  // Clear entire wishlist
  async clearWishlist(): Promise<void> {
    await api.delete('/users/wishlist');
  },
};