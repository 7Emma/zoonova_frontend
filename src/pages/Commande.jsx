import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import visa from "../assets/png_rez/visa.png";
import master from "../assets/png_rez//Master2.png";
import amex from "../assets/png_rez/amex2.png";
import ordersService from "../services/ordersService";
import paymentsService from "../services/paymentsService";
import useCart from "../hooks/useCart";

const CheckoutPage = () => {
  const location = useLocation();
  const { cartItems: cartFromHook } = useCart();

  // Récupérer les données du panier depuis la navigation ou le hook
  const cartData = location.state || {};
  const cartItems = cartData.cartItems || cartFromHook;
  const [selectedCountry, setSelectedCountry] = useState(
    cartData.selectedCountry || null
  );

  const [countries, setCountries] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(true);

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    phone: "",
    voie: "",
    numeroVoie: "",
    complementAdresse: "",
    codePostal: "",
    ville: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Charger les pays depuis l'API
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoadingCountries(true);
        const response = await ordersService.getCountries();
        const countriesList = response.results || response;
        setCountries(countriesList);

        // Si pas de pays sélectionné, prendre France par défaut
        if (!selectedCountry) {
          const france = countriesList.find((c) => c.code === "FR");
          if (france) {
            setSelectedCountry(france);
          } else if (countriesList.length > 0) {
            setSelectedCountry(countriesList[0]);
          }
        }
      } catch {
        // Erreur silencieuse
      } finally {
        setLoadingCountries(false);
      }
    };
    fetchCountries();
  }, [selectedCountry]);

  const getTotalQuantity = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

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
      if (totalQuantity === 6) return 8.4;
      if (totalQuantity === 7) return 8.42;
      if (totalQuantity >= 8) {
        const basePrice = 8.3;
        const additionalWeight = Math.max(0, totalWeight - 500);
        const additionalTranches = Math.ceil(additionalWeight / 10);
        return basePrice + additionalTranches * 0.02;
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

  const calculateTotal = () => {
    return calculateSubtotal() + getShippingCost();
  };

  const formatPrice = (price) => {
    return price.toFixed(2).replace(".", ",") + " €";
  };

  // Ajoutez cet état pour gérer les villes trouvées
  const [suggestedCities, setSuggestedCities] = useState([]);
  const [loadingCity, setLoadingCity] = useState(false);

  // Ajoutez cette fonction pour rechercher la ville
  const fetchCityFromPostalCode = async (postalCode) => {
    // Nettoyer le code postal (enlever les espaces)
    const cleanPostalCode = postalCode.trim().replace(/\s/g, "");

    // Si le code postal est vide ou trop court, ne rien faire
    if (!cleanPostalCode || cleanPostalCode.length < 2) {
      setSuggestedCities([]);
      return;
    }

    // Vérifier s'il y a un pays sélectionné
    if (!selectedCountry) {
      setSuggestedCities([]);
      return;
    }

    // Déterminer si on est en France ou en Europe
    const isFrance =
      selectedCountry?.code === "FR" ||
      selectedCountry?.name === "France" ||
      selectedCountry?.name?.toLowerCase()?.includes("france");

    const isEurope =
      selectedCountry?.code === "EU" ||
      selectedCountry?.name === "Europe" ||
      selectedCountry?.name?.toLowerCase()?.includes("europe");

    setLoadingCity(true);
    try {
      // Pour la France, utiliser l'API gouvernementale
      if (isFrance) {
        try {
          const url = `https://api-adresse.data.gouv.fr/search/?q=${cleanPostalCode}&type=municipality&autocomplete=0`;

          const response = await fetch(url);
          const data = await response.json();

          if (data.features && data.features.length > 0) {
            // Extraire les villes uniques
            const cities = data.features
              .map((feature) => feature.properties.city)
              .filter((city, index, self) => self.indexOf(city) === index);

            setSuggestedCities(cities);

            // Si une seule ville correspond, la remplir automatiquement
            if (cities.length === 1) {
              setFormData((prev) => ({
                ...prev,
                ville: cities[0],
              }));
            }
          } else {
            setSuggestedCities([]);
          }
        } catch {
          setSuggestedCities([]);
        }
      }
      // Pour l'Europe, essayer tous les pays jusqu'à trouver une correspondance
      else if (isEurope) {
        const europeanCountries = [
          "FR",
          "BE",
          "DE",
          "ES",
          "IT",
          "NL",
          "PT",
          "AT",
          "CH",
          "LU",
          "PL",
          "SE",
          "DK",
          "NO",
          "FI",
          "IE",
          "GR",
          "CZ",
          "HU",
          "RO",
          "BG",
          "GB",
        ];

        let found = false;

        for (const countryCode of europeanCountries) {
          try {
            const url = `https://api.zippopotam.us/${countryCode.toLowerCase()}/${encodeURIComponent(
              cleanPostalCode
            )}`;

            const response = await fetch(url);

            if (response.ok) {
              const data = await response.json();

              if (data.places && data.places.length > 0) {
                // Extraire les villes uniques
                const cities = data.places.map((place) => place["place name"]);
                const uniqueCities = [...new Set(cities)];

                setSuggestedCities(uniqueCities);

                // Si une seule ville correspond, la remplir automatiquement
                if (uniqueCities.length === 1) {
                  setFormData((prev) => ({
                    ...prev,
                    ville: uniqueCities[0],
                  }));
                }

                found = true;
                break; // Arrêter dès qu'on trouve un résultat
              }
            }
          } catch {
            // Continuer avec le pays suivant
            continue;
          }
        }

        if (!found) {
          setSuggestedCities([]);
        }
      }
    } catch {
      setSuggestedCities([]);
    } finally {
      setLoadingCity(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Si c'est le code postal qui change, chercher la ville
    if (name === "codePostal") {
      fetchCityFromPostalCode(value);
    }

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleCountryChange = (e) => {
    const country = countries.find((c) => c.id === parseInt(e.target.value));
    setSelectedCountry(country);

    // Réinitialiser les suggestions de villes
    setSuggestedCities([]);

    // Si un code postal est déjà saisi, relancer la recherche avec le nouveau pays
    if (formData.codePostal) {
      fetchCityFromPostalCode(formData.codePostal);
    }
  };

  // Fonction pour sélectionner une ville suggérée
  const handleCitySelect = (city) => {
    setFormData((prev) => ({
      ...prev,
      ville: city,
    }));
    setSuggestedCities([]);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nom.trim()) newErrors.nom = "Le nom est requis";
    if (!formData.prenom.trim()) newErrors.prenom = "Le prénom est requis";
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email invalide";
    }
    if (!formData.phone.trim())
      newErrors.phone = "Le numéro de téléphone est requis";
    if (!formData.voie.trim()) newErrors.voie = "La voie est requise";
    if (!formData.numeroVoie)
      newErrors.numeroVoie = "Le numéro de voie est requis";
    if (!formData.codePostal.trim())
      newErrors.codePostal = "Le code postal est requis";
    if (!formData.ville.trim()) newErrors.ville = "La ville est requise";
    if (!selectedCountry) newErrors.pays = "Le pays est requis";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        email: formData.email,
        first_name: formData.prenom,
        last_name: formData.nom,
        phone: formData.phone || "",
        voie: formData.voie,
        numero_voie: formData.numeroVoie.toString(),
        complement_adresse: formData.complementAdresse || "",
        code_postal: formData.codePostal,
        ville: formData.ville,
        country: selectedCountry.id,
        items: cartItems.map((item) => ({
          book_id: item.id,
          quantity: item.quantity,
        })),
      };

      const orderResponse = await ordersService.createOrder(orderPayload);

      const orderId = orderResponse.order?.id || orderResponse.id;

      if (!orderId) {
        throw new Error("ID de commande non reçu");
      }

      const checkoutResponse = await paymentsService.createCheckoutSession(
        orderId
      );

      if (checkoutResponse.checkout_url) {
        window.location.href = checkoutResponse.checkout_url;
      } else {
        throw new Error("URL de checkout non reçue");
      }
    } catch (error) {
      if (error.data?.items) {
        setSubmitError(error.data.items.join(", "));
      } else if (error.data?.error) {
        setSubmitError(error.data.error);
      } else if (error.message) {
        setSubmitError(error.message);
      } else {
        setSubmitError(
          "Une erreur est survenue lors de la création de la commande. Veuillez réessayer."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen py-4 xs:py-6 sm:py-10 px-2 xs:px-3 sm:px-4 flex justify-center"
      style={{
        background:
          "linear-gradient(135deg, #E8F5E3 0%, #FFF9E6 25%, #FFE8F0 50%, #E8D5FF 75%, #FFE5D9 100%)",
      }}
    >
      <div className="max-w-4xl w-full p-2 xs:p-4 sm:p-6 lg:p-10 lg:mr-10">
        <h1
          className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-bowlby text-center mb-4 xs:mb-6 sm:mb-8 text-slate-700"
          style={{
            color: "white",
            WebkitTextStroke: "0.5px #000000",
          }}
        >
          Finaliser la commande
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 xs:gap-6 sm:gap-8">
          {/* Formulaire de livraison */}
          <div className="lg:col-span-2">
            <div className="p-3 xs:p-4 sm:p-6 lg:p-8">
              <h2 className="text-base xs:text-lg sm:text-xl font-bold text-slate-700 mb-3 xs:mb-4 sm:mb-6">
                Adresse de livraison
              </h2>

              <form
                onSubmit={handleSubmit}
                className="space-y-3 xs:space-y-4 sm:space-y-6"
              >
                {/* Nom et Prénom */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 xs:gap-4">
                  <div>
                    <label
                      htmlFor="nom"
                      className="block text-xs xs:text-sm font-semibold text-slate-700 mb-1 xs:mb-2"
                    >
                      Nom <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="nom"
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      className={`w-full px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 text-sm xs:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.nom ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.nom && (
                      <p className="text-red-600 text-xs xs:text-sm mt-1">
                        {errors.nom}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="prenom"
                      className="block text-xs xs:text-sm font-semibold text-slate-700 mb-1 xs:mb-2"
                    >
                      Prénom <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="prenom"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleInputChange}
                      className={`w-full px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 text-sm xs:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.prenom ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.prenom && (
                      <p className="text-red-600 text-xs xs:text-sm mt-1">
                        {errors.prenom}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email et Téléphone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 xs:gap-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs xs:text-sm font-semibold text-slate-700 mb-1 xs:mb-2"
                    >
                      Email <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 text-sm xs:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-600 text-xs xs:text-sm mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-xs xs:text-sm font-semibold text-slate-700 mb-1 xs:mb-2"
                    >
                      Téléphone <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+33 6 12 34 56 78"
                      className={`w-full px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 text-sm xs:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.phone ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-red-600 text-xs xs:text-sm mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Voie et Numéro */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 xs:gap-4">
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="voie"
                      className="block text-xs xs:text-sm font-semibold text-slate-700 mb-1 xs:mb-2"
                    >
                      Voie <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="voie"
                      name="voie"
                      value={formData.voie}
                      onChange={handleInputChange}
                      placeholder="Rue, Avenue, Boulevard..."
                      className={`w-full px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 text-sm xs:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.voie ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.voie && (
                      <p className="text-red-600 text-xs xs:text-sm mt-1">
                        {errors.voie}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="numeroVoie"
                      className="block text-xs xs:text-sm font-semibold text-slate-700 mb-1 xs:mb-2"
                    >
                      N° <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="numeroVoie"
                      name="numeroVoie"
                      value={formData.numeroVoie}
                      onChange={handleInputChange}
                      className={`w-full px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 text-sm xs:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.numeroVoie ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.numeroVoie && (
                      <p className="text-red-600 text-xs xs:text-sm mt-1">
                        {errors.numeroVoie}
                      </p>
                    )}
                  </div>
                </div>

                {/* Complément d'adresse */}
                <div>
                  <label
                    htmlFor="complementAdresse"
                    className="block text-xs xs:text-sm font-semibold text-slate-700 mb-1 xs:mb-2"
                  >
                    Complément d'adresse
                  </label>
                  <input
                    type="text"
                    id="complementAdresse"
                    name="complementAdresse"
                    value={formData.complementAdresse}
                    onChange={handleInputChange}
                    placeholder="Appartement, Bâtiment, Étage..."
                    className="w-full px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 text-sm xs:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Code Postal, Ville et Pays */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 xs:gap-4">
                  <div>
                    <label
                      htmlFor="codePostal"
                      className="block text-xs xs:text-sm font-semibold text-slate-700 mb-1 xs:mb-2"
                    >
                      Code postal <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="codePostal"
                      name="codePostal"
                      value={formData.codePostal}
                      onChange={handleInputChange}
                      maxLength="10"
                      placeholder="Ex: 75001 ou 1012"
                      className={`w-full px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 text-sm xs:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.codePostal ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.codePostal && (
                      <p className="text-red-600 text-xs xs:text-sm mt-1">
                        {errors.codePostal}
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <label
                      htmlFor="ville"
                      className="block text-xs xs:text-sm font-semibold text-slate-700 mb-1 xs:mb-2"
                    >
                      Ville <span className="text-red-600">*</span>
                      {loadingCity && (
                        <span className="ml-2 text-xs text-gray-500">
                          Recherche...
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      id="ville"
                      name="ville"
                      value={formData.ville}
                      onChange={handleInputChange}
                      className={`w-full px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 text-sm xs:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.ville ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.ville && (
                      <p className="text-red-600 text-xs xs:text-sm mt-1">
                        {errors.ville}
                      </p>
                    )}

                    {/* Liste déroulante des suggestions de villes */}
                    {suggestedCities.length > 1 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                        {suggestedCities.map((city, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleCitySelect(city)}
                            className="w-full text-left px-3 py-2 hover:bg-blue-50 text-sm border-b border-gray-100 last:border-b-0"
                          >
                            {city}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="pays"
                      className="block text-xs xs:text-sm font-semibold text-slate-700 mb-1 xs:mb-2"
                    >
                      Zone <span className="text-red-600">*</span>
                    </label>
                    {loadingCountries ? (
                      <div className="w-full px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 text-sm xs:text-base border border-gray-300 rounded-lg bg-gray-100">
                        Chargement...
                      </div>
                    ) : (
                      <select
                        id="pays"
                        name="pays"
                        value={selectedCountry?.id || ""}
                        onChange={handleCountryChange}
                        className={`w-full px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 text-sm xs:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.pays ? "border-red-500" : "border-gray-300"
                        }`}
                      >
                        <option value="">Choisir une Zone</option>
                        {countries.map((country) => (
                          <option key={country.id} value={country.id}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                    )}
                    {errors.pays && (
                      <p className="text-red-600 text-xs xs:text-sm mt-1">
                        {errors.pays}
                      </p>
                    )}
                  </div>
                </div>

                {/* Section Paiement */}
                <div className="pt-4 xs:pt-6 mt-4 xs:mt-6 border-t border-gray-300">
                  <h2 className="text-base xs:text-lg sm:text-xl font-bold text-slate-700 mb-3 xs:mb-4">
                    Paiement sécurisé
                  </h2>

                  <div className="border border-gray-300 rounded-lg p-3 xs:p-4 bg-gray-50">
                    <div className="flex items-center gap-2 xs:gap-3 mb-2 xs:mb-3">
                      <img
                        src={visa}
                        alt="Visa"
                        className="h-5 xs:h-6 sm:h-8 w-auto"
                      />
                      <img
                        src={master}
                        alt="Mastercard"
                        className="h-5 xs:h-6 sm:h-8 w-auto"
                      />
                      <img
                        src={amex}
                        alt="American Express"
                        className="h-5 xs:h-6 sm:h-8 w-auto"
                      />
                    </div>
                    <p className="text-xs xs:text-sm text-gray-600">
                      Vous serez redirigé vers la page de paiement sécurisée
                      Stripe pour finaliser votre achat.
                    </p>
                  </div>
                </div>

                {/* Message d'erreur */}
                {submitError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 xs:p-4 text-red-700">
                    <p className="font-semibold text-xs xs:text-sm">Erreur:</p>
                    <p className="text-xs xs:text-sm">{submitError}</p>
                  </div>
                )}

                {/* Bouton de soumission */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-green-600 text-white py-2.5 xs:py-3 sm:py-4 rounded-lg font-bold text-sm xs:text-base sm:text-lg hover:bg-green-700 transition ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-4 xs:h-5 w-4 xs:w-5"
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
                      Traitement en cours...
                    </span>
                  ) : (
                    `Payer ${formatPrice(calculateTotal())}`
                  )}
                </button>

                {/* Sécurité */}
                <div className="flex items-center justify-center gap-2 text-xs xs:text-sm text-gray-600">
                  <svg
                    className="w-4 xs:w-5 h-4 xs:h-5 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Paiement 100% sécurisé via Stripe</span>
                </div>
              </form>
            </div>
          </div>

          {/* Récapitulatif de commande */}
          <div className="lg:col-span-1 flex lg:mt-28 relative bottom-3">
            <div className="bg-white rounded-lg shadow-xl p-3 xs:p-4 sm:p-6 w-full lg:sticky lg:top-8 lg:self-start">
              <h2 className="text-base xs:text-lg sm:text-xl font-bold text-slate-700 mb-3 xs:mb-4">
                Récapitulatif
              </h2>

              {/* Liste des articles */}
              <div className="space-y-3 xs:space-y-4 mb-4 xs:mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-2 xs:gap-3">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-12 xs:w-14 sm:w-16 h-16 xs:h-18 sm:h-20 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 xs:w-14 sm:w-16 h-16 xs:h-18 sm:h-20 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">
                        No img
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-xs xs:text-sm text-slate-700 line-clamp-2">
                        {item.title}
                      </p>
                      <p className="text-xs xs:text-sm text-gray-500">
                        Qté: {item.quantity}
                      </p>
                      <p className="text-xs xs:text-sm font-semibold">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totaux */}
              <div className="border-t border-gray-200 pt-3 xs:pt-4 space-y-1.5 xs:space-y-2">
                <div className="flex justify-between text-xs xs:text-sm">
                  <span>Sous-total</span>
                  <span className="font-semibold">
                    {formatPrice(calculateSubtotal())}
                  </span>
                </div>
                <div className="flex justify-between text-xs xs:text-sm">
                  <span className="truncate mr-2">
                    Livraison ({selectedCountry?.name || "..."})
                  </span>
                  <span className="font-semibold whitespace-nowrap">
                    {formatPrice(getShippingCost())}
                  </span>
                </div>
                <div className="flex justify-between text-base xs:text-lg font-bold border-t border-gray-200 pt-1.5 xs:pt-2 mt-1.5 xs:mt-2">
                  <span>Total</span>
                  <span className="text-green-600">
                    {formatPrice(calculateTotal())}
                  </span>
                </div>
              </div>

              {/* Lien retour panier */}
              <Link
                to="/cart"
                className="block text-center text-blue-600 hover:underline mt-3 xs:mt-4 text-xs xs:text-sm"
              >
                ← Modifier le panier
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
