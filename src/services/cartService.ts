import { api } from './api';

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
}

export const cartService = {
  // Get user's cart
  async getCart(): Promise<Cart> {
    const response = await api.get('/cart');
    return response.data.data;
  },

  // Add item to cart
  async addToCart(productId: string, quantity = 1): Promise<Cart> {
    const response = await api.post('/cart/add', {
      productId,
      quantity,
    });
    return response.data.data;
  },

  // Update cart item quantity
  async updateCartItem(productId: string, quantity: number): Promise<Cart> {
    const response = await api.put(`/cart/${productId}`, {
      quantity,
    });
    return response.data.data;
  },

  // Remove item from cart
  async removeFromCart(productId: string): Promise<Cart> {
    const response = await api.delete(`/cart/${productId}`);
    return response.data.data;
  },

  // Clear cart
  async clearCart(): Promise<Cart> {
    const response = await api.delete('/cart');
    return response.data.data;
  },
};