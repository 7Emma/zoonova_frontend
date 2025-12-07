import { useState, useEffect } from "react";
import logo from "../../assets/logo/logo_copie.png";
import A from "../../assets/A_Z/Zoonova_burger_A.png";
import Z from "../../assets/A_Z/Zoonova_burger_Z.png";
import instagram from "../../assets/reseau/instagram1.png";
import { ShoppingCart } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import useCart from "../../hooks/useCart";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getCartCount } = useCart();
  const cartItemCount = getCartCount();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => location.pathname === path;

  // Ferme le menu quand on navigue vers une autre page
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header className="bg-gradient-to-r from-slate-600 to-slate-300 shadow-md">
        <div className="w-full px-1 xs:px-2 sm:px-6 lg:px-8 py-3 xs:py-4 sm:py-6">
          <div className="relative flex items-center justify-between">
            {/* --- SECTION CENTRE (Logo Absolu) --- */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0">
              <Link
                to="/"
                className="block transition-transform"
              >
                <img
                  src={logo}
                  alt="Logo Zoonova"
                  className="h-6 xs:h-7 sm:h-12 md:h-14 w-auto object-contain"
                />
              </Link>
            </div>

            {/* --- SECTION DROITE (A + Burger + Z) --- */}
            <div className="flex items-center gap-0 z-10 sm:ml-8 md:ml-[36px] lg:ml-[38px]">
              {/* Lettre A - Très proche du menu */}
              <img
                src={A}
                alt=""
                className="h-4 xs:h-5 sm:h-8 md:h-10 w-auto brightness-0 invert -mr-0.5 xs:-mr-1 sm:-mr-2"
              />

              {/* Bouton Burger */}
              <button
                onClick={toggleMenu}
                className="relative flex flex-col justify-center items-center 
                w-7 h-7 xs:w-8 xs:h-8 sm:w-14 sm:h-12 
                gap-0.5 xs:gap-0.5 sm:gap-1.5 
                bg-[#CC99CE] rounded-full 
                hover:brightness-110 transition-all hover:shadow-lg group z-20"
                aria-label="Menu"
              >
                <span
                  className={`block w-3 xs:w-3.5 sm:w-6 h-0.5 sm:h-1 bg-white transition-all duration-300 rounded-lg ${
                    isMenuOpen
                      ? "rotate-45 translate-y-1 xs:translate-y-1.5 sm:translate-y-2.5"
                      : ""
                  }`}
                ></span>
                <span
                  className={`block w-3 xs:w-3.5 sm:w-6 h-0.5 sm:h-1 bg-white transition-all duration-300 rounded-lg ${
                    isMenuOpen ? "opacity-0" : ""
                  }`}
                ></span>
                <span
                  className={`block w-3 xs:w-3.5 sm:w-6 h-0.5 sm:h-1 bg-white transition-all duration-300 rounded-lg ${
                    isMenuOpen
                      ? "-rotate-45 -translate-y-1 xs:-translate-y-1.5 sm:-translate-y-2.5"
                      : ""
                  }`}
                ></span>
              </button>

              {/* Lettre Z - Très proche du menu */}
              <img
                src={Z}
                alt=""
                className="h-4 xs:h-5 sm:h-8 md:h-10 w-auto brightness-0 invert -ml-0.5 xs:-ml-1 sm:-ml-2"
              />
            </div>

            {/* --- SECTION GAUCHE (Panier, Insta, Commande) --- */}
            <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 z-10">
              {/* Panier avec badge rouge */}
              <Link
                to="/cart"
                className="relative text-white hover:text-[#f9ba79] transition-colors p-1 xs:p-1.5 sm:p-2 bg-white rounded-md xs:rounded-lg"
                aria-label="Panier"
              >
                <ShoppingCart className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-slate-400" />
                <span className="absolute -top-0.5 -right-0.5 xs:-top-1 xs:-right-1 bg-white text-slate-400 text-[10px] xs:text-xs font-bold rounded-full w-4 h-4 xs:w-5 xs:h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              </Link>

              {/* Bouton Commander - MASQUÉ SUR MOBILE */}
              <Link
                to="/order"
                className="hidden lg:flex items-center justify-center border border-white text-white 
                px-4 py-2 text-base 
                rounded-lg font-medium transition-all duration-300 hover:bg-white/10 hover:shadow-md whitespace-nowrap"
              >
                Ma Commande
              </Link>

              {/* Instagram Icone */}
              <a
                href="https://www.instagram.com/zoonova_book/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform p-0.5 xs:p-1 mr-2 xs:mr-4 sm:mr-8"
                aria-label="Instagram"
              >
                <img
                  src={instagram}
                  className="h-5 xs:h-6 sm:h-8 md:h-10 w-auto"
                  alt="Instagram"
                />
              </a>
            </div>
          </div>
        </div>
        {/* Espace blanc */}
        <div className="h-0.5 xs:h-1 bg-white"></div>

        {/* Trait noir */}
        <div className="border-b-[1px] border-black"></div>
      </header>

      {/* --- MENU DÉROULANT --- */}
      <nav
        className={`fixed top-14 xs:top-16 sm:top-20 md:top-24 left-0 ml-2 xs:ml-3 sm:ml-4 lg:ml-[24px] w-[calc(100%-1rem)] xs:w-[calc(100%-1.5rem)] sm:w-64 transform transition-all duration-300 ease-in-out z-40 overflow-hidden
  ${
    isMenuOpen
      ? "max-h-screen opacity-100 translate-y-0"
      : "max-h-0 opacity-0 -translate-y-4"
  }`}
      >
        <div className="flex flex-col gap-0.5 xs:gap-1 p-0.5 xs:p-1 mt-0.5 xs:mt-1">
          {/* Accueil */}
          <div>
            <Link
              to="/"
              className={`block py-1.5 xs:py-2 px-2 xs:px-4 text-center text-sm xs:text-base font-semibold transition-all ${
                isActive("/")
                  ? "bg-gradient-to-r from-slate-600 to-slate-300 text-yellow-300"
                  : "bg-gradient-to-r from-slate-600 to-slate-300 text-white hover:bg-slate-700 border-[1px] border-black"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Accueil
            </Link>
          </div>

          {/* Panier */}
          <div>
            <Link
              to="/cart"
              className={`block py-1.5 xs:py-2 px-2 xs:px-4 text-center text-sm xs:text-base font-semibold transition-all ${
                isActive("/cart")
                  ? "bg-gradient-to-r from-slate-600 to-slate-300 text-yellow-300"
                  : "bg-gradient-to-r from-slate-600 to-slate-300 text-white hover:bg-slate-700 border-[1px] border-black"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Panier
            </Link>
          </div>

          {/* Commande */}
          <div>
            <Link
              to="/order"
              className={`block py-1.5 xs:py-2 px-2 xs:px-4 text-center text-sm xs:text-base font-semibold transition-all ${
                isActive("/order")
                  ? "bg-gradient-to-r from-slate-600 to-slate-300 text-yellow-300"
                  : "bg-gradient-to-r from-slate-600 to-slate-300 text-white hover:bg-slate-700 border-[1px] border-black"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Commande
            </Link>
          </div>

          {/* Contact */}
          <div>
            <Link
              to="/contact"
              className={`block py-1.5 xs:py-2 px-2 xs:px-4 text-center text-sm xs:text-base font-semibold transition-all ${
                isActive("/contact")
                  ? "bg-gradient-to-r from-slate-600 to-slate-300 text-yellow-300"
                  : "bg-gradient-to-r from-slate-600 to-slate-300 text-white hover:bg-slate-700 border-[1px] border-black"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
          </div>

          {/* Mentions Légales */}
          <div>
            <Link
              to="/mentions"
              className={`block py-1.5 xs:py-2 px-2 xs:px-4 text-center text-sm xs:text-base font-semibold transition-all ${
                isActive("/mentions")
                  ? "bg-gradient-to-r from-slate-600 to-slate-300 text-yellow-300"
                  : "bg-gradient-to-r from-slate-600 to-slate-300 text-white hover:bg-slate-700 border-[1px] border-black"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Mentions Légales
            </Link>
          </div>

          {/* Politique de confidentialité */}
          <div>
            <Link
              to="/politiques"
              className={`block py-1.5 xs:py-2 px-2 xs:px-4 text-center text-sm xs:text-base font-semibold transition-all ${
                isActive("/politiques")
                  ? "bg-gradient-to-r from-slate-600 to-slate-300 text-yellow-300"
                  : "bg-gradient-to-r from-slate-600 to-slate-300 text-white hover:bg-slate-700 border-[1px] border-black"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}