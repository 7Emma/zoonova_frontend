import React from "react";
import { Link } from "react-router-dom";
import logo2 from "../../assets/logo/logo_copie.png";
import instagram from "../../assets/reseau/instagram1.png";
import visa from "../../assets/png_rez/visa.png";
import mastercard from "../../assets/png_rez/Master2.png";
import amex from "../../assets/png_rez/amex2.png";

// ============ FOOTER COMPONENT ============
const Footer = () => {
  return (
    <>
      {/* Trait noir */}
      <div className="border-b-[1px] border-black w-full"></div>

      <footer
        className="w-full bg-gradient-to-r from-slate-700 to-[#A8C0C7] text-white py-6 mt-1"
        style={{ fontFamily: "Arial, sans-serif", marginRight: "calc(50% - 50vw)"}}
      >
        <div className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-6">
          <div className="w-full flex flex-col md:flex-row md:justify-between gap-6 sm:gap-8">
            
            {/* Section 1 - Zoonova */}
            <div className="text-sm md:ml-0 lg:ml-10">
              <Link to="/" className="block mb-3 sm:mb-4">
                <img src={logo2} alt="Zoonova Logo" className="h-5 sm:h-6 w-auto" />
              </Link>
              <p className="mb-2 text-xs sm:text-sm">
                <Link to="/nacreale" className="hover:underline">
                  © Nacreale Editions
                </Link>
              </p>
              <p className="mb-3 sm:mb-4 leading-relaxed text-xs sm:text-sm">
                Une collection de livres jeunesse
                <br />
                destinée aux enfants de 4 à 10 ans
              </p>
              <p className="mt-4 sm:mt-6 mb-2 font-semibold text-base sm:text-xl">
                Rejoignez-nous sur
              </p>
              <a
                href="https://www.instagram.com/zoonova_book"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:scale-105 transition-transform"
              >
                <img src={instagram} alt="Instagram" className="h-7 sm:h-8 w-auto" />
              </a>
            </div>

            {/* Section 2 - A propos */}
            <div className="text-sm">
              <h5 className="font-bold mb-3 sm:mb-4 text-base sm:text-xl">
                A propos
              </h5>
              <Link
                to="/nacreale"
                className="flex items-center gap-2 mb-2 sm:mb-3 hover:underline group text-xs sm:text-sm"
              >
                <span className="w-2 h-2 rounded-full bg-red-500 group-hover:scale-125 transition-transform flex-shrink-0"></span>
                <span>Découvrir Nacréale Editions</span>
              </Link>
              <Link
                to="/contact"
                className="flex items-center gap-2 mb-2 sm:mb-3 hover:underline group text-xs sm:text-sm"
              >
                <span className="w-2 h-2 rounded-full bg-red-500 group-hover:scale-125 transition-transform flex-shrink-0"></span>
                <span>Nous contacter</span>
              </Link>
            </div>

            {/* Section 3 - Informations */}
            <div className="text-sm">
              <h5 className="font-bold mb-3 sm:mb-4 text-base sm:text-xl">
                Informations
              </h5>
              <Link
                to="/politiques"
                className="flex items-center gap-2 mb-2 sm:mb-3 hover:underline group text-xs sm:text-sm"
              >
                <span className="w-2 h-2 rounded-full bg-green-500 group-hover:scale-125 transition-transform flex-shrink-0"></span>
                <span>Politique de confidentialité</span>
              </Link>
              <Link
                to="/mentions"
                className="flex items-center gap-2 mb-2 sm:mb-3 hover:underline group text-xs sm:text-sm"
              >
                <span className="w-2 h-2 rounded-full bg-green-500 group-hover:scale-125 transition-transform flex-shrink-0"></span>
                <span>Mentions légales</span>
              </Link>
            </div>

            {/* Section 4 - Ma commande */}
            <div className="text-sm md:mr-0 lg:mr-8">
              <h5 className="font-bold mb-3 sm:mb-4 text-base sm:text-xl">
                Ma commande
              </h5>
              <Link
                to="/order"
                className="flex items-center gap-2 mb-2 sm:mb-3 hover:underline group text-xs sm:text-sm"
              >
                <span className="w-2 h-2 rounded-full bg-blue-500 group-hover:scale-125 transition-transform flex-shrink-0"></span>
                <span>Mes commandes</span>
              </Link>
              <Link
                to="/cart"
                className="flex items-center gap-2 mb-2 sm:mb-3 hover:underline group text-xs sm:text-sm"
              >
                <span className="w-2 h-2 rounded-full bg-blue-500 group-hover:scale-125 transition-transform flex-shrink-0"></span>
                <span>Mon panier</span>
              </Link>

              {/* Payment Methods */}
              <div className="mt-4 sm:mt-6">
                <p className="mb-2 sm:mb-3 font-semibold text-base sm:text-xl">
                  Paiement sécurisé
                </p>
                <div className="flex gap-2 sm:gap-3 items-center flex-wrap">
                  <div className="px-1 sm:px-2 py-1 h-5 sm:h-6 flex items-center justify-center">
                    <img src={visa} alt="Visa" className="h-6 sm:h-8 w-auto" />
                  </div>
                  <div className="px-1 sm:px-2 py-1 flex items-center justify-center">
                    <img
                      src={mastercard}
                      alt="Mastercard"
                      className="h-5 sm:h-6 w-auto"
                    />
                  </div>
                  <div className="px-1 sm:px-2 py-1 flex items-center justify-center">
                    <img
                      src={amex}
                      alt="American Express"
                      className="h-5 sm:h-6 w-5 sm:w-6"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center mt-6 sm:mt-8 pt-4 sm:pt-5 border-t border-white/20 text-[10px] sm:text-xs">
            2025 © Zoonova - Tous droits réservés Nacreale Editions
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;