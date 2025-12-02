import axiosInstance from './axiosInstance';
import ApiError from './ApiError';

const prefix = 'auth/';

const login = async ({ email, password }) => {
  try {
    const res = await axiosInstance.post(`${prefix}login/`, { email, password });
    return res.data;
  } catch (err) {
    throw new ApiError('Authentication failed', err?.response?.status || 500, err?.response?.data);
  }
};

const refreshToken = async (refresh) => {
  try {
    const res = await axiosInstance.post(`${prefix}token/refresh/`, { refresh });
    return res.data;
  } catch (err) {
    throw new ApiError('Token refresh failed', err?.response?.status || 500, err?.response?.data);
  }
};

const setInitialPassword = async (payload) => {
  try {
    const res = await axiosInstance.post(`${prefix}set-password/`, payload);
    return res.data;
  } catch (err) {
    throw new ApiError('Set password failed', err?.response?.status || 500, err?.response?.data);
  }
};

const requestPasswordReset = async (email) => {
  try {
    const res = await axiosInstance.post(`${prefix}password-reset/request/`, { email });
    return res.data;
  } catch (err) {
    throw new ApiError('Password reset request failed', err?.response?.status || 500, err?.response?.data);
  }
};

const resetPasswordConfirm = async (payload) => {
  try {
    const res = await axiosInstance.post(`${prefix}password-reset/confirm/`, payload);
    return res.data;
  } catch (err) {
    throw new ApiError('Password reset confirmation failed', err?.response?.status || 500, err?.response?.data);
  }
};

export default {
  login,
  refreshToken,
  setInitialPassword,
  requestPasswordReset,
  resetPasswordConfirm,
};
