import React, { useState } from "react";
import castor from "../assets/figures/castor.png";
import flamant from "../assets/figures/Flamant.png";
import instagram from "../assets/reseau/instagram1.png";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.prenom.trim()) {
      newErrors.prenom = "Le prénom est requis";
    }

    if (!formData.nom.trim()) {
      newErrors.nom = "Le nom est requis";
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email invalide";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Le message est requis";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Le message doit contenir au moins 10 caractères";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      console.log("Contact form submitted:", formData);
      setSubmitSuccess(true);
      setIsSubmitting(false);

      // Reset form
      setFormData({
        prenom: "",
        nom: "",
        email: "",
        message: "",
      });

      // Hide success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }, 1500);
  };

  return (
    <div
      className="min-h-screen py-10 px-4 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #E8F5E3 0%, #FFF9E6 25%, #FFE8F0 50%, #E8D5FF 75%, #FFE5D9 100%)",
      }}
    >
      <div className="max-w-6xl mx-auto relative z-10">
        <h2
          className="text-4xl md:text-5xl font-bowlby text-center mb-10 text-slate-700"
          style={{
            color: "white",
            WebkitTextStroke: "1px #000000",
          }}
        >
          Contact
        </h2>

        <div className="flex items-center gap-6 md:gap-8">
          {/* Image Gauche */}
          <img
            src={castor}
            alt="castor"
            className="hidden lg:block h-48 opacity-40 flex-shrink-0"
          />

          <div className="p-6 md:p-10 flex-1">
            {/* Success Message */}
            {submitSuccess && (
              <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center gap-3">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-semibold">
                  Votre message a été envoyé avec succès !
                </span>
              </div>
            )}

            <div className="space-y-6">
              {/* Prénom et Nom */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    className={`w-full px-0 py-3 border-b-2 border-t-0 border-l-0 border-r-0 focus:outline-none focus:ring-0 transition bg-transparent ${
                      errors.prenom ? "border-b-red-500" : "border-b-gray-300"
                    }`}
                    placeholder="Votre prénom"
                  />
                  {errors.prenom && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.prenom}
                    </p>
                  )}
                </div>

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
                    className={`w-full px-0 py-3 border-b-2 border-t-0 border-l-0 border-r-0 focus:outline-none focus:ring-0 transition bg-transparent ${
                      errors.nom ? "border-b-red-500" : "border-b-gray-300"
                    }`}
                    placeholder="Votre nom"
                  />
                  {errors.nom && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.nom}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  E-mail <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-0 py-3 border-b-2 border-t-0 border-l-0 border-r-0 focus:outline-none focus:ring-0 transition bg-transparent ${
                    errors.email ? "border-b-red-500" : "border-b-gray-300"
                  }`}
                  placeholder="votre.email@exemple.com"
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Message <span className="text-red-600">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="6"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none bg-transparent text-slate-700 ${
                    errors.message ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Écrivez votre message ici..."
                />
                <div className="flex justify-between items-start mt-1">
                  {errors.message ? (
                    <p className="text-red-600 text-sm flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.message}
                    </p>
                  ) : (
                    <span className="text-sm text-gray-500">
                      {formData.message.length} caractères
                    </span>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-full bg-slate-800 text-yellow-400 py-4 rounded-lg font-bold text-lg hover:bg-slate-900 transition flex items-center justify-center gap-2 ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
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
                    Envoi en cours...
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
                        strokeWidth="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    Envoyer
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Image Droite */}
          <img
            src={flamant}
            alt="castor"
            className="hidden lg:block h-48 opacity-40 flex-shrink-0"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
