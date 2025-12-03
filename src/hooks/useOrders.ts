import { useState, useEffect } from 'react';
import { orderService, Order, OrdersResponse } from '../services/orderService';

export const useUserOrders = (page = 1, limit = 10, status?: string) => {
  const [data, setData] = useState<OrdersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await orderService.getUserOrders(page, limit, status);
        setData(response);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [page, limit, status]);

  return { data, loading, error, refetch: () => setLoading(true) };
};

export const useSellerOrders = (page = 1, limit = 10, status?: string) => {
  const [data, setData] = useState<OrdersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await orderService.getSellerOrders(page, limit, status);
        setData(response);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch seller orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [page, limit, status]);

  return { data, loading, error, refetch: () => setLoading(true) };
};

export const useOrder = (orderId: string) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await orderService.getOrder(orderId);
        setOrder(response);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch order');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  return { order, loading, error };
};