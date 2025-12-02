import axiosInstance from './axiosInstance';
import ApiError from './ApiError';

const prefix = 'books/';

const getBooks = async (params = {}) => {
  try {
    const res = await axiosInstance.get(prefix, { params });
    return res.data;
  } catch (err) {
    throw new ApiError('Failed to fetch books', err?.response?.status || 500, err?.response?.data);
  }
};

const getBookById = async (id) => {
  try {
    const res = await axiosInstance.get(`${prefix}${id}/`);
    return res.data;
  } catch (err) {
    throw new ApiError('Failed to fetch book', err?.response?.status || 500, err?.response?.data);
  }
};

const getBookBySlug = async (slug) => {
  if (!slug) return null;

  // First, try to find the book in a short list request to avoid 404 noise
  try {
    const list = await getBooks({ page_size: 200 });
    const items = Array.isArray(list) ? list : (list.results || []);
    const found = items.find((b) => b.slug === slug);
    if (found) return found;
  } catch (e) {
    // ignore and try the slug endpoint next
  }

  // Fallback to the dedicated slug endpoint if available
  try {
    const res = await axiosInstance.get(`${prefix}slug/${slug}/`);
    return res.data;
  } catch (err) {
    // If slug endpoint 404 or other, try a wider list lookup as last resort
    if (err?.response?.status === 404) {
      try {
        const list = await getBooks({ page_size: 1000 });
        const items = Array.isArray(list) ? list : (list.results || []);
        return items.find((b) => b.slug === slug) || null;
      } catch (e) {
        throw new ApiError('Failed to fetch book by slug (fallback)', e?.response?.status || 500, e?.response?.data);
      }
    }
    throw new ApiError('Failed to fetch book by slug', err?.response?.status || 500, err?.response?.data);
  }
};

const createBook = async (payload) => {
  try {
    const res = await axiosInstance.post(prefix, payload);
    return res.data;
  } catch (err) {
    throw new ApiError('Failed to create book', err?.response?.status || 500, err?.response?.data);
  }
};

const updateBook = async (id, payload) => {
  try {
    const res = await axiosInstance.patch(`${prefix}${id}/`, payload);
    return res.data;
  } catch (err) {
    throw new ApiError('Failed to update book', err?.response?.status || 500, err?.response?.data);
  }
};

const deleteBook = async (id) => {
  try {
    const res = await axiosInstance.delete(`${prefix}${id}/`);
    return res.data;
  } catch (err) {
    throw new ApiError('Failed to delete book', err?.response?.status || 500, err?.response?.data);
  }
};

const getBookImages = async (id) => {
  try {
    const res = await axiosInstance.get(`${prefix}${id}/images/`);
    return res.data;
  } catch (err) {
    throw new ApiError('Failed to fetch book images', err?.response?.status || 500, err?.response?.data);
  }
};

const addBookImage = async (id, formData) => {
  try {
    const res = await axiosInstance.post(`${prefix}${id}/add_image/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  } catch (err) {
    throw new ApiError('Failed to upload image', err?.response?.status || 500, err?.response?.data);
  }
};

const deleteBookImage = async (bookId, imageId) => {
  try {
    const res = await axiosInstance.delete(`${prefix}${bookId}/images/${imageId}/`);
    return res.data;
  } catch (err) {
    throw new ApiError('Failed to delete image', err?.response?.status || 500, err?.response?.data);
  }
};

const addBookVideo = async (id, payload) => {
  try {
    const res = await axiosInstance.post(`${prefix}${id}/add_video/`, payload);
    return res.data;
  } catch (err) {
    throw new ApiError('Failed to add video', err?.response?.status || 500, err?.response?.data);
  }
};

const deleteBookVideo = async (bookId, videoId) => {
  try {
    const res = await axiosInstance.delete(`${prefix}${bookId}/videos/${videoId}/`);
    return res.data;
  } catch (err) {
    throw new ApiError('Failed to delete video', err?.response?.status || 500, err?.response?.data);
  }
};

const toggleActive = async (id) => {
  try {
    const res = await axiosInstance.post(`${prefix}${id}/toggle_active/`);
    return res.data;
  } catch (err) {
    throw new ApiError('Failed to toggle active', err?.response?.status || 500, err?.response?.data);
  }
};

const toggleFeatured = async (id) => {
  try {
    const res = await axiosInstance.post(`${prefix}${id}/toggle_featured/`);
    return res.data;
  } catch (err) {
    throw new ApiError('Failed to toggle featured', err?.response?.status || 500, err?.response?.data);
  }
};

const updateStock = async (id, payload) => {
  try {
    const res = await axiosInstance.patch(`${prefix}${id}/update_stock/`, payload);
    return res.data;
  } catch (err) {
    throw new ApiError('Failed to update stock', err?.response?.status || 500, err?.response?.data);
  }
};

export default {
  getBooks,
  getBookById,
  getBookBySlug,
  createBook,
  updateBook,
  deleteBook,
  getBookImages,
  addBookImage,
  deleteBookImage,
  addBookVideo,
  deleteBookVideo,
  toggleActive,
  toggleFeatured,
  updateStock,
};
