// booksService.js

import axiosInstance from './axiosInstance';
import ApiError from './ApiError';

const prefix = 'books/';

const getBooks = async (params = {}) => {
  try {
    // Définit page_size par défaut pour obtenir plus de résultats
    const finalParams = { page_size: 100, ...params };
    const res = await axiosInstance.get(prefix, { params: finalParams });
    return res.data;
  } catch (err) {
    throw new ApiError('Failed to fetch books', err?.response?.status || 500, err?.response?.data);
  }
};

const getBookById = async (id) => {
  try {
    // Cet endpoint récupère désormais tous les détails, y compris le tableau "images"
    const res = await axiosInstance.get(`${prefix}${id}/`);
    return res.data;
  } catch (err) {
    throw new ApiError('Failed to fetch book', err?.response?.status || 500, err?.response?.data);
  }
};

// Stratégie révisée : Récupérer tous les livres et trouver par slug exact
const getBookBySlug = async (slug) => {
  if (!slug) return null;

  try {
    // 1. Récupérer la liste des livres (sans filtre search car le slug n'est pas dans les champs recherchables)
    const listRes = await getBooks({ page_size: 100 });
    
    // Rechercher l'objet avec le slug exact
    const results = Array.isArray(listRes) ? listRes : (listRes.results || []);
    const foundBookInList = results.find(b => b.slug === slug);

    if (foundBookInList) {
      const bookId = foundBookInList.id;
      // 2. Utiliser l'ID pour obtenir l'objet complet détaillé (qui inclut images et métadonnées)
      return await getBookById(bookId);
    }

    return null; // Non trouvé

  } catch (err) {
    // Capture les erreurs de la chaîne de promesses (getBooks ou getBookById)
    throw new ApiError('Failed to fetch book by slug', err?.response?.status || 500, err?.response?.data);
  }
};


const createBook = async (payload) => {
// ... (reste inchangé)
  try {
    const res = await axiosInstance.post(prefix, payload);
    return res.data;
  } catch (err) {
    throw new ApiError('Failed to create book', err?.response?.status || 500, err?.response?.data);
  }
};

const updateBook = async (id, payload) => {
// ... (reste inchangé)
  try {
    const res = await axiosInstance.patch(`${prefix}${id}/`, payload);
    return res.data;
  } catch (err) {
    throw new ApiError('Failed to update book', err?.response?.status || 500, err?.response?.data);
  }
};

const deleteBook = async (id) => {
// ... (reste inchangé)
  try {
    const res = await axiosInstance.delete(`${prefix}${id}/`);
    return res.data;
  } catch (err) {
    throw new ApiError('Failed to delete book', err?.response?.status || 500, err?.response?.data);
  }
};

const getBookImages = async (id) => {
// ... (reste inchangé)
  try {
    const res = await axiosInstance.get(`${prefix}${id}/images/`);
    return res.data;
  } catch (err) {
    throw new ApiError('Failed to fetch book images', err?.response?.status || 500, err?.response?.data);
  }
};

const addBookImage = async (id, formData) => {
// ... (reste inchangé)
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
// ... (reste inchangé)
  try {
    const res = await axiosInstance.delete(`${prefix}${bookId}/images/${imageId}/`);
    return res.data;
  } catch (err) {
    throw new ApiError('Failed to delete image', err?.response?.status || 500, err?.response?.data);
  }
};

const addBookVideo = async (id, payload) => {
// ... (reste inchangé)
  try {
    const res = await axiosInstance.post(`${prefix}${id}/add_video/`, payload);
    return res.data;
  } catch (err) {
    throw new ApiError('Failed to add video', err?.response?.status || 500, err?.response?.data);
  }
};

const deleteBookVideo = async (bookId, videoId) => {
// ... (reste inchangé)
  try {
    const res = await axiosInstance.delete(`${prefix}${bookId}/videos/${videoId}/`);
    return res.data;
  } catch (err) {
    throw new ApiError('Failed to delete video', err?.response?.status || 500, err?.response?.data);
  }
};

const toggleActive = async (id) => {
// ... (reste inchangé)
  try {
    const res = await axiosInstance.post(`${prefix}${id}/toggle_active/`);
    return res.data;
  } catch (err) {
    throw new ApiError('Failed to toggle active', err?.response?.status || 500, err?.response?.data);
  }
};

const toggleFeatured = async (id) => {
// ... (reste inchangé)
  try {
    const res = await axiosInstance.post(`${prefix}${id}/toggle_featured/`);
    return res.data;
  } catch (err) {
    throw new ApiError('Failed to toggle featured', err?.response?.status || 500, err?.response?.data);
  }
};

const updateStock = async (id, payload) => {
// ... (reste inchangé)
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