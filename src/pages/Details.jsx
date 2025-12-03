// BookDetailPage.jsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import barCode from "../assets/png_rez/barcode-lines.png";
import openBook from "../assets/png_rez/open_book.png";
import bookOfBlackCover from "../assets/png_rez/book-of-black-cover-closed.png";
import calendar from "../assets/png_rez/calendar.png";
import basket from "../assets/png_rez/basket2.png";
import leftArrow from "../assets/png_rez/left-arrow.png";
import rightArrow from "../assets/png_rez/right-arrow.png";
import booksService from "../services/booksService";
import useCart from "../hooks/useCart";

// SIMPLIFICATION de la fonction : On délègue toute la logique de recherche
// et de récupération des détails à booksService.getBookBySlug, désormais robuste.
const fetchBookDetails = async (slug) => {
  try {
    const res = await booksService.getBookBySlug(slug);
    return res;
  } catch (e) {
    console.error(
      `Erreur critique lors de la récupération du livre (${slug}) :`,
      e
    );
    // On retourne null pour afficher l'état d'erreur
    return null;
  }
};

export default function BookDetailPage() {
  const { bookSlug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentMobileSlide, setCurrentMobileSlide] = useState(0);
  const [arrowClicked, setArrowClicked] = useState({
    left: false,
    right: false,
  });
  const [arrowHovered, setArrowHovered] = useState({
    left: false,
    right: false,
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [showCoversModal, setShowCoversModal] = useState(false);
  const [selectedCover, setSelectedCover] = useState(null);
  const [showCoverPreview, setShowCoverPreview] = useState(false);

  // helper: normalize backend/book object to the shape the UI expects
  const normalizeBook = (raw) => {
    if (!raw) return null;

    // L'API fournit maintenant le tableau 'images' dans les détails
    const detailedImages = Array.isArray(raw.images) ? raw.images : [];

    // =========================================================================
    // ÉTAPE 1 : NORMALISATION et TRI DES IMAGES DÉTAILLÉES (Fiable)
    // =========================================================================
    const allImages = detailedImages
      .map((i) => ({
        url: i?.image_url || i?.image || i,
        type: (i?.type || "other").toLowerCase(),
        isMain: i?.is_main_cover || false,
        order: i?.order || 0,
      }))
      .filter((i) => i.url)
      .sort((a, b) => a.order - b.order);

    // 2. Détermination des images
    const coverFrontImage = allImages.find(
      (i) => i.isMain || i.type === "cover_front"
    );
    const coverBackImage = allImages.find((i) => i.type === "cover_back");
    const contentImages = allImages
      .filter((i) => i.type === "content")
      .map((i) => i.url);

    // 3. Définition des URL finales
    const finalCoverImg = coverFrontImage
      ? coverFrontImage.url
      : raw.main_image || null; // Fallback sur main_image si la liste détaillée est absente

    const finalBackImg = coverBackImage ? coverBackImage.url : null; // Pas de fallback générique pour la 4ème de couv.

    // 4. Création des paires de slides pour Desktop
    const slidesPairs = [];
    for (let i = 0; i < contentImages.length; i += 2) {
      const page1 = contentImages[i];
      const page2 = contentImages[i + 1] || null;
      slidesPairs.push({ page1, page2 });
    }

    // Si aucune page de contenu n'est présente, on affiche la couverture avant dans le carrousel (pour debug ou pour avoir quelque chose)
    if (slidesPairs.length === 0 && finalCoverImg) {
      slidesPairs.push({ page1: finalCoverImg, page2: null });
    }

    //Affichacge de la date en mois et annee
    const rawReleaseDate = raw.date_publication || raw.releaseDate || "";
    let formattedDate = rawReleaseDate || "N/A";

    if (rawReleaseDate && !rawReleaseDate.includes("N/A")) {
      try {
        // Tente de créer un objet Date
        const dateObj = new Date(rawReleaseDate);

        // Vérifie si la date est valide
        if (!isNaN(dateObj.getTime())) {
          // Formate en "Mois Année" (ex: "Septembre 2024")
          const options = { year: "numeric", month: "long" };
          formattedDate = dateObj.toLocaleDateString("fr-FR", options);
        }
      } catch (e) {
        console.warn("Erreur de formatage de date:", e);
        // Conserve la date brute si le formatage échoue
        formattedDate = rawReleaseDate;
      }
    }

    // 5. Slides mobiles : Couverture avant + Couverture arrière + Contenu
    const finalMobileSlides = [];
    if (finalCoverImg) finalMobileSlides.push(finalCoverImg);
    if (finalBackImg) finalMobileSlides.push(finalBackImg);
    finalMobileSlides.push(...contentImages);

    return {
      id: raw.id,
      slug: raw.slug,
      // Titres disponibles
      title: raw.titre || raw.title || raw.name || "",
      subtitle: raw.legende || raw.subtitle || "",
      description: raw.description || "",

      // Images
      coverImg: finalCoverImg,
      backImg: finalBackImg,
      slides: slidesPairs,
      mobileSlides: finalMobileSlides,

      // Métadonnées (MAINTEANT PRÉSENTES DANS LES DONNÉES)
      isbn: raw.code_bare || raw.isbn || "",
      // Utilisation des champs largeur_cm, hauteur_cm, epaisseur_cm ou du champ dimensions complet
      dimensions: (() => {
        // 1. Tente de récupérer les champs largeur et hauteur
        const largeur = raw.largeur_cm;
        const hauteur = raw.hauteur_cm;

        if (largeur && hauteur) {
          return `${largeur} x ${hauteur}`;
        }

        // 2. Fallback: si les champs sont manquants, utilise le champ dimensions brut
        const rawDim = raw.dimensions || "";

        // 3. Si le champ brut ressemble à '21 x 24 x 2', on tente de le nettoyer
        const cleanedDim = rawDim.split("×")[0].split("*")[0].trim();

        // Si la chaîne nettoyée contient un format simple, on l'utilise
        if (cleanedDim.includes("x") && cleanedDim.length > 3) {
          return cleanedDim.endsWith("cm") ? cleanedDim : `${cleanedDim} cm`;
        }

        // 4. Dernier recours (N/A)
        return "N/A";
      })(),
      pages: raw.nombre_pages || raw.pages || "",
      releaseDate: formattedDate,
      price: raw.prix_euros ? `${raw.prix_euros} €` : raw.prix || "",
      addToCartLink: raw.addToCartLink || null,
      videos: Array.isArray(raw.videos) ? raw.videos : [],
      raw,
    };
  };

  // 2. useEffect pour charger les données du livre
  useEffect(() => {
    const loadBook = async () => {
      setLoading(true);
      const details = await fetchBookDetails(bookSlug);
      if (details) {
        // VÉRIFIEZ LES DONNÉES ICI
        console.log("Données brutes de l'API :", details);

        setBook(normalizeBook(details));
        setCurrentSlide(0);
        setCurrentMobileSlide(0);
      } else {
        setBook(null);
      }
      setLoading(false);
    };

    if (bookSlug) {
      loadBook();
    }
  }, [bookSlug]); // Se déclenche quand bookSlug change

  // Gestion des carrousels — ensure arrays
  const slides = book && book.slides ? book.slides : [];
  const mobileSlides = book && book.mobileSlides ? book.mobileSlides : [];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setArrowClicked({ left: false, right: true });
    setTimeout(() => setArrowClicked({ left: false, right: false }), 200);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setArrowClicked({ left: true, right: false });
    setTimeout(() => setArrowClicked({ left: false, right: false }), 200);
  };

  const nextMobileSlide = () => {
    setCurrentMobileSlide((prev) => (prev + 1) % mobileSlides.length);
    setArrowClicked({ left: false, right: true });
    setTimeout(() => setArrowClicked({ left: false, right: false }), 200);
  };

  const prevMobileSlide = () => {
    setCurrentMobileSlide(
      (prev) => (prev - 1 + mobileSlides.length) % mobileSlides.length
    );
    setArrowClicked({ left: true, right: false });
    setTimeout(() => setArrowClicked({ left: false, right: false }), 200);
  };

  const handleAddToCart = () => {
    if (book) {
      addToCart(book);
      navigate("/cart");
    }
  };

  const handleAddToCartOnly = () => {
    if (book) {
      addToCart(book);
    }
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  // 3. Gestion des états de chargement et d'erreur
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center text-2xl font-semibold"
        style={{
          background:
            "linear-gradient(135deg, #f4f6d4 0%, #fef4e8 25%, #fde8f0 50%, #f0e8f8 75%, #e8f0fc 100%)",
        }}
      >
        Chargement des détails du livre...
      </div>
    );
  }

  if (!book) {
    return (
      <div
        className="min-h-screen text-center py-20 text-red-600 text-2xl font-semibold"
        style={{
          background:
            "linear-gradient(135deg, #f4f6d4 0%, #fef4e8 25%, #fde8f0 50%, #f0e8f8 75%, #e8f0fc 100%)",
        }}
      >
        Désolé, le livre "{bookSlug}" n'a pas été trouvé.
      </div>
    );
  }

  // 4. Affichage du contenu
  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(135deg, #f4f6d4 0%, #fef4e8 25%, #fde8f0 50%, #f0e8f8 75%, #e8f0fc 100%)",
      }}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Titres (Désormais dynamiques) */}
        <div className="text-center mb-8">
          <h1
            className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2"
            style={{ color: "#F4B383", fontFamily: "'Playfair Display', serif" }}
          >
            {book.title}
          </h1>
          <h2
            className="text-center text-lg sm:text-xl md:text-2xl lg:text-3xl italic"
            style={{ color: "#C2DEEA", fontFamily: "'Playfair Display', serif" }}
          >
            {book.subtitle}
          </h2>
        </div>

        {/* Carousel Desktop - LAYOUT HORIZONTAL */}
        <div className="hidden md:flex flex-col items-center justify-center mb-12">
          {/* Ligne 1: Couvertures + Pages (alignées au centre) */}
          <div className="flex items-center justify-center gap-4 lg:gap-8 mb-6">
            {/* Couverture arrière (GAUCHE) */}
            {book.backImg ? (
              <img
                src={book.backImg}
                className="w-40 lg:w-56 xl:w-64 cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0"
                alt="Quatrième de couverture"
                onClick={() => setShowCoverPreview(true)}
              />
            ) : (
              <div className="w-40 lg:w-56 xl:w-64 bg-slate-100 flex items-center justify-center text-xs text-slate-400 h-72 lg:h-96 flex-shrink-0">
                No image
              </div>
            )}

            {/* Carousel des pages - CENTRE */}
            <div className="relative flex-1 max-w-2xl">
              {slides.length > 0 && (
                <div className="flex gap-2 md:gap-3 lg:gap-4 justify-center">
                  {slides[currentSlide].page1 ? (
                    <img
                      src={slides[currentSlide].page1}
                      className="flex-1 max-h-[400px] lg:max-h-[480px] object-contain cursor-pointer hover:opacity-80 transition-opacity"
                      alt={`Page ${currentSlide * 2 + 1}`}
                      onClick={() => handleImageClick(slides[currentSlide].page1)}
                    />
                  ) : (
                    <div className="flex-1 bg-slate-100 flex items-center justify-center text-xs text-slate-400 h-64">
                      No image
                    </div>
                  )}

                  {slides[currentSlide].page2 ? (
                    <img
                      src={slides[currentSlide].page2}
                      className="flex-1 max-h-[400px] lg:max-h-[480px] object-contain cursor-pointer hover:opacity-80 transition-opacity"
                      alt={`Page ${currentSlide * 2 + 2}`}
                      onClick={() => handleImageClick(slides[currentSlide].page2)}
                    />
                  ) : (
                    <div className="flex-1 bg-slate-100 flex items-center justify-center text-xs text-slate-400 h-64">
                      No image
                    </div>
                  )}
                </div>
              )}

              {/* Cas où slides.length est 0 et qu'il n'y a pas d'images de contenu */}
              {slides.length === 0 && (
                <div className="flex gap-4">
                  <div className="w-full bg-slate-100 flex items-center justify-center text-xs text-slate-400 h-96">
                    No content images
                  </div>
                </div>
              )}
            </div>

            {/* Couverture avant (DROITE) */}
            {book.coverImg ? (
              <img
                src={book.coverImg}
                className="w-40 lg:w-56 xl:w-64 cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0"
                alt="Première de couverture"
                onClick={() => setShowCoverPreview(true)}
              />
            ) : (
              <div className="w-40 lg:w-56 xl:w-64 bg-slate-100 flex items-center justify-center text-xs text-slate-400 h-72 lg:h-96 flex-shrink-0">
                No image
              </div>
            )}
          </div>

          {/* Ligne 2: Flèches et bouton acheter */}
          {slides.length > 1 && (
            <div className="flex justify-center items-center gap-6">
              <button
                onClick={prevSlide}
                className="bg-transparent border-0 cursor-pointer"
                onMouseEnter={() => setArrowHovered({ ...arrowHovered, left: true })}
                onMouseLeave={() => setArrowHovered({ ...arrowHovered, left: false })}
              >
                <img
                  src={leftArrow}
                  className={`w-12 lg:w-16 transition-all duration-200 ${
                    arrowHovered.left ? "brightness-0 invert" : ""
                  }`}
                  alt="Précédent"
                />
              </button>
              <button
                onClick={handleAddToCart}
                className="bg-white hover:bg-green-500 text-black hover:text-white font-bold py-4 px-8 lg:py-5 lg:px-10 text-lg rounded-full shadow-lg transition-all duration-200 transform hover:scale-105"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Acheter - {book.price}
              </button>
              <button
                onClick={nextSlide}
                className="bg-transparent border-0 cursor-pointer"
                onMouseEnter={() => setArrowHovered({ ...arrowHovered, right: true })}
                onMouseLeave={() => setArrowHovered({ ...arrowHovered, right: false })}
              >
                <img
                  src={rightArrow}
                  className={`w-12 lg:w-16 transition-all duration-200 ${
                    arrowHovered.right ? "brightness-0 invert" : ""
                  }`}
                  alt="Suivant"
                />
              </button>
            </div>
          )}
        </div>

        {/* Affichage de la couverture cliquée en grand (DESKTOP ET TABLETTE) */}
        {showCoverPreview && (
          <div className="hidden md:flex flex-col items-center justify-center mt-12 mb-12">
            <button
              onClick={() => setShowCoverPreview(false)}
              className="mb-6 bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-6 rounded-full transition-all"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Fermer
            </button>
            <div className="flex gap-12 justify-center flex-wrap max-w-6xl">
              {book.coverImg && (
                <img
                  src={book.coverImg}
                  className="max-w-sm max-h-[700px] lg:max-h-[850px] object-contain rounded-lg shadow-lg"
                  alt="Couverture avant agrandie"
                />
              )}
              {book.backImg && (
                <img
                  src={book.backImg}
                  className="max-w-sm max-h-[700px] lg:max-h-[850px] object-contain rounded-lg shadow-lg"
                  alt="Couverture arrière agrandie"
                />
              )}
            </div>
          </div>
        )}

        {/* Carousel Mobile */}
        <div className="md:hidden mb-8">
          {/* Couvertures en haut côte à côte */}
          <div className="flex gap-4 justify-center mb-8">
            {book.coverImg && (
              <img
                src={book.coverImg}
                className="w-32 sm:w-40 cursor-pointer hover:opacity-80 transition-opacity"
                alt="Première de couverture"
                onClick={() => handleImageClick(book.coverImg)}
              />
            )}
            {book.backImg && (
              <img
                src={book.backImg}
                className="w-32 sm:w-40 cursor-pointer hover:opacity-80 transition-opacity"
                alt="Quatrième de couverture"
                onClick={() => handleImageClick(book.backImg)}
              />
            )}
          </div>

          {/* Carousel du contenu (pages intérieures une par une) */}
          {slides.length > 0 &&
            slides.flatMap((s) => [s.page1, s.page2].filter(Boolean)).length >
              0 && (
              <div className="relative w-full max-w-2xl mx-auto">
                {(() => {
                  const contentPages = slides.flatMap((s) =>
                    [s.page1, s.page2].filter(Boolean)
                  );
                  return (
                    <>
                      <img
                        src={
                          contentPages[currentMobileSlide % contentPages.length]
                        }
                        className="w-full max-h-[70vh] object-contain"
                        alt={`page ${currentMobileSlide + 1}`}
                      />

                      {contentPages.length > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-4">
                          <button
                            onClick={() => {
                              setCurrentMobileSlide(
                                (prev) =>
                                  (prev - 1 + contentPages.length) %
                                  contentPages.length
                              );
                              setArrowClicked({ left: true, right: false });
                              setTimeout(
                                () =>
                                  setArrowClicked({
                                    left: false,
                                    right: false,
                                  }),
                                200
                              );
                            }}
                            className="bg-transparent border-0"
                          >
                            <img
                              src={leftArrow}
                              className={`w-10 transition-all duration-200 ${
                                arrowClicked.left ? "brightness-0 invert" : ""
                              }`}
                              alt="Précédent"
                            />
                          </button>
                          <button
                            onClick={handleAddToCart}
                            className="bg-white hover:bg-green-500 text-black hover:text-white font-bold py-2 px-4 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105 text-sm"
                            style={{ fontFamily: "'Montserrat', sans-serif" }}
                          >
                            Acheter - {book.price}
                          </button>
                          <button
                            onClick={() => {
                              setCurrentMobileSlide(
                                (prev) => (prev + 1) % contentPages.length
                              );
                              setArrowClicked({ left: false, right: true });
                              setTimeout(
                                () =>
                                  setArrowClicked({
                                    left: false,
                                    right: false,
                                  }),
                                200
                              );
                            }}
                            className="bg-transparent border-0"
                          >
                            <img
                              src={rightArrow}
                              className={`w-10 transition-all duration-200 ${
                                arrowClicked.right ? "brightness-0 invert" : ""
                              }`}
                              alt="Suivant"
                            />
                          </button>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            )}
        </div>

        {/* Section informations et panier */}
        <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 md:gap-12 lg:gap-16 xl:gap-24 mb-12">
          {/* Code barre (ISBN) */}
          <div className="text-center">
            <img
              src={barCode}
              className="w-12 sm:w-14 md:w-16 lg:w-20 mx-auto mb-3"
              alt="Code barre"
            />
            <h5
              className="text-sm sm:text-base md:text-lg font-bold italic"
              style={{ fontFamily: "'Roboto Condensed', sans-serif" }}
            >
              {book.isbn || "N/A"}
            </h5>
          </div>

          {/* Dimensions */}
          <div className="text-center">
            <img
              src={bookOfBlackCover}
              className="w-12 sm:w-14 md:w-16 lg:w-20 mx-auto mb-3"
              alt="Dimensions"
            />
            <h5
              className="text-sm sm:text-base md:text-lg font-bold italic"
              style={{ fontFamily: "'Roboto Condensed', sans-serif" }}
            >
              {book.dimensions || "N/A"}
            </h5>
          </div>

          {/* Pages */}
          <div className="text-center">
            <img
              src={openBook}
              className="w-12 sm:w-14 md:w-16 lg:w-20 mx-auto mb-3"
              alt="Pages"
            />
            <h5
              className="text-sm sm:text-base md:text-lg font-bold italic"
              style={{ fontFamily: "'Roboto Condensed', sans-serif" }}
            >
              {book.pages ? `${book.pages} pages` : "N/A"}
            </h5>
          </div>

          {/* Date */}
          <div className="text-center">
            <img
              src={calendar}
              className="w-12 sm:w-14 md:w-16 lg:w-20 mx-auto mb-3"
              alt="Date"
            />
            <h5
              className="text-sm sm:text-base md:text-lg font-bold italic"
              style={{ fontFamily: "'Roboto Condensed', sans-serif" }}
            >
              {book.releaseDate || "N/A"}
            </h5>
          </div>

          {/* Panier */}
          <div className="text-center">
            <div>
              <button
                onClick={handleAddToCartOnly}
                className="bg-transparent border-0 cursor-pointer hover:scale-110 transition-transform"
              >
                <img
                  src={basket}
                  className="w-12 sm:w-14 md:w-16 lg:w-20 mx-auto mb-3"
                  alt="Ajouter au panier"
                />
                <h5
                  className="text-sm sm:text-base md:text-lg font-bold italic"
                  style={{ fontFamily: "'Roboto Condensed', sans-serif" }}
                >
                  {book.price || "Prix N/A"}
                </h5>
              </button>
            </div>
          </div>
        </div>

        {/* Modale des couvertures (Mobile) */}
        {showCoversModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={() => setShowCoversModal(false)}
          >
            <div className="relative max-w-[95vw] max-h-[95vh] flex flex-col items-center gap-6">
              <button
                onClick={() => setShowCoversModal(false)}
                className="absolute top-2 right-2 bg-white bg-opacity-90 text-black rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-100 transition text-xl font-bold shadow-lg"
              >
                ✕
              </button>

              <div className="flex gap-6 justify-center flex-wrap mt-8">
                {book.coverImg && (
                  <img
                    src={book.coverImg}
                    className="max-h-[80vh] object-contain rounded-lg shadow-2xl"
                    alt="Première de couverture"
                  />
                )}
                {book.backImg && (
                  <img
                    src={book.backImg}
                    className="max-h-[80vh] object-contain rounded-lg shadow-2xl"
                    alt="Quatrième de couverture"
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Affichage de l'image sélectionnée en grand format */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-[95vw] max-h-[95vh]">
              <img
                src={selectedImage}
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                alt="Image agrandie"
                onClick={(e) => e.stopPropagation()}
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 md:top-4 md:right-4 bg-white bg-opacity-90 text-black rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center hover:bg-opacity-100 transition text-xl md:text-2xl font-bold shadow-lg"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
