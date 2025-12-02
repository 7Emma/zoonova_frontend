import axiosInstance from './axiosInstance';
import ApiError from './ApiError';

const prefix = 'payments/';

const createCheckoutSession = async (orderId) => {
  try {
    const res = await axiosInstance.post(`${prefix}create_checkout_session/`, { order_id: orderId });
    return res.data;
  } catch (err) {
    throw new ApiError('Failed to create checkout session', err?.response?.status || 500, err?.response?.data);
  }
};

const verifyPayment = async (orderId) => {
  try {
    const res = await axiosInstance.get(`${prefix}verify_payment/`, { params: { order_id: orderId } });
    return res.data;
  } catch (err) {
    throw new ApiError('Failed to verify payment', err?.response?.status || 500, err?.response?.data);
  }
};

const listPayments = async (params = {}) => {
  try {
    const res = await axiosInstance.get(prefix, { params });
    return res.data;
  } catch (err) {
    throw new ApiError('Failed to list payments', err?.response?.status || 500, err?.response?.data);
  }
};

export default {
  createCheckoutSession,
  verifyPayment,
  listPayments,
};
