import React, { useState, useRef } from "react";
import visa from "../assets/png/visa.png";
import master from "../assets/png//Master.png";
import amex from "../assets/png/amex2.jpg";
import Payment from "../components/Paiement";

const CheckoutPage = () => {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    voie: "",
    numeroVoie: "",
    complementAdresse: "",
    codePostal: "",
    ville: "",
    pays: "",
  });

  const cardElement = useRef(null);
  const [suggestions, setSuggestions] = useState([]);
  const [totalPrice, setTotalPrice] = useState(17.48);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const countries = [
    { code: "", name: "Choisir un pays" },
    { code: "DE", name: "Allemagne" },
    { code: "AT", name: "Autriche" },
    { code: "BE", name: "Belgique" },
    { code: "BG", name: "Bulgarie" },
    { code: "CY", name: "Chypre" },
    { code: "HR", name: "Croatie" },
    { code: "DK", name: "Danemark" },
    { code: "ES", name: "Espagne" },
    { code: "EE", name: "Estonie" },
    { code: "FI", name: "Finlande" },
    { code: "FR", name: "France" },
    { code: "GR", name: "Grèce" },
    { code: "HU", name: "Hongrie" },
    { code: "IE", name: "Irlande" },
    { code: "IT", name: "Italie" },
    { code: "LV", name: "Lettonie" },
    { code: "LT", name: "Lituanie" },
    { code: "LU", name: "Luxembourg" },
    { code: "MT", name: "Malte" },
    { code: "NL", name: "Pays-Bas" },
    { code: "PL", name: "Pologne" },
    { code: "PT", name: "Portugal" },
    { code: "CZ", name: "République tchèque" },
    { code: "RO", name: "Roumanie" },
    { code: "SK", name: "Slovaquie" },
    { code: "SI", name: "Slovénie" },
    { code: "SE", name: "Suède" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handlePostalCodeChange = (e) => {
    const value = e.target.value;
    handleInputChange(e);

    if (value.length >= 4) {
      const mockSuggestions = [
        { text: "Paris" },
        { text: "Lyon" },
        { text: "Marseille" },
      ];
      setSuggestions(mockSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const selectCity = (cityName) => {
    setFormData((prev) => ({
      ...prev,
      ville: cityName,
    }));
    setSuggestions([]);
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
    if (!formData.voie.trim()) newErrors.voie = "La voie est requise";
    if (!formData.numeroVoie)
      newErrors.numeroVoie = "Le numéro de voie est requis";
    if (!formData.codePostal.trim())
      newErrors.codePostal = "Le code postal est requis";
    if (!formData.ville.trim()) newErrors.ville = "La ville est requise";
    if (!formData.pays) newErrors.pays = "Le pays est requis";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      console.log("Form submitted:", formData);
      alert("Commande passée avec succès !");
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <div
      className="min-h-screen py-10 px-4"
      style={{
        background:
          "linear-gradient(135deg, #E8F5E3 0%, #FFF9E6 25%, #FFE8F0 50%, #E8D5FF 75%, #FFE5D9 100%)",
      }}
    >
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10 text-slate-700">
          Paiement sécurisé
        </h1>

        <div className="bg-white rounded-lg shadow-xl p-6 md:p-10">
          <div className="space-y-6">
            {/* Nom et Prénom */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="nom"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Nom <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="nom"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.nom ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.nom && (
                  <p className="text-red-600 text-sm mt-1">{errors.nom}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="prenom"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Prénom <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="prenom"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.prenom ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.prenom && (
                  <p className="text-red-600 text-sm mt-1">{errors.prenom}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Email <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Voie et Numéro */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label
                  htmlFor="voie"
                  className="block text-sm font-semibold text-slate-700 mb-2"
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
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.voie ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.voie && (
                  <p className="text-red-600 text-sm mt-1">{errors.voie}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="numeroVoie"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  N° <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  id="numeroVoie"
                  name="numeroVoie"
                  value={formData.numeroVoie}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.numeroVoie ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.numeroVoie && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.numeroVoie}
                  </p>
                )}
              </div>
            </div>

            {/* Complément d'adresse */}
            <div>
              <label
                htmlFor="complementAdresse"
                className="block text-sm font-semibold text-slate-700 mb-2"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Code Postal et Ville */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="codePostal"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Code postal <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="codePostal"
                  name="codePostal"
                  value={formData.codePostal}
                  onChange={handlePostalCodeChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.codePostal ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.codePostal && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.codePostal}
                  </p>
                )}
              </div>

              <div className="relative">
                <label
                  htmlFor="ville"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Ville <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="ville"
                  name="ville"
                  value={formData.ville}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.ville ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.ville && (
                  <p className="text-red-600 text-sm mt-1">{errors.ville}</p>
                )}

                {suggestions.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg">
                    {suggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        onClick={() => selectCity(suggestion.text)}
                        className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                      >
                        {suggestion.text}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Pays */}
            <div>
              <label
                htmlFor="pays"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Pays <span className="text-red-600">*</span>
              </label>
              <select
                id="pays"
                name="pays"
                value={formData.pays}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.pays ? "border-red-500" : "border-gray-300"
                }`}
              >
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
              {errors.pays && (
                <p className="text-red-600 text-sm mt-1">{errors.pays}</p>
              )}
            </div>

            <div className="pt-4 mt-4 border-t border-gray-300">
              {/* Label du champ de carte bancaire */}
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Carte bancaire <span className="text-red-600">*</span>
              </label>

              {/* Cadre principal de la section de paiement */}
              <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                {/* Logos des cartes */}
                <div className="flex items-center gap-2 mb-3">
                  {/* VISA */}
                  <div className="w-12 h-8 rounded flex items-center justify-center">
                    <img
                      src={visa}
                      alt="Logo Visa"
                      className="h-full w-auto object-contain"
                    />
                  </div>
                  {/* MASTERCARD */}
                  <div className="w-12 h-8 rounded flex items-center justify-center">
                    <img
                      src={master}
                      alt="Logo Mastercard"
                      className="h-full w-auto object-contain"
                    />
                  </div>
                  {/* AMEX */}
                  <div className="w-12 h-8 rounded flex items-center justify-center">
                    <img
                      src={amex}
                      alt="Logo American Express"
                      className="h-full w-auto object-contain"
                    />
                  </div>
                </div>

                {/* Texte de sécurité Stripe */}
                <p className="text-sm text-gray-600 mb-3">
                  Informations de paiement sécurisées par Stripe
                </p>

                {/* Emplacement pour l'élément de carte Stripe (l'iframe sécurisé) */}
                {/* C'est ici que l'élément Stripe doit être monté via votre logique Stripe React */}
                <div
                  id="card-element"
                  className="bg-white border border-gray-300 rounded p-3 text-sm text-gray-500"
                  ref={cardElement} // Si vous utilisez un `useRef` pour monter l'élément Stripe
                >
                  {/* Ce texte est un placeholder tant que Stripe.js n'a pas chargé l'iframe */}
                  Élément de carte Stripe (intégration nécessaire)
                </div>
              </div>
            </div>

            {/* Total Price */}
            <div className="flex justify-between items-center bg-slate-100 rounded-lg p-4 mt-6">
              <span className="text-lg font-bold text-slate-700">
                Prix total:
              </span>
              <span className="text-2xl font-bold text-green-600">
                {totalPrice.toFixed(2).replace(".", ",")} €
              </span>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
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
                  Traitement en cours...
                </span>
              ) : (
                "Passer la commande"
              )}
            </button>

            {/* Security Notice */}
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mt-4">
              <svg
                className="w-5 h-5 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Paiement 100% sécurisé</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
