import axiosInstance from './axiosInstance';
import ApiError from './ApiError';

const prefix = 'contact/';

const createMessage = async (payload) => {
  try {
    const res = await axiosInstance.post(prefix, payload);
    return res.data;
  } catch (err) {
    throw new ApiError('Failed to send message', err?.response?.status || 500, err?.response?.data);
  }
};

const getMessages = async (params = {}) => {
  try {
    const res = await axiosInstance.get(prefix, { params });
    return res.data;
  } catch (err) {
    throw new ApiError('Failed to fetch messages', err?.response?.status || 500, err?.response?.data);
  }
};

const getMessage = async (id) => {
  try {
    const res = await axiosInstance.get(`${prefix}${id}/`);
    return res.data;
  } catch (err) {
    throw new ApiError('Failed to fetch message', err?.response?.status || 500, err?.response?.data);
  }
};

const markAsRead = async (id) => {
  try {
    const res = await axiosInstance.post(`${prefix}${id}/mark_as_read/`);
    return res.data;
  } catch (err) {
    throw new ApiError('Failed to mark message as read', err?.response?.status || 500, err?.response?.data);
  }
};

const markAsUnread = async (id) => {
  try {
    const res = await axiosInstance.post(`${prefix}${id}/mark_as_unread/`);
    return res.data;
  } catch (err) {
    throw new ApiError('Failed to mark message as unread', err?.response?.status || 500, err?.response?.data);
  }
};

const markAsReplied = async (id, data) => {
  try {
    const res = await axiosInstance.post(`${prefix}${id}/mark_as_replied/`, data);
    return res.data;
  } catch (err) {
    throw new ApiError('Failed to mark message as replied', err?.response?.status || 500, err?.response?.data);
  }
};

const statistics = async () => {
  try {
    const res = await axiosInstance.get(`${prefix}statistics/`);
    return res.data;
  } catch (err) {
    throw new ApiError('Failed to fetch contact statistics', err?.response?.status || 500, err?.response?.data);
  }
};

const bulkMarkAsRead = async (ids) => {
  try {
    const res = await axiosInstance.post(`${prefix}bulk_mark_as_read/`, { message_ids: ids });
    return res.data;
  } catch (err) {
    throw new ApiError('Failed to bulk mark as read', err?.response?.status || 500, err?.response?.data);
  }
};

export default {
  createMessage,
  getMessages,
  getMessage,
  markAsRead,
  markAsUnread,
  markAsReplied,
  statistics,
  bulkMarkAsRead,
};
