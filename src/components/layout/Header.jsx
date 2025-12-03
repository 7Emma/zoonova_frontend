import { useState } from "react";
import logo from "../../assets/logo/logo_copie.png";
import A from "../../assets/A_Z/Zoonova_burger_A.png";
import Z from "../../assets/A_Z/Zoonova_burger_Z.png";
import instagram from "../../assets/reseau/instagram1.png";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import useCart from "../../hooks/useCart";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getCartCount } = useCart();
  const cartItemCount = getCartCount();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header className="relative z-50 bg-gradient-to-r from-slate-600 to-slate-300 shadow-md">
        <div className="container mx-auto px-6 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16 md:h-20">
            {/* --- SECTION CENTRE (Logo Absolu) --- */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0">
              <Link
                to="/"
                className="block hover:scale-105 transition-transform"
              >
                <img
                  src={logo}
                  alt="Logo Zoonova"
                  className="h-6 sm:h-10 md:h-12 w-auto object-contain"
                />
              </Link>
            </div>

            {/* --- SECTION DROITE (A + Burger + Z) --- */}
            <div className="flex items-center gap-0 z-10">
              {/* Lettre A - Très proche du menu */}
              <img
                src={A}
                alt=""
                className="h-5 sm:h-8 md:h-10 w-auto brightness-0 invert -mr-1 sm:-mr-2"
              />

              {/* Bouton Burger */}
              <button
                onClick={toggleMenu}
                className="relative flex flex-col justify-center items-center 
                w-9 h-9 sm:w-14 sm:h-12 
                gap-0.5 sm:gap-1.5 
                bg-[#CC99CE] rounded-full 
                hover:brightness-110 transition-all hover:shadow-lg group z-20"
                aria-label="Menu"
              >
                <span
                  className={`block w-4 sm:w-6 h-0.5 sm:h-1 bg-white transition-all duration-300 rounded-lg ${
                    isMenuOpen
                      ? "rotate-45 translate-y-1.5 sm:translate-y-2.5"
                      : ""
                  }`}
                ></span>
                <span
                  className={`block w-4 sm:w-6 h-0.5 sm:h-1 bg-white transition-all duration-300 rounded-lg ${
                    isMenuOpen ? "opacity-0" : ""
                  }`}
                ></span>
                <span
                  className={`block w-4 sm:w-6 h-0.5 sm:h-1 bg-white transition-all duration-300 rounded-lg ${
                    isMenuOpen
                      ? "-rotate-45 -translate-y-1.5 sm:-translate-y-2.5"
                      : ""
                  }`}
                ></span>
              </button>

              {/* Lettre Z - Très proche du menu */}
              <img
                src={Z}
                alt=""
                className="h-5 sm:h-8 md:h-10 w-auto brightness-0 invert -ml-1 sm:-ml-2"
              />
            </div>

            {/* --- SECTION GAUCHE (Panier, Insta, Commande) --- */}
            <div className="flex items-center gap-2 sm:gap-2 z-4">
              {/* Panier avec badge rouge */}
              <Link
                to="/cart"
                className="relative text-white hover:text-[#f9ba79] transition-colors p-1.5 sm:p-2 bg-white rounded-lg"
                aria-label="Panier"
              >
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400" />
                <span className="absolute -top-1 -right-1 bg-white text-slate-400 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              </Link>

              {/* Instagram Icone */}
              <a
                href="https://www.instagram.com/zoonova_book/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform p-1"
                aria-label="Instagram"
              >
                <img
                  src={instagram}
                  className="h-6 sm:h-8 md:h-10 w-auto"
                  alt="Instagram"
                />
              </a>

              {/* Bouton Commander - MASQUÉ SUR MOBILE */}
              <Link
                to="/order"
                className="hidden sm:flex items-center justify-center border border-white text-white 
                px-4 py-2 text-base 
                rounded-lg font-medium transition-all duration-300 hover:bg-white/10 hover:shadow-md whitespace-nowrap"
              >
               Ma Commander
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* --- MENU DÉROULANT --- */}
      <nav
        className={`fixed top-16 md:top-20 left-0 
        w-full sm:w-80 
        bg-gradient-to-r from-slate-600 to-slate-500 text-white
        shadow-2xl transform transition-all duration-300 ease-in-out z-40 overflow-hidden rounded-bl-xl
        ${
          isMenuOpen
            ? "max-h-screen opacity-100 translate-y-0"
            : "max-h-0 opacity-0 -translate-y-4"
        }`}
      >
        <div className="flex flex-col py-6 px-6 sm:px-8 space-y-2">
          {/* Lien Accueil */}
          <Link
            to="/"
            className="block py-3 px-4 hover:bg-[#f9ba79]/30 rounded-lg transition-all text-base sm:text-lg font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            Accueil
          </Link>

          {/* Lien Panier */}
          <Link
            to="/cart"
            className="block py-3 px-4 hover:bg-[#f9ba79]/30 rounded-lg transition-all text-base sm:text-lg font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            Panier
          </Link>

          {/* Lien Commande */}
          <Link
            to="/order"
            className="block py-3 px-4 hover:bg-[#f9ba79]/30 rounded-lg transition-all text-base sm:text-lg font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            Commande
          </Link>

          {/* Lien Contact avec icône */}
          <Link
            to="/contact"
            className="flex items-center gap-2 py-3 px-4 hover:bg-[#f9ba79]/30 rounded-lg transition-all text-base sm:text-lg font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </Link>

          <div className="pt-4 mt-2 border-t border-white/20">
            <Link
              to="/mentions"
              className="block py-2 px-4 hover:bg-[#f9ba79]/30 rounded-lg transition-all text-sm"
              onClick={() => setIsMenuOpen(false)}
            >
              Mentions légales
            </Link>
            <Link
              to="/politiques"
              className="block py-2 px-4 hover:bg-[#f9ba79]/30 rounded-lg transition-all text-sm"
              onClick={() => setIsMenuOpen(false)}
            >
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </nav>
      {/* Espace blanc */}
      <div className="h-1 bg-white"></div>

      {/* Trait noir */}
      <div className="border-b-2 border-black"></div>
      {/* Overlay sombre */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 top-16 md:top-20"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
}
