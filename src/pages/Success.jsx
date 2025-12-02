import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import paymentsService from "../services/paymentsService";
import ordersService from "../services/ordersService";

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);

  useEffect(() => {
    const loadOrderInfo = async () => {
      try {
        // Récupère l'order_id ou session_id depuis les paramètres
        let orderId = searchParams.get('order_id');
        const sessionId = searchParams.get('session_id');
        
        // Si on a un session_id mais pas d'order_id
        if (sessionId && !orderId) {
          orderId = sessionId;
        }
        
        if (!orderId) {
          setError('Pas de commande trouvée');
          setLoading(false);
          return;
        }

        // Vérifie le paiement et récupère les infos de la commande
        const paymentInfo = await paymentsService.verifyPayment(orderId);
        
        if (paymentInfo.order) {
          setOrder(paymentInfo.order);
          // Vide le panier une fois la commande confirmée
          localStorage.removeItem('cart');
          window.dispatchEvent(new Event('cart-updated'));
        } else if (paymentInfo.paid) {
          // Si payé mais pas d'order dans la réponse, créer un objet minimal
          setOrder({
            id: orderId,
            email: paymentInfo.email || '',
            total: paymentInfo.total || 0,
          });
          localStorage.removeItem('cart');
          window.dispatchEvent(new Event('cart-updated'));
        } else {
          setError('Commande non trouvée ou paiement non confirmé');
        }
      } catch (err) {
        console.error('Erreur lors du chargement de la commande:', err);
        setError('Erreur lors du chargement des informations');
      } finally {
        setLoading(false);
      }
    };

    loadOrderInfo();
  }, [searchParams]);

  const handleDownloadInvoice = async () => {
    if (!order) return;

    setDownloadingInvoice(true);
    try {
      const blob = await ordersService.downloadInvoice(order.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `facture_${order.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Erreur lors du téléchargement de la facture:', err);
      alert('Erreur lors du téléchargement de la facture. Veuillez réessayer.');
    } finally {
      setDownloadingInvoice(false);
    }
  };

  const formatPrice = (price) => {
    return parseFloat(price).toFixed(2).replace(".", ",") + " €";
  };

  // État de chargement
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background:
            "linear-gradient(135deg, #E8F5E3 0%, #FFF9E6 25%, #FFE8F0 50%, #E8D5FF 75%, #FFE5D9 100%)",
        }}
      >
        <div className="text-center">
          <svg
            className="animate-spin h-12 w-12 text-green-600 mx-auto mb-4"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p className="text-xl text-gray-600">Vérification du paiement...</p>
        </div>
      </div>
    );
  }

  // État d'erreur
  if (error || !order) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{
          background:
            "linear-gradient(135deg, #E8F5E3 0%, #FFF9E6 25%, #FFE8F0 50%, #E8D5FF 75%, #FFE5D9 100%)",
        }}
      >
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
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
                d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Erreur</h1>
          <p className="text-gray-600 mb-6">{error || 'Une erreur est survenue'}</p>
          <Link
            to="/"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  // Paiement réussi
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{
        background:
          "linear-gradient(135deg, #E8F5E3 0%, #FFF9E6 25%, #FFE8F0 50%, #E8D5FF 75%, #FFE5D9 100%)",
      }}
    >
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-lg w-full text-center">
        {/* Icône de succès */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Paiement confirmé !
        </h1>
        <p className="text-gray-600 mb-2">Merci pour votre achat !</p>
        {order.email && (
          <p className="text-gray-600 mb-6">
            Un email de confirmation a été envoyé à <strong>{order.email}</strong>.
          </p>
        )}

        {/* Détails de la commande */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6 text-left">
          <p className="text-sm text-gray-600 mb-2">Numéro de commande</p>
          <p className="text-2xl font-bold text-green-600 mb-4">#{order.id}</p>

          {order.full_address && (
            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm text-gray-600 mb-2">Adresse de livraison</p>
              <p className="text-sm text-gray-900">{order.full_address}</p>
            </div>
          )}

          {order.total && (
            <div className="border-t border-gray-200 mt-4 pt-4">
              <div className="flex justify-between">
                <p className="text-sm text-gray-600">Montant total</p>
                <p className="text-lg font-bold text-green-600">
                  {formatPrice(order.total)}
                </p>
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 mt-4 pt-4">
            <p className="text-sm text-gray-600 mb-3">Prochaines étapes</p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Traitement de votre commande
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Préparation de l'expédition
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Livraison à votre domicile
              </li>
            </ul>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="space-y-3">
          <button
            onClick={handleDownloadInvoice}
            disabled={downloadingInvoice}
            className={`w-full border-2 border-green-600 text-green-600 py-3 rounded-lg font-semibold hover:bg-green-600 hover:text-white transition flex items-center justify-center gap-2 ${
              downloadingInvoice ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {downloadingInvoice ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Téléchargement...
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Télécharger la facture
              </>
            )}
          </button>

          <Link
            to="/"
            className="block w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition text-center"
          >
            Continuer mes achats
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
