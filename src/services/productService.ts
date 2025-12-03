import { api } from './api';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  images: Array<{
    url: string;
    publicId: string;
    isMain: boolean;
  }>;
  seller: {
    _id: string;
    businessName?: string;
    firstName: string;
    lastName: string;
    ratings: {
      average: number;
      count: number;
    };
  };
  stock: number;
  minOrderQuantity: number;
  maxOrderQuantity: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
  ratings: {
    average: number;
    count: number;
  };
  reviews: Array<{
    user: {
      _id: string;
      firstName: string;
      lastName: string;
    };
    rating: number;
    comment: string;
    createdAt: string;
  }>;
  viewCount: number;
  salesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  seller?: string;
  featured?: boolean;
}

export interface ProductsResponse {
  products: Product[];
  totalPages: number;
  currentPage: number;
  total: number;
}

export const productService = {
  // Get products with filters
  async getProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await api.get(`/products?${params}`);
    return response.data.data;
  },

  // Get single product
  async getProduct(productId: string): Promise<Product> {
    const response = await api.get(`/products/${productId}`);
    return response.data.data;
  },

  // Search products
  async searchProducts(query: string, page = 1, limit = 12): Promise<ProductsResponse> {
    const response = await api.get(`/products/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
    return response.data.data;
  },

  // Get featured products
  async getFeaturedProducts(limit = 8): Promise<Product[]> {
    const response = await api.get(`/products/featured?limit=${limit}`);
    return response.data.data;
  },

  // Get categories
  async getCategories(): Promise<Array<{ _id: string; count: number; avgPrice: number }>> {
    const response = await api.get('/products/categories');
    return response.data.data;
  },

  // Create product (seller only)
  async createProduct(productData: FormData): Promise<Product> {
    const response = await api.post('/products', productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  // Update product (seller only)
  async updateProduct(productId: string, productData: FormData): Promise<Product> {
    const response = await api.put(`/products/${productId}`, productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  // Delete product (seller only)
  async deleteProduct(productId: string): Promise<void> {
    await api.delete(`/products/${productId}`);
  },

  // Add review
  async addReview(productId: string, rating: number, comment?: string): Promise<Product> {
    const response = await api.post(`/products/${productId}/reviews`, {
      rating,
      comment,
    });
    return response.data.data;
  },

  // Get seller's products
  async getSellerProducts(page = 1, limit = 12, status = 'all'): Promise<ProductsResponse> {
    const response = await api.get(`/products/seller/my-products?page=${page}&limit=${limit}&status=${status}`);
    return response.data.data;
  },
};