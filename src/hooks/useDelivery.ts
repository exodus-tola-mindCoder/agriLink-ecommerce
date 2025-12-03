import { useState, useEffect } from 'react';
import { deliveryService, DeliveryOrder, DeliveryStats, EarningsData } from '../services/deliveryService';

export const useAvailableDeliveries = (page = 1, limit = 10, city?: string) => {
  const [data, setData] = useState<{ orders: DeliveryOrder[]; total: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await deliveryService.getAvailableDeliveries(page, limit, city);
        setData(response);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch available deliveries');
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, [page, limit, city]);

  return { data, loading, error, refetch: () => setLoading(true) };
};

export const useDeliveryHistory = (page = 1, limit = 10, status?: string, startDate?: string, endDate?: string) => {
  const [data, setData] = useState<{ orders: DeliveryOrder[]; total: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await deliveryService.getDeliveryHistory(page, limit, status, startDate, endDate);
        setData(response);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch delivery history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [page, limit, status, startDate, endDate]);

  return { data, loading, error, refetch: () => setLoading(true) };
};

export const useDeliveryStats = (period = '30d') => {
  const [data, setData] = useState<DeliveryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await deliveryService.getDeliveryStats(period);
        setData(response);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch delivery stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [period]);

  return { data, loading, error, refetch: () => setLoading(true) };
};

export const useEarnings = (period = '30d') => {
  const [data, setData] = useState<EarningsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await deliveryService.getEarnings(period);
        setData(response);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch earnings');
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, [period]);

  return { data, loading, error, refetch: () => setLoading(true) };
};