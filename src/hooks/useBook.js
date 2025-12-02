import { useState } from 'react';
import booksService from '../services/booksService';

export const useBooks = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBooks = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await booksService.getBooks(params);
      return res;
    } catch (err) {
      setError(err?.message || 'Erreur');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchBookBySlug = async (slug) => {
    setLoading(true);
    setError(null);
    try {
      const res = await booksService.getBookBySlug(slug);
      return res;
    } catch (err) {
      setError(err?.message || 'Erreur');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, fetchBooks, fetchBookBySlug, setError };
};

export default useBooks;
