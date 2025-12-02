import React, { useEffect, useState } from 'react';
import ordersService from '../services/ordersService';
import booksService from '../services/booksService';

const OrdersTester = () => {
  const [books, setBooks] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const b = await booksService.getBooks({ page_size: 5 });
        setBooks(Array.isArray(b.results) ? b.results : []);
      } catch (e) {
        console.warn('Cannot fetch books', e);
      }

      try {
        const c = await ordersService.getCountries();
        setCountries(Array.isArray(c) ? c : []);
      } catch (e) {
        console.warn('Cannot fetch countries', e);
      }
    })();
  }, []);

  const createTestOrder = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    if (!books.length || !countries.length) {
      setError('No books or countries available to create a test order.');
      setLoading(false);
      return;
    }

    const book = books[0];
    const country = countries[0];

    const payload = {
      email: 'test@example.com',
      first_name: 'Test',
      last_name: 'User',
      phone: '0123456789',
      voie: 'Rue de Test',
      numero_voie: '1',
      complement_adresse: '',
      code_postal: '75000',
      ville: 'Paris',
      country: country.id,
      items: [
        { book_id: book.id, quantity: 1 },
      ],
    };

    try {
      const res = await ordersService.createOrder(payload);
      setResult(res);
    } catch (err) {
      setError(err?.data || err?.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded bg-white">
      <h3 className="text-lg font-semibold">Orders Tester</h3>

      <div className="mt-3">
        <div className="text-sm text-slate-600">Fetched books: {books.length}</div>
        <div className="text-sm text-slate-600">Fetched countries: {countries.length}</div>
      </div>

      <div className="mt-4 flex gap-2">
        <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={createTestOrder} disabled={loading}>
          {loading ? 'Creating...' : 'Create test order'}
        </button>
      </div>

      {result && (
        <div className="mt-4 p-2 border rounded bg-green-50">
          <pre className="text-xs">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}

      {error && (
        <div className="mt-4 p-2 border rounded bg-red-50 text-sm text-red-700">
          <pre className="text-xs">{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}

    </div>
  );
};

export default OrdersTester;
