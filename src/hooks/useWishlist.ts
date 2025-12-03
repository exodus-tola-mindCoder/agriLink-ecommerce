import { useState, useEffect } from 'react';
import { wishlistService, WishlistResponse } from '../services/wishlistService';

export const useWishlist = (page = 1, limit = 12) => {
  const [data, setData] = useState<WishlistResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await wishlistService.getWishlist(page, limit);
        setData(response);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch wishlist');
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [page, limit]);

  const refetch = () => {
    setLoading(true);
    setError(null);
  };

  return { data, loading, error, refetch };
};