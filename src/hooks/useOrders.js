import { useState } from 'react';
import ordersService from '../services/ordersService';

export const useOrders = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createOrder = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await ordersService.createOrder(payload);
      return res;
    } catch (err) {
      setError(err?.message || 'Erreur lors de la création de la commande');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getOrders = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await ordersService.getOrders(params);
      return res;
    } catch (err) {
      setError(err?.message || 'Erreur lors du chargement des commandes');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, createOrder, getOrders, setError };
};

export default useOrders;
