import React, { useState } from "react";
import { Link } from "react-router-dom";
import tarif1 from "../assets/tarifs/Tarifs_au_depart_de_la France_metropolitaine.png";
import tarif2 from "../assets/tarifs/Envois_en_Lettre_internationale.png";
import ShippingZoneSelector from "../components/ShippingZoneSelector";

const CartPage = () => {
  const [shippingZone, setShippingZone] = useState("FR");
  const [showFranceDetails, setShowFranceDetails] = useState(false);
  const [showEuropeDetails, setShowEuropeDetails] = useState(false);

  const [cartItems, setCartItems] = useState([
    {
      id: 3,
      slug: "Castorin",
      title: "Je ne veux plus être un castor...",
      image: "https://placehold.co/100x150/F4E8B4/2C3E50?text=Castor",
      quantity: 1,
      unitPrice: 7.0,
    },
  ]);

  const shippingCosts = {
    FR: 4.71,
    EU: 10.48,
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: parseInt(newQuantity) } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );
  };

  const getTotalQuantity = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + shippingCosts[shippingZone];
  };

  const formatPrice = (price) => {
    return price.toFixed(2).replace(".", ",") + " €";
  };

  return (
    <div
      className="min-h-screen py-10 px-4"
      style={{
        background:
          "linear-gradient(135deg, #E8F5E3 0%, #FFF9E6 25%, #FFE8F0 50%, #E8D5FF 75%, #FFE5D9 100%)",
      }}
    >
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-xl p-6 md:p-8">
        <h1
          className="text-4xl font-bold text-center mb-8 text-slate-700"
          style={{
            fontFamily: "'Alfa Slab One', cursive",
            color: "white",
            WebkitTextStroke: "1px #000000",
          }}
        >
          Mon Panier
        </h1>

        {/* Shipping Zone Selector */}
        <div className="mb-6 flex items-center gap-3 flex-wrap">
          <ShippingZoneSelector
            shippingZone={shippingZone}
            setShippingZone={setShippingZone}
          />
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-500 mb-4">Votre panier est vide</p>
            <a
              href="/"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
            >
              Continuer mes achats
            </a>
          </div>
        ) : (
          <>
            {/* Cart Table - Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-200 text-slate-700">
                    <th className="p-3 text-left font-bold">Livre</th>
                    <th className="p-3 text-center font-bold">Quantité</th>
                    <th className="p-3 text-center font-bold">Prix Unitaire</th>
                    <th className="p-3 text-center font-bold">Sous-total</th>
                    <th className="p-3 text-center font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="p-3">
                        <div className="flex items-center gap-4">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-20 h-28 object-cover rounded"
                          />
                          <span className="font-medium text-slate-700">
                            {item.title}
                          </span>
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(item.id, e.target.value)
                            }
                            className="w-16 border border-gray-300 rounded px-2 py-1 text-center"
                          />
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity)
                            }
                            className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition"
                          >
                            Modifier
                          </button>
                        </div>
                      </td>
                      <td className="p-3 text-center font-semibold">
                        {formatPrice(item.unitPrice)}
                      </td>
                      <td className="p-3 text-center font-semibold">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="bg-red-600 text-white px-4 py-1 rounded text-sm hover:bg-red-700 transition"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cart Cards - Mobile */}
            <div className="md:hidden space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-300 rounded-lg p-4 bg-gray-50"
                >
                  <div className="flex gap-4 mb-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-20 h-28 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-700 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm">
                        <span className="font-medium">Prix unitaire:</span>{" "}
                        {formatPrice(item.unitPrice)}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Sous-total:</span>{" "}
                        {formatPrice(item.unitPrice * item.quantity)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.id, e.target.value)
                        }
                        className="w-16 border border-gray-300 rounded px-2 py-1 text-center"
                      />
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                      >
                        Modifier
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="bg-red-600 text-white px-4 py-1 rounded text-sm"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Section */}
            <div className="mt-8 space-y-4">
              {/* Subtotal Quantity/Price */}
              <div className="flex justify-between items-center py-3 border-t border-gray-300">
                <span className="font-semibold text-slate-700">
                  Sous-total quantité / prix
                </span>
                <div className="flex gap-4">
                  <span className="font-bold">{getTotalQuantity()}</span>
                  <span className="font-bold">
                    {formatPrice(calculateSubtotal())}
                  </span>
                </div>
              </div>

              {/* Shipping Cost */}
              <div className="flex justify-between items-center py-3 border-t border-gray-300">
                <span className="font-semibold text-slate-700">
                  Sous-total frais d'expédition
                </span>
                <span className="font-bold">
                  {formatPrice(shippingCosts[shippingZone])}
                </span>
              </div>

              {/* Shipping Details Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <button
                  onClick={() => {
                    setShowFranceDetails(!showFranceDetails);
                    setShowEuropeDetails(false);
                  }}
                  className="border-2 border-slate-300 rounded-lg p-4 hover:bg-slate-100 transition text-center"
                >
                  <h5 className="font-bold text-slate-700">
                    Transparence frais d'expédition France
                  </h5>
                </button>
                <button
                  onClick={() => {
                    setShowEuropeDetails(!showEuropeDetails);
                    setShowFranceDetails(false);
                  }}
                  className="border-2 border-slate-300 rounded-lg p-4 hover:bg-slate-100 transition text-center"
                >
                  <h5 className="font-bold text-slate-700">
                    Transparence frais d'expédition Belgique / Europe
                  </h5>
                </button>
              </div>

              {/* France Details */}
              {showFranceDetails && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-sm leading-relaxed">
                  <p className="mb-4">
                    Nous expédions nos livres avec les services de La Poste.
                    Dans un désir de transparence, vous trouverez ci-après le
                    détail de leur tarif au 1er janvier 2025.
                  </p>
                  <p className="mb-4">
                    <a
                      href="https://www.laposte.fr/mon-timbre-en-ligne/tarifs"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      https://www.laposte.fr/mon-timbre-en-ligne/tarifs
                    </a>
                  </p>
                  <p className="mb-4">
                    Pourquoi cette transparence ? Simplement pour vous informer
                    que vous paierez des frais d'envoi moins élevés en passant
                    une commande à partir de 4 ou 7 titres.
                  </p>
                  <img src={tarif1} alt="image tarifs internationnale" />
                  <p className="font-bold mb-2">
                    Chacun des titres « Je ne veux plus être… » pèse 103
                    grammes,
                  </p>
                  <p className="mb-4">
                    auxquels s'ajoutent 30 grammes de papier bulle. Soit un
                    total de 133 grammes.
                  </p>

                  <div className="space-y-4 mt-6">
                    <div className="bg-white p-4 rounded border">
                      <p className="font-bold">2 titres</p>
                      <p>
                        = 206 grammes (+ enveloppe bulle de 30 g) = 236 grammes
                      </p>
                      <p>→ pour un tarif de 4,71 €</p>
                      <p className="font-bold mt-2">
                        Soit un coût unitaire d'expédition de 2,35 € / livre.
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded border">
                      <p className="font-bold">3 titres</p>
                      <p>
                        = 309 grammes (+ enveloppe bulle de 45 g) = 354 grammes
                      </p>
                      <p>→ pour un tarif de 6,77 €</p>
                      <p className="font-bold mt-2">
                        Soit un coût unitaire d'expédition de 2,25 € / livre.
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded border border-red-400">
                      <p className="font-bold">4 titres</p>
                      <p>
                        = 412 grammes (+ enveloppe bulle de 45 g) = 457 grammes
                      </p>
                      <p>→ pour un tarif de 5,13 €</p>
                      <p className="font-bold text-red-600 mt-2">
                        Soit un coût unitaire d'expédition de 1,28 € / livre.
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded border">
                      <p className="font-bold">7 titres</p>
                      <p>
                        = 721 grammes (+ enveloppe bulle de 60 g) = 781 grammes
                      </p>
                      <p>→ pour un tarif de 8,42 €</p>
                      <p className="font-bold mt-2">
                        Soit un coût unitaire d'expédition de 1,20 € / livre.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Europe Details */}
              {showEuropeDetails && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-sm leading-relaxed">
                  <p className="mb-4">
                    Nous expédions nos livres avec les services de La Poste.
                    Dans un désir de transparence, vous trouverez ci-après le
                    détail de leur tarif au 1er janvier 2025.
                  </p>
                  <p className="mb-4">
                    <a
                      href="https://www.laposte.fr/mon-timbre-en-ligne/tarifs"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 underline"
                    >
                      https://www.laposte.fr/mon-timbre-en-ligne/tarifs
                    </a>
                  </p>
                  <p className="mb-4">
                    Pourquoi cette transparence ? Simplement pour vous informer
                    que vous paierez des frais d'envoi moins élevés en passant
                    une commande à partir de 4 ou 8 titres.
                  </p>
                  <img src={tarif2} alt="jdkj jnjsdn jdsj" />
                  <p className="font-bold mb-2">
                    Chacun des titres « Je ne veux plus être… » pèse 103
                    grammes,
                  </p>
                  <p className="mb-4">
                    auxquels s'ajoutent 30 grammes de papier bulle. Soit un
                    total de 133 grammes.
                  </p>
                  <p>
                    Mais la poste ne propose pas de tarifs pour 130 g. Elle nous
                    fait directement basculer dans la 3ème tranche de 101 à 250
                    grammes, tarifés à 10,48 €.
                  </p>
                  <p className="text-red-500">
                    Nous comprenons qu’il est impensable de régler 10,48 € pour
                    un livre qui en coute 7 €. C’est donc la raison pour
                    laquelle, nous vous proposons de réduire ces frais d’envoi
                    en achetant directement plus d’un titre.
                  </p>

                  <div className="space-y-4 mt-6">
                    <div className="bg-white p-4 rounded border">
                      <p className="font-bold">2 titres</p>
                      <p>
                        = 206 grammes (+ enveloppe bulle de 30 g) = 236 grammes
                      </p>
                      <p>→ pour un tarif de 10,48 €</p>
                      <p className="font-bold mt-2">
                        Soit un coût unitaire d'expédition de 5,24 € / livre.
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded border">
                      <p className="font-bold">3 titres</p>
                      <p>
                        = 309 grammes (+ enveloppe bulle de 45 g) = 354 grammes
                      </p>
                      <p>
                        Nous passons à la 4ème tranche comprise entre 251 et 500
                        grammes que La Poste facture à 15,24 €.
                      </p>
                      <p className="font-bold mt-2">
                        Soit un coût unitaire d'expédition de 5,08 € / livre.
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded border border-red-400">
                      <p className="font-bold">4 titres</p>
                      <p>
                        = 412 grammes (+ enveloppe bulle de 45 g) = 457 grammes
                      </p>
                      <p>
                        4ème tranche comprise entre 251 et 500 grammes que La
                        Poste facture à 15,24 €.
                      </p>
                      <p className="font-bold text-red-600 mt-2">
                        Soit un coût unitaire d'expédition de 3,81 € / livre.
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded border">
                      <p className="font-bold">5 titres</p>
                      <p>
                        = 515 grammes (+ enveloppe bulle de 50 g) = 565 grammes
                      </p>
                      <p>
                        Nous passons à la 5ème tranche comprise entre 501 et
                        1000 grammes que La Poste facture à 8,30 €.
                      </p>
                      <p className="font-bold mt-2">
                        Soit un cout unitaire d’expédition de 5,72 € / livre.
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded border">
                      <p className="font-bold">6 titres</p>
                      <p>
                        = 618 grammes (+ enveloppe bulle de 50 g) = 668 grammes
                      </p>
                      <p>
                        5ème tranche comprise entre 501 et 1000 grammes que La
                        Poste facture à 28,62 €.
                      </p>
                      <p className="font-bold mt-2">
                        Soit un cout unitaire d’expédition de 4,77 € / livre.
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded border">
                      <p className="font-bold">7 titres</p>
                      <p>
                        = 721 grammes (+ enveloppe bulle de 60 g) = 781 grammes
                      </p>
                      <p>
                        5ème tranche comprise entre 501 et 1000 grammes que La
                        Poste facture à 28,62 €.
                      </p>
                      <p className="font-bold mt-2">
                        Soit un cout unitaire d’expédition de 4,08 € / livre.
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded border border-red-400">
                      <p className="font-bold">8 titres</p>
                      <p>
                        = 824 grammes (+ enveloppe bulle de 60 g) = 884 grammes
                      </p>
                      <p>
                        5ème tranche comprise entre 501 et 1000 grammes que La
                        Poste facture à 28,62 €.
                      </p>
                      <p className="font-bold text-red-600 mt-2">
                        Soit un cout unitaire d’expédition de 3,57 € / livre.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Total Price */}
              <div className="flex justify-between items-center py-4 border-t-2 border-slate-400">
                <span className="text-xl font-bold text-slate-700">
                  Total Prix
                </span>
                <span className="text-2xl font-bold text-green-600">
                  {formatPrice(calculateTotal())}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row justify-center gap-4 mt-8">
              <Link
                to="/"
                className="bg-white text-black px-8 py-3 rounded-lg text-center font-semibold hover:bg-green-700 transition"
              >
                Continuer mes achats
              </Link>
              <Link
                to="/order"
                className="bg-green-700 text-white px-8 py-3 rounded-lg text-center font-semibold hover:bg-orange-700 transition"
              >
                Passer à l'achat
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;
