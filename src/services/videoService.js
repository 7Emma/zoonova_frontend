// videoService.js

import axiosInstance from './axiosInstance';
import ApiError from './ApiError';
import booksService from './booksService';

const prefix = 'videos/';

/**
 * Récupère toutes les vidéos en récupérant les livres et extrayant leurs vidéos
 * @param {Object} params - Paramètres de requête (page, page_size, search, etc.)
 * @returns {Promise<Array>} - Liste de toutes les vidéos de tous les livres
 */
const getVideos = async (params = {}) => {
  try {
    // Récupérer tous les livres avec leurs vidéos
    const booksData = await booksService.getBooks({ page_size: 100, ...params });
    const books = Array.isArray(booksData) ? booksData : booksData.results || [];

    // Extraire toutes les vidéos
    const allVideos = [];
    books.forEach((book) => {
      if (book.videos && Array.isArray(book.videos)) {
        book.videos.forEach((video) => {
          allVideos.push({
            ...video,
            book: book.id,
            bookSlug: book.slug,
            bookTitle: book.title,
          });
        });
      }
    });

    return allVideos;
  } catch (err) {
    throw new ApiError('Failed to fetch videos', err?.response?.status || 500, err?.response?.data);
  }
};

/**
 * Récupère les vidéos d'un livre spécifique
 * @param {number} bookId - ID du livre
 * @returns {Promise<Array>} - Liste des vidéos du livre
 */
const getVideosByBook = async (bookId) => {
  try {
    const res = await booksService.getBookById(bookId);
    if (res && res.videos && Array.isArray(res.videos)) {
      return res.videos.map((video) => ({
        ...video,
        book: bookId,
      }));
    }
    return [];
  } catch (err) {
    throw new ApiError('Failed to fetch videos for book', err?.response?.status || 500, err?.response?.data);
  }
};

/**
 * Récupère toutes les vidéos en vedette (featured) depuis les livres
 * @param {Object} params - Paramètres de requête additionnels
 * @returns {Promise<Array>} - Liste des vidéos en vedette
 */
const getFeaturedVideos = async (params = {}) => {
  try {
    // Récupérer tous les livres
    const booksData = await booksService.getBooks({ page_size: 100, ...params });
    const books = Array.isArray(booksData) ? booksData : booksData.results || [];

    // Extraire les vidéos en vedette
    const featuredVideos = [];
    books.forEach((book) => {
      if (book.videos && Array.isArray(book.videos)) {
        book.videos.forEach((video) => {
          // Si la vidéo a un champ featured ou si le livre est featured
          if (video.featured || book.featured) {
            featuredVideos.push({
              ...video,
              featured: video.featured !== false,
              book: book.id,
              bookSlug: book.slug,
              bookTitle: book.title,
            });
          }
        });
      }
    });

    return featuredVideos;
  } catch (err) {
    throw new ApiError('Failed to fetch featured videos', err?.response?.status || 500, err?.response?.data);
  }
};

/**
 * Crée une nouvelle vidéo
 * @param {Object} payload - Données de la vidéo (title, description, url, book, etc.)
 * @returns {Promise<Object>} - Vidéo créée
 */
const createVideo = async (payload) => {
  try {
    const res = await axiosInstance.post(prefix, payload);
    return res.data;
  } catch (err) {
    throw new ApiError('Failed to create video', err?.response?.status || 500, err?.response?.data);
  }
};

/**
 * Met à jour une vidéo existante
 * @param {number} id - ID de la vidéo
 * @param {Object} payload - Données à mettre à jour
 * @returns {Promise<Object>} - Vidéo mise à jour
 */
const updateVideo = async (id, payload) => {
  try {
    const res = await axiosInstance.patch(`${prefix}${id}/`, payload);
    return res.data;
  } catch (err) {
    throw new ApiError('Failed to update video', err?.response?.status || 500, err?.response?.data);
  }
};

/**
 * Supprime une vidéo
 * @param {number} id - ID de la vidéo
 * @returns {Promise<Object>} - Réponse du serveur
 */
const deleteVideo = async (id) => {
  try {
    const res = await axiosInstance.delete(`${prefix}${id}/`);
    return res.data;
  } catch (err) {
    throw new ApiError('Failed to delete video', err?.response?.status || 500, err?.response?.data);
  }
};

/**
 * Bascule le statut "featured" d'une vidéo
 * @param {number} id - ID de la vidéo
 * @returns {Promise<Object>} - Vidéo avec statut mis à jour
 */
const toggleFeatured = async (id) => {
  try {
    const res = await axiosInstance.post(`${prefix}${id}/toggle_featured/`);
    return res.data;
  } catch (err) {
    throw new ApiError('Failed to toggle featured status', err?.response?.status || 500, err?.response?.data);
  }
};

/**
 * Bascule le statut "active" d'une vidéo
 * @param {number} id - ID de la vidéo
 * @returns {Promise<Object>} - Vidéo avec statut mis à jour
 */
const toggleActive = async (id) => {
  try {
    const res = await axiosInstance.post(`${prefix}${id}/toggle_active/`);
    return res.data;
  } catch (err) {
    throw new ApiError('Failed to toggle active status', err?.response?.status || 500, err?.response?.data);
  }
};

/**
 * Formatte une vidéo pour l'affichage
 * Extrait l'ID de YouTube des différents formats d'URL
 * @param {Object} video - Objet vidéo du backend
 * @returns {Object} - Vidéo formatée
 */
const formatVideo = (video) => {
  if (!video) return null;

  let youtubeId = null;

  // Essayer d'extraire l'ID YouTube de différents formats d'URL
  if (video.url) {
    // Format: https://www.youtube.com/watch?v=ID
    const urlMatch = video.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
    if (urlMatch) {
      youtubeId = urlMatch[1];
    }
  }

  return {
    id: video.id,
    title: video.title || '',
    description: video.description || '',
    url: video.url || '',
    youtubeId: youtubeId,
    thumbnail: video.thumbnail || null,
    book: video.book || null,
    featured: video.featured || false,
    active: video.active !== false, // Par défaut actif
    order: video.order || 0,
    createdAt: video.created_at || null,
    updatedAt: video.updated_at || null,
  };
};

/**
 * Formate une liste de vidéos
 * @param {Array|Object} videos - Liste des vidéos (array ou objet paginé)
 * @returns {Array} - Vidéos formatées
 */
const formatVideos = (videos) => {
  let videoList = videos;

  // Gérer la pagination du backend
  if (videos && typeof videos === 'object' && 'results' in videos) {
    videoList = videos.results;
  }

  if (!Array.isArray(videoList)) {
    return [];
  }

  return videoList.map(formatVideo);
};

export default {
  getVideos,
  getVideosByBook,
  getFeaturedVideos,
  createVideo,
  updateVideo,
  deleteVideo,
  toggleFeatured,
  toggleActive,
  formatVideo,
  formatVideos,
};
