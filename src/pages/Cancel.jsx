import React from "react";
import { Link, useSearchParams } from "react-router-dom";

const CancelPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background:
          "linear-gradient(135deg, #E8F5E3 0%, #FFF9E6 25%, #FFE8F0 50%, #E8D5FF 75%, #FFE5D9 100%)",
      }}
    >
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        {/* Icône d'annulation */}
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Paiement annulé
        </h1>
        
        <p className="text-gray-600 mb-6">
          Votre paiement a été annulé. Aucun montant n'a été débité de votre compte.
        </p>

        {orderId && (
          <p className="text-sm text-gray-500 mb-6">
            Commande #{orderId}
          </p>
        )}

        {/* Message informatif */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <p className="text-sm text-gray-600">
            Votre panier a été conservé. Vous pouvez reprendre votre commande à tout moment.
          </p>
        </div>

        {/* Boutons */}
        <div className="flex flex-col gap-3">
          <Link
            to="/cart"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Retourner au panier
          </Link>
          <Link
            to="/"
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Continuer mes achats
          </Link>
          <Link
            to="/contact"
            className="text-blue-600 hover:underline text-sm"
          >
            Besoin d'aide ? Contactez-nous
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CancelPage;
