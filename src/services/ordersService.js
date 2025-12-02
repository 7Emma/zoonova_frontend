import axiosInstance from './axiosInstance';
import ApiError from './ApiError';

const prefix = 'orders/';

const createOrder = async (payload) => {
  try {
    const res = await axiosInstance.post(prefix, payload);
    return res.data;
  } catch (err) {
    throw new ApiError('Failed to create order', err?.response?.status || 500, err?.response?.data);
  }
};

const getOrders = async (params = {}) => {
  try {
    const res = await axiosInstance.get(prefix, { params });
    return res.data;
  } catch (err) {
    throw new ApiError('Failed to fetch orders', err?.response?.status || 500, err?.response?.data);
  }
};

const getOrder = async (id) => {
  try {
    const res = await axiosInstance.get(`${prefix}${id}/`);
    return res.data;
  } catch (err) {
    throw new ApiError('Failed to fetch order', err?.response?.status || 500, err?.response?.data);
  }
};

const updateOrderStatus = async (id, payload) => {
  try {
    const res = await axiosInstance.patch(`${prefix}${id}/update_status/`, payload);
    return res.data;
  } catch (err) {
    throw new ApiError('Failed to update order status', err?.response?.status || 500, err?.response?.data);
  }
};

const deleteOrder = async (id) => {
  try {
    const res = await axiosInstance.delete(`${prefix}${id}/`);
    return res.data;
  } catch (err) {
    throw new ApiError('Failed to delete order', err?.response?.status || 500, err?.response?.data);
  }
};

const getStatistics = async () => {
  try {
    const res = await axiosInstance.get(`${prefix}statistics/`);
    return res.data;
  } catch (err) {
    throw new ApiError('Failed to fetch order statistics', err?.response?.status || 500, err?.response?.data);
  }
};

const getCountries = async () => {
  try {
    const res = await axiosInstance.get(`${prefix}countries/`);
    return res.data;
  } catch (err) {
    throw new ApiError('Failed to fetch countries', err?.response?.status || 500, err?.response?.data);
  }
};

const downloadInvoice = async (id) => {
  try {
    const res = await axiosInstance.get(`${prefix}${id}/invoice/`, { responseType: 'blob' });
    return res.data;
  } catch (err) {
    throw new ApiError('Failed to download invoice', err?.response?.status || 500, err?.response?.data);
  }
};

export default {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  deleteOrder,
  getStatistics,
  downloadInvoice,
  getCountries,
};
