// videoService.js

import axiosInstance from './axiosInstance';
import ApiError from './ApiError';

const prefix = 'videos/';

/**
 * Récupère toutes les vidéos avec pagination et filtres optionnels
 * @param {Object} params - Paramètres de requête (page, page_size, search, etc.)
 * @returns {Promise<Array|Object>} - Liste des vidéos ou objet paginé
 */
const getVideos = async (params = {}) => {
  try {
    const res = await axiosInstance.get(prefix, { params });
    return res.data;
  } catch (err) {
    throw new ApiError('Failed to fetch videos', err?.response?.status || 500, err?.response?.data);
  }
};

/**
 * Récupère une vidéo spécifique par ID
 * @param {number} id - ID de la vidéo
 * @returns {Promise<Object>} - Détails de la vidéo
 */
const getVideoById = async (id) => {
  try {
    const res = await axiosInstance.get(`${prefix}${id}/`);
    return res.data;
  } catch (err) {
    throw new ApiError('Failed to fetch video', err?.response?.status || 500, err?.response?.data);
  }
};

/**
 * Récupère les vidéos associées à un livre spécifique
 * @param {number} bookId - ID du livre
 * @returns {Promise<Array>} - Liste des vidéos du livre
 */
const getVideosByBook = async (bookId) => {
  try {
    const res = await axiosInstance.get(prefix, { params: { book: bookId } });
    return res.data;
  } catch (err) {
    throw new ApiError('Failed to fetch videos for book', err?.response?.status || 500, err?.response?.data);
  }
};

/**
 * Récupère toutes les vidéos en vedette (featured)
 * @param {Object} params - Paramètres de requête additionnels
 * @returns {Promise<Array|Object>} - Liste des vidéos en vedette
 */
const getFeaturedVideos = async (params = {}) => {
  try {
    const res = await axiosInstance.get(prefix, { 
      params: { featured: true, ...params } 
    });
    return res.data;
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
  getVideoById,
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
