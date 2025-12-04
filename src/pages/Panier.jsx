import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import tarif1 from "../assets/tarifs/Tarifs_au_depart_de_la France_metropolitaine.png";
import tarif2 from "../assets/tarifs/Envois_en_Lettre_internationale.png";
import ordersService from "../services/ordersService";
import useCart from "../hooks/useCart";

const CartPage = () => {
  const { cartItems, updateQuantity, removeItem, getCartCount } = useCart();
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [showFranceDetails, setShowFranceDetails] = useState(false);
  const [showEuropeDetails, setShowEuropeDetails] = useState(false);

  // Charger les pays depuis l'API
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoadingCountries(true);
        const response = await ordersService.getCountries();
        console.log("API Response - Full:", response);
        console.log("API Response - Type:", typeof response);
        console.log("API Response - Is Array:", Array.isArray(response));
        
        let countriesList = [];
        if (Array.isArray(response)) {
          countriesList = response;
        } else if (response && response.results) {
          countriesList = response.results;
        } else if (response && response.data) {
          countriesList = response.data;
        }
        
        console.log("Countries List after parsing:", countriesList);
        console.log("Countries List length:", countriesList.length);
        
        // Filter for active countries only
        const activeCountries = countriesList.filter(c => c.is_active !== false);
        console.log("Active countries:", activeCountries);
        
        setCountries(activeCountries);
        
        // Sélectionner France par défaut si disponible
        const france = activeCountries.find(
          (c) => c.code === "FR" || c.name === "France"
        );
        if (france) {
          setSelectedCountry(france);
          console.log("France selected:", france);
        } else if (activeCountries.length > 0) {
          setSelectedCountry(activeCountries[0]);
          console.log("First country selected:", activeCountries[0]);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des pays:", error);
      } finally {
        setLoadingCountries(false);
      }
    };
    fetchCountries();
  }, []);

  const getShippingCost = () => {
    if (!selectedCountry) return 0;
    
    const totalQuantity = getTotalQuantity();
    const bookWeight = 103; // grammes
    const bubbleWeight = Math.ceil(totalQuantity / 2) * 15; // 15g per bubble sheet
    const totalWeight = totalQuantity * bookWeight + bubbleWeight;
    
    // France tarifs (as of 2025-01-01)
    if (selectedCountry.code === "FR" || selectedCountry.name === "France") {
      if (totalQuantity === 1) return 4.71;
      if (totalQuantity === 2) return 4.71;
      if (totalQuantity === 3) return 6.77;
      if (totalQuantity === 4) return 5.13;
      if (totalQuantity === 5) return 8.94;
      if (totalQuantity === 6) return 8.40;
      if (totalQuantity === 7) return 8.42;
      if (totalQuantity >= 8) {
        // 8,30 € + 0,02€ par tranche de 10g au-delà de 500g
        const basePrice = 8.30;
        const additionalWeight = Math.max(0, totalWeight - 500);
        const additionalTranches = Math.ceil(additionalWeight / 10);
        return basePrice + (additionalTranches * 0.02);
      }
    }
    
    // Europe/Belgium tarifs
    if (totalQuantity === 1) return 10.48;
    if (totalQuantity === 2) return 10.48;
    if (totalQuantity === 3) return 15.24;
    if (totalQuantity === 4) return 15.24;
    if (totalQuantity >= 5) return 28.62;
    
    // Fallback
    return (
      parseFloat(selectedCountry.shipping_cost_euros) ||
      selectedCountry.shipping_cost / 100
    );
  };

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );
  };

  const getTotalQuantity = () => {
    return getCartCount();
  };

  const calculateTotal = () => {
    return calculateSubtotal() + getShippingCost();
  };

  const formatPrice = (price) => {
    return price.toFixed(2).replace(".", ",") + " €";
  };

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(id, parseInt(newQuantity));
  };

  return (
    <div
      className="min-h-screen py-10 px-4"
      style={{
        background:
          "linear-gradient(135deg, #E8F5E3 0%, #FFF9E6 25%, #FFE8F0 50%, #E8D5FF 75%, #FFE5D9 100%)",
      }}
    >
      <div className="max-w-6xl mx-auto p-6 md:p-8">
        <h1
          className="text-4xl font-bowlby text-center mb-8 text-slate-700"
          style={{
            color: "white",
            WebkitTextStroke: "1px #000000",
          }}
        >
          Mon Panier
        </h1>

        {/* Sélecteur de pays de livraison */}
        <div className="mb-6 flex items-center gap-3 flex-wrap">
          <label className="font-semibold text-slate-700">
            Choisir votre zone de livraison:
          </label>
          {loadingCountries ? (
            <span className="text-gray-500">Chargement...</span>
          ) : (
            <select
              value={selectedCountry?.id || ""}
              onChange={(e) => {
                const country = countries.find(
                  (c) => c.id === parseInt(e.target.value)
                );
                setSelectedCountry(country);
              }}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-500 mb-4">Votre panier est vide</p>
            <Link
              to="/"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
            >
              Continuer mes achats
            </Link>
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
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-20 h-28 object-cover rounded"
                            />
                          ) : (
                            <div className="w-20 h-28 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                              No image
                            </div>
                          )}
                          <span className="font-medium text-slate-700">
                            {item.title}
                          </span>
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity - 1)
                            }
                            className="bg-gray-200 text-gray-700 w-8 h-8 rounded hover:bg-gray-300 transition"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(item.id, e.target.value)
                            }
                            className="w-16 border border-gray-300 rounded px-2 py-1 text-center"
                          />
                          <button
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity + 1)
                            }
                            className="bg-gray-200 text-gray-700 w-8 h-8 rounded hover:bg-gray-300 transition"
                          >
                            +
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
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-20 h-28 object-cover rounded"
                      />
                    ) : (
                      <div className="w-20 h-28 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                        No image
                      </div>
                    )}
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
                      <button
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity - 1)
                        }
                        className="bg-gray-200 text-gray-700 w-8 h-8 rounded"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(item.id, e.target.value)
                        }
                        className="w-16 border border-gray-300 rounded px-2 py-1 text-center"
                      />
                      <button
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity + 1)
                        }
                        className="bg-gray-200 text-gray-700 w-8 h-8 rounded"
                      >
                        +
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
                  Sous-total ({getTotalQuantity()} article
                  {getTotalQuantity() > 1 ? "s" : ""})
                </span>
                <span className="font-bold">
                  {formatPrice(calculateSubtotal())}
                </span>
              </div>

              {/* Shipping Cost */}
              <div className="flex justify-between items-center py-3 border-t border-gray-300">
                <span className="font-semibold text-slate-700">
                  Frais d'expédition (
                  {selectedCountry?.name || "Non sélectionné"})
                </span>
                <span className="font-bold">
                  {formatPrice(getShippingCost())}
                </span>
              </div>

              {/* Shipping Details Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <button
                  onClick={() => {
                    setShowFranceDetails(!showFranceDetails);
                    setShowEuropeDetails(false);
                  }}
                  className={`border-2 rounded-lg p-4 transition text-center font-bold ${
                    showFranceDetails
                      ? "border-red-600 bg-red-50 text-red-700"
                      : "border-slate-300 hover:bg-slate-100 text-red-600"
                  }`}
                >
                  Transparence frais d'expédition France
                </button>
                <button
                  onClick={() => {
                    setShowEuropeDetails(!showEuropeDetails);
                    setShowFranceDetails(false);
                  }}
                  className={`border-2 rounded-lg p-4 transition text-center font-bold ${
                    showEuropeDetails
                      ? "border-red-600 bg-red-50 text-red-700"
                      : "border-slate-300 hover:bg-slate-100 text-red-600"
                  }`}
                >
                  Transparence frais d'expédition Belgique / Europe
                </button>
              </div>

              {/* France Details */}
              {showFranceDetails && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-base leading-relaxed">
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
                  <img src={tarif1} alt="Tarifs France" />
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
                    grammes, tarifés à 4,71 € (+ 0,02€ par tranche de 10g).{" "}
                    <br />
                    Soit un tarif de 4,71 € puisque nous de dépassons pas les
                    250 grammes.
                  </p>
                  <p className="text-red-500">
                    Nous comprenons qu’il est impensable de régler 4,17 € pour
                    un livre qui en coute 7 €.
                    <br />
                    C’est donc la raison pour laquelle, nous vous proposons de
                    réduire ces frais d’envoi en achetant directement plus d’un
                    titre.
                  </p>
                  <br />
                  <p className="underline font-baloo font-bold ">
                    Exemples pour un envoi en France métropolitaine :
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
                      <p className="font-bold">5 titres</p>
                      <p>
                        = 515 grammes (+ enveloppe bulle de 50 g) = 565 grammes
                      </p>
                      <p>
                        Nous passons à la 5ème tranche comprise entre 501 et
                        1000 grammes que La Poste facture à 8,30 €.
                      </p>
                      <p>
                        → pour un tarif de 8,30 € + 0,02€ par tranche de 10g =
                        8,94 €
                      </p>
                      <p className="font-bold mt-2">
                        Soit un cout unitaire d’expédition de 1,78 € / livre.
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded border">
                      <p className="font-bold">6 titres</p>
                      <p>
                        = 618 grammes (+ enveloppe bulle de 50 g) = 668 grammes
                      </p>
                      <p>
                        → pour un tarif de 8,30 € + 0,02€ par tranche de 10g =
                        8,40 €
                      </p>
                      <p className="font-bold mt-2">
                        Soit un cout unitaire d’expédition de 1,40 € / livre.
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

                    <div className="bg-white p-4 rounded border border border-red-400">
                      <p className="font-bold">8 titres</p>
                      <p>
                        = 824 grammes (+ enveloppe bulle de 60 g) = 884 grammes
                      </p>
                      <p>
                        → pour un tarif de 8,30 € + 0,02€ par tranche de 10g =
                        8,42 €
                      </p>
                      <p className="font-bold mt-2">
                        Soit un cout unitaire d’expédition de 1,05 € / livre.
                      </p>
                    </div>

                  </div>
                </div>
              )}

              {/* Europe Details */}
              {showEuropeDetails && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-base leading-relaxed">
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
                  <img src={tarif2} alt="Tarifs Europe" className=""/>
                  <p className="font-bold mb-2">
                    Chacun des titres « Je ne veux plus être… » pèse 103
                    grammes,
                  </p>
                  <p className="mb-4">
                    auxquels s'ajoutent 30 grammes de papier bulle. Soit un
                    total de 133 grammes. <br />
                    Mais la poste ne propose pas de tarifs pour 130 g. Elle nous
                    fait directement basculer dans la 3ème tranche de 101 à 250
                    grammes, tarifés à 10,48 €.
                  </p>

                  <p className="text-red-500">
                    Nous comprenons qu'il est impensable de régler 10,48 € pour
                    un livre qui en coute 7 €. C'est donc la raison pour
                    laquelle, nous vous proposons de réduire ces frais d'envoi
                    en achetant directement plus d'un titre.
                  </p>

                  <br />
                  <p className="underline font-baloo font-bold ">
                    Exemples pour un envoi en France métropolitaine :
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
                        Soit un cout unitaire d’expédition de 5,08 € / livre.
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
                        1000 grammes que La Poste facture à 28,62 €.
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
                        Soit un cout unitaire d'expédition de 3,57 € / livre.
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
                className="bg-white text-black px-8 py-3 rounded-lg text-center font-semibold border border-gray-300 hover:bg-green-500 transition"
              >
                Continuer mes achats
              </Link>
              <Link
                to="/order"
                state={{
                  cartItems,
                  selectedCountry,
                  subtotal: calculateSubtotal(),
                  shippingCost: getShippingCost(),
                  total: calculateTotal(),
                }}
                className="bg-white text-black px-8 py-3 rounded-lg text-center border border-gray-300 font-semibold hover:bg-green-700 transition"
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
