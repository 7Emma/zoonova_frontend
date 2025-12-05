import logo2 from "../../assets/logo/logo_copie.png";
import instagram from "../../assets/reseau/instagram1.png";
import visa from "../../assets/png_rez/visa.png";
import mastercard from "../../assets/png_rez/Master2.png";
import amex from "../../assets/png_rez/amex2.png";
import { Link } from "react-router-dom";

// ============ FOOTER COMPONENT ============
const Footer = () => {
  return (
    <>
      {/* Trait noir */}
      <div className="border-b-[1px] border-black w-full"></div>

      <footer
        className="w-full bg-gradient-to-r from-slate-700 to-[#A8C0C7] text-white py-10 mt-1"
        style={{ fontFamily: "Arial, sans-serif", marginRight: "calc(50% - 50vw)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Section 1 - Zoonova */}
            <div className="text-sm">
              <Link to="/" className="mb-4">
                <img src={logo2} alt="Zoonova Logo" className="h-6 w-auto" />
              </Link>
              <p className="mb-2">
                <Link to="/nacreale" className="hover:underline">
                  © Nacreale Editions
                </Link>
              </p>
              <p className="mb-4 leading-relaxed">
                Une collection de livres jeunesse
                <br />
                destinée aux enfants de 4 à 10 ans
              </p>
              <p className="mt-6 mb-2 font-semibold text-xl">Rejoignez-nous sur</p>
              <a
                href="https://www.instagram.com/zoonova_book"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:scale-105 transition-transform"
              >
                <img src={instagram} alt="Instagram" className="h-8 w-auto" />
              </a>
            </div>

            {/* Section 2 - A propos */}
            <div className="text-sm">
              <h5 className="font-bold mb-4 text-xl">A propos</h5>
              <Link
                to="/nacreale"
                className="flex items-center gap-2 mb-3 hover:underline group"
              >
                <span className="w-2 h-2 rounded-full bg-pink-500 group-hover:scale-125 transition-transform"></span>
                Découvrir Nacréale Editions
              </Link>
              <Link
                to="/contact"
                className="flex items-center gap-2 mb-3 hover:underline group"
              >
                <span className="w-2 h-2 rounded-full bg-red-500 group-hover:scale-125 transition-transform"></span>
                Nous contacter
              </Link>
            </div>

            {/* Section 3 - Informations */}
            <div className="text-sm">
              <h5 className="font-bold mb-4 text-xl">Informations</h5>
              <Link
                to="/politiques"
                className="flex items-center gap-2 mb-3 hover:underline group"
              >
                <span className="w-2 h-2 rounded-full bg-green-500 group-hover:scale-125 transition-transform"></span>
                Politique de confidentialité
              </Link>
              <Link
                to="/mentions"
                className="flex items-center gap-2 mb-3 hover:underline group"
              >
                <span className="w-2 h-2 rounded-full bg-green-400 group-hover:scale-125 transition-transform"></span>
                Mentions légales
              </Link>
            </div>

            {/* Section 4 - Ma commande */}
            <div className="text-sm">
              <h5 className="font-bold mb-4 text-xl">Ma commande</h5>
              <Link
                to="/order"
                className="flex items-center gap-2 mb-3 hover:underline group"
              >
                <span className="w-2 h-2 rounded-full bg-blue-500 group-hover:scale-125 transition-transform"></span>
                Mes commandes
              </Link>
              <Link
                to="/cart"
                className="flex items-center gap-2 mb-3 hover:underline group"
              >
                <span className="w-2 h-2 rounded-full bg-blue-400 group-hover:scale-125 transition-transform"></span>
                Mon panier
              </Link>

              {/* Payment Methods */}
              <div className="mt-6">
                <p className="mb-3 font-semibold text-xl">Paiement sécurisé</p>
                <div className="flex gap-3 items-center">
                  <div className="px-2 py-1 h-6 flex items-center justify-center">
                    <img src={visa} alt="Visa" className="h-8 w-auto" />
                  </div>
                  <div className="px-2 py-1 flex items-center justify-center">
                    <img
                      src={mastercard}
                      alt="Mastercard"
                      className="h-6 w-auto"
                    />
                  </div>
                  <div className="px-2 py-1 flex items-center justify-center">
                    <img
                      src={amex}
                      alt="American Express"
                      className="h-6 w-6"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center mt-8 pt-5 border-t border-white/20 text-xs">
            2025 © Zoonova - Tous droits réservés Nacreale Editions | Conception
            : @ManuCoder
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
