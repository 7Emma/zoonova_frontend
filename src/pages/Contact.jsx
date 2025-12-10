import React, { useState } from "react";
import castor from "../assets/figures/castor.png";
import flamant from "../assets/figures/Flamant.png";
import contactService from "../services/contactService";

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
  const [submitError, setSubmitError] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const payload = {
        first_name: formData.prenom,
        last_name: formData.nom,
        email: formData.email,
        message: formData.message,
      };

      await contactService.createMessage(payload);

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
    } catch (error) {
      let errorMsg = "Une erreur est survenue lors de l'envoi du message.";
      
      // Gérer les erreurs de validation du backend
      if (error.data) {
        if (typeof error.data === 'object') {
          // Récupérer le premier message d'erreur du backend
          const firstError = Object.values(error.data)[0];
          if (Array.isArray(firstError)) {
            errorMsg = firstError[0];
          } else if (typeof firstError === 'string') {
            errorMsg = firstError;
          }
        } else if (typeof error.data === 'string') {
          errorMsg = error.data;
        }
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      setSubmitError(errorMsg);
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen py-4 xs:py-6 sm:py-10 px-2 xs:px-3 sm:px-4 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #E8F5E3 0%, #FFF9E6 25%, #FFE8F0 50%, #E8D5FF 75%, #FFE5D9 100%)",
      }}
    >
      <div className="max-w-6xl mx-auto relative z-10 p-2 xs:p-4 sm:p-6 lg:p-10 flex flex-col items-center">
        <h2
          className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-bowlby text-center mb-4 xs:mb-6 sm:mb-8 text-slate-700 w-full"
          style={{
            color: "white",
            WebkitTextStroke: "0.5px #000000",
          }}
        >
          Contact
        </h2>

        <div className="w-full flex flex-col lg:flex-row items-end justify-center gap-0">
          {/* Image Gauche - Desktop */}
          <div className="hidden lg:flex lg:w-1/5 justify-center items-end">
            <img
              src={castor}
              alt="castor"
              className="h-48 flex-shrink-0 mb-10"
            />
          </div>

          <div className="p-3 xs:p-4 sm:p-6 md:p-10 w-full lg:w-3/5 flex flex-col">
            {/* Success Message */}
            {submitSuccess && (
              <div className="mb-4 xs:mb-6 bg-green-100 border border-green-400 text-green-700 px-3 xs:px-4 py-2 xs:py-3 rounded-lg flex items-center gap-2 xs:gap-3">
                <svg
                  className="w-5 h-5 xs:w-6 xs:h-6 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-semibold text-xs xs:text-sm sm:text-base">
                  Votre message a été envoyé avec succès !
                </span>
              </div>
            )}

            {/* Error Message */}
            {submitError && (
              <div className="mb-4 xs:mb-6 bg-red-100 border border-red-400 text-red-700 px-3 xs:px-4 py-2 xs:py-3 rounded-lg">
                <p className="font-semibold text-xs xs:text-sm sm:text-base">
                  Erreur:
                </p>
                <p className="text-xs xs:text-sm">{submitError}</p>
              </div>
            )}

            <div className="space-y-4 xs:space-y-5 sm:space-y-6 flex-1">
              {/* Prénom et Nom */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 xs:gap-4">
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
                    className={`w-full px-0 py-2 xs:py-3 text-sm xs:text-base border-b-2 border-t-0 border-l-0 border-r-0 focus:outline-none focus:ring-0 transition bg-transparent ${
                      errors.prenom ? "border-b-red-500" : "border-b-gray-300"
                    }`}
                  />
                  {errors.prenom && (
                    <p className="text-red-600 text-xs xs:text-sm mt-1 flex items-center gap-1">
                      <svg
                        className="w-3 h-3 xs:w-4 xs:h-4 flex-shrink-0"
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
                    className={`w-full px-0 py-2 xs:py-3 text-sm xs:text-base border-b-2 border-t-0 border-l-0 border-r-0 focus:outline-none focus:ring-0 transition bg-transparent ${
                      errors.nom ? "border-b-red-500" : "border-b-gray-300"
                    }`}
                  />
                  {errors.nom && (
                    <p className="text-red-600 text-xs xs:text-sm mt-1 flex items-center gap-1">
                      <svg
                        className="w-3 h-3 xs:w-4 xs:h-4 flex-shrink-0"
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
                  className="block text-xs xs:text-sm font-semibold text-slate-700 mb-1 xs:mb-2"
                >
                  E-mail <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-0 py-2 xs:py-3 text-sm xs:text-base border-b-2 border-t-0 border-l-0 border-r-0 focus:outline-none focus:ring-0 transition bg-transparent ${
                    errors.email ? "border-b-red-500" : "border-b-gray-300"
                  }`}
                />
                {errors.email && (
                  <p className="text-red-600 text-xs xs:text-sm mt-1 flex items-center gap-1">
                    <svg
                      className="w-3 h-3 xs:w-4 xs:h-4 flex-shrink-0"
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
                  className="block text-xs xs:text-sm font-semibold text-slate-700 mb-1 xs:mb-2"
                >
                  Message <span className="text-red-600">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="5"
                  className={`w-full px-3 xs:px-4 py-2 xs:py-3 text-sm xs:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none bg-transparent text-slate-700 ${
                    errors.message ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Écrivez votre message ici..."
                />
                <div className="flex justify-between items-start mt-1">
                  {errors.message ? (
                    <p className="text-red-600 text-xs xs:text-sm flex items-center gap-1">
                      <svg
                        className="w-3 h-3 xs:w-4 xs:h-4 flex-shrink-0"
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
                    <span className="text-xs xs:text-sm text-gray-500">
                      {formData.message.length} caractères
                    </span>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-full bg-black text-yellow-400 py-2.5 xs:py-3 sm:py-4 font-bold text-sm xs:text-base sm:text-lg hover:bg-slate-900 transition flex items-center justify-center gap-2 ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
                  <>
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
                    <span className="text-xs xs:text-sm sm:text-base">
                      Envoi en cours...
                    </span>
                  </>
                ) : (
                  "Envoyer"
                )}
              </button>
            </div>
          </div>

          {/* Image Droite - Desktop */}
          <div className="hidden lg:flex lg:w-1/5 justify-center items-end">
            <img
              src={flamant}
              alt="flamant"
              className="h-60 flex-shrink-0 mb-10"
            />
          </div>

          {/* Images Mobile en bas */}
          <div className="lg:hidden flex w-full justify-center items-end gap-4 xs:gap-6 sm:gap-8 mt-4 xs:mt-6 sm:mt-8">
            <img
              src={castor}
              alt="castor"
              className="h-24 xs:h-28 sm:h-32 flex-shrink-0"
            />
            <img
              src={flamant}
              alt="flamant"
              className="h-28 xs:h-32 sm:h-40 flex-shrink-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
