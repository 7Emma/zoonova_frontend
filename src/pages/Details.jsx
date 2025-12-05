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
import Toast from "../components/Toast";

// Mapping des couleurs par titre
const colorMapping = {
  "Je ne veux plus être une abeille": {
    titre: "#F4B383",
    description: "#C2DEEA",
  },
  "Je ne veux plus être un bélier": {
    titre: "#78BE7F",
    description: "#EF8B8F",
  },
  "Je ne veux plus être un castor": {
    titre: "#EB97A3",
    description: "#FFEB97",
  },
  "Je ne veux plus être un dauphin": {
    titre: "#82C9D1",
    description: "#EDC7A3",
  },
  "Je ne veux plus être un éléphant": {
    titre: "#F4AECF",
    description: "#83C9BD",
  },
  "Je ne veux plus être un flamant rose": {
    titre: "#FFE564",
    description: "#BAB9DE",
  },
  "Je ne veux plus être une girafe": {
    titre: "#F6DDCC",
    description: "#63C3D3",
  },
  "Je ne veux plus être un hibou": {
    titre: "#C5DB93",
    description: "#F9D3E6",
  },
};

const randomColors = [
  { titre: "#FF6B6B", description: "#FFD93D" },
  { titre: "#4ECDC4", description: "#95E1D3" },
  { titre: "#A8D8FF", description: "#FFB6C1" },
  { titre: "#FFC75F", description: "#845EC2" },
  { titre: "#00D2FC", description: "#FF006E" },
  { titre: "#FFBE0B", description: "#FB5607" },
  { titre: "#8338EC", description: "#FF006E" },
  { titre: "#FF006E", description: "#FFBE0B" },
];

// Fonction pour obtenir les couleurs
const getColorsByTitle = (title) => {
  const titleLower = title?.toLowerCase() || "";
  for (const [key, colors] of Object.entries(colorMapping)) {
    if (titleLower.includes(key.toLowerCase())) {
      return colors;
    }
  }
  // Sinon, retour une couleur aléatoire
  return randomColors[Math.floor(Math.random() * randomColors.length)];
};

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
  const [selectedImage, setSelectedImage] = useState(null);
  const [dominantColor, setDominantColor] = useState("#c45554");
  const [dominantColorBack, setDominantColorBack] = useState("#c45554");
  const [toastMessage, setToastMessage] = useState(null);

  // Fonction pour extraire la couleur dominante d'une image
  const extractDominantColor = (imageUrl, setColorFunction) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        let r = 0,
          g = 0,
          b = 0;
        for (let i = 0; i < data.length; i += 4) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
        }

        const pixelCount = data.length / 4;
        r = Math.round(r / pixelCount);
        g = Math.round(g / pixelCount);
        b = Math.round(b / pixelCount);

        const hex = `#${[r, g, b]
          .map((x) => x.toString(16).padStart(2, "0"))
          .join("")
          .toUpperCase()}`;
        setColorFunction(hex);
      } catch (e) {
        console.warn("CORS error extracting color, using default:", e);
        setColorFunction("#c45554");
      }
    };
    img.onerror = () => setColorFunction("#c45554");
    img.src = imageUrl;
  };

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
          return `${Math.round(largeur)} x ${Math.round(hauteur)}`;
        }

        // 2. Fallback: si les champs sont manquants, utilise le champ dimensions brut
        const rawDim = raw.dimensions || "";

        // 3. Si le champ brut ressemble à '21 x 24 x 2', on tente de le nettoyer
        const cleanedDim = rawDim.split("×")[0].split("*")[0].trim();

        // Si la chaîne nettoyée contient un format simple, on l'utilise
        if (cleanedDim.includes("x") && cleanedDim.length > 3) {
          return cleanedDim.endsWith("cm") ? cleanedDim : `${cleanedDim} `;
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

        const normalizedBook = normalizeBook(details);
        setBook(normalizedBook);
        setCurrentSlide(0);
        setCurrentMobileSlide(0);

        // Extraire les couleurs dominantes des deux couvertures
        if (normalizedBook?.coverImg) {
          extractDominantColor(normalizedBook.coverImg, setDominantColor);
        }
        if (normalizedBook?.backImg) {
          extractDominantColor(normalizedBook.backImg, setDominantColorBack);
        }
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

  const handleAddToCart = () => {
    if (book) {
      addToCart(book);
      setToastMessage(`${book.title} ajouté au panier !`);
      navigate("/cart");
    }
  };

  const handleAddToCartOnly = () => {
    if (book) {
      addToCart(book);
      setToastMessage(`${book.title} ajouté au panier !`);
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
      {toastMessage && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setToastMessage(null)}
        />
      )}
      <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-8">
         {/* Titres (Désormais dynamiques) */}
         {(() => {
           const colors = getColorsByTitle(book.title);
           return (
             <>
               <h1
                 className="text-center text-xl sm:text-2xl md:text-4xl lg:text-5xl mb-2 sm:mb-4 font-fredoka font-bold line-clamp-3 mt-8"
                 style={{
                   color: colors.titre,
                   WebkitTextStroke: "0.5px white",
                   textShadow: "0px 2px 0px rgba(0,0,0,0.15)",
                 }}
               >
                 {book.title.charAt(0).toUpperCase() + book.title.slice(1).toLowerCase()}
               </h1>
               <h1
                 className="text-center text-xl sm:text-2xl md:text-4xl lg:text-5xl mb-4 sm:mb-8 font-fredoka font-bold line-clamp-4"
                 style={{
                   color: colors.description,
                   WebkitTextStroke: "0.5px white",
                   textShadow: "0px 2px 0px rgba(0,0,0,0.1)",
                 }}
               >
                 {book.description.charAt(0).toUpperCase() + book.description.slice(1).toLowerCase()}
               </h1>
             </>
           );
         })()}

        {/* Layout Tablette (md-2xl) - Couvertures en haut, Images en bas */}
        <div className="hidden md:flex 2xl:hidden flex-col items-center justify-center mb-6 sm:mb-8 gap-4 sm:gap-6">
          {/* Couvertures côte à côte */}
          <div className="flex gap-2 sm:gap-4 items-center justify-center">
            {/* Image back (couverture arrière) */}
            {book.backImg ? (
              <img
                src={book.backImg}
                className="w-40 sm:w-48 cursor-pointer hover:opacity-80 transition-opacity"
                alt="Quatrième de couverture"
                onClick={() => handleImageClick(book.backImg)}
              />
            ) : (
              <div className="w-40 sm:w-48 bg-slate-100 flex items-center justify-center text-xs text-slate-400 h-64">
                No image
              </div>
            )}

            {/* Image cover (couverture avant) */}
            {book.coverImg ? (
              <img
                src={book.coverImg}
                className="w-40 sm:w-48 cursor-pointer hover:opacity-80 transition-opacity"
                alt="Première de couverture"
                onClick={() => handleImageClick(book.coverImg)}
              />
            ) : (
              <div className="w-40 sm:w-48 bg-slate-100 flex items-center justify-center text-xs text-slate-400 h-64">
                No image
              </div>
            )}
          </div>

          {/* Carousel des pages - En bas */}
          <div className="relative w-80 md:w-[36rem] lg:w-[42rem] xl:w-[48rem] 2xl:w-[52rem]">
            {slides.length > 0 && (
              <div className="flex gap-0 bg-white">
                {slides[currentSlide].page1 ? (
                  <img
                    src={slides[currentSlide].page1}
                    className="w-1/2 max-h-80 md:max-h-96 lg:max-h-[28rem] xl:max-h-[32rem] 2xl:max-h-[32rem] object-contain cursor-pointer hover:opacity-80 transition-opacity"
                    alt={`Page ${currentSlide * 2 + 1}`}
                    onClick={() => handleImageClick(slides[currentSlide].page1)}
                  />
                ) : (
                  <div className="w-1/2 flex items-center justify-center text-xs text-slate-400">
                    No image
                  </div>
                )}

                {slides[currentSlide].page2 ? (
                  <img
                    src={slides[currentSlide].page2}
                    className="w-1/2 max-h-80 md:max-h-96 lg:max-h-[28rem] xl:max-h-[32rem] 2xl:max-h-[32rem] object-contain cursor-pointer hover:opacity-80 transition-opacity"
                    alt={`Page ${currentSlide * 2 + 2}`}
                    onClick={() => handleImageClick(slides[currentSlide].page2)}
                  />
                ) : (
                  <div className="w-1/2">
                  </div>
                )}
              </div>
            )}

            {/* Cas où slides.length est 0 */}
            {slides.length === 0 && (
              <div className="flex gap-0 bg-white">
                <div className="w-full flex items-center justify-center text-xs text-slate-400 max-h-80 md:max-h-96 lg:max-h-[28rem] xl:max-h-[32rem] 2xl:max-h-[32rem]">
                  No content images
                </div>
              </div>
            )}

            {/* Flèches et bouton acheter */}
            <div className="flex justify-center items-center gap-4 mt-4">
              {slides.length > 1 && (
                <button
                  onClick={prevSlide}
                  className="bg-transparent border-0 hover:brightness-0 hover:invert transition-all duration-200"
                >
                  <img
                    src={leftArrow}
                    className={`w-12 transition-all duration-200 ${
                      arrowClicked.left ? "brightness-0 invert" : ""
                    }`}
                    alt="Précédent"
                  />
                </button>
              )}
              <button
                onClick={handleAddToCart}
                className="bg-black text-green-500 hover:bg-green-500 hover:text-white font-bowlby text-2xl py-3 px-6 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                Acheter
              </button>
              {slides.length > 1 && (
                <button
                  onClick={nextSlide}
                  className="bg-transparent border-0 hover:brightness-0 hover:invert transition-all duration-200"
                >
                  <img
                    src={rightArrow}
                    className={`w-12 transition-all duration-200 ${
                      arrowClicked.right ? "brightness-0 invert" : ""
                    }`}
                    alt="Suivant"
                  />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Layout Desktop (2xl+) - Livre Ouvert Classique */}
        <div className="hidden 2xl:flex items-center justify-center mb-6 sm:mb-8 gap-2 sm:gap-4 lg:gap-8">
          {/* Image back (couverture arrière) */}
          {book.backImg ? (
            <img
              src={book.backImg}
              className="w-64 lg:w-80 xl:w-96 cursor-pointer hover:opacity-80 transition-opacity"
              alt="Quatrième de couverture"
              onClick={() => handleImageClick(book.backImg)}
            />
          ) : (
            <div className="w-64 lg:w-80 xl:w-96 bg-slate-100 flex items-center justify-center text-xs text-slate-400 h-96">
              No image
            </div>
          )}

          {/* Carousel des pages - Centre du livre */}
          <div className="relative w-80 md:w-[36rem] lg:w-[42rem] xl:w-[52rem]">
            {slides.length > 0 && (
              <div className="flex gap-0 bg-white">
                {slides[currentSlide].page1 ? (
                  <img
                    src={slides[currentSlide].page1}
                    className="w-1/2 max-h-[32rem] object-contain cursor-pointer hover:opacity-80 transition-opacity"
                    alt={`Page ${currentSlide * 2 + 1}`}
                    onClick={() => handleImageClick(slides[currentSlide].page1)}
                  />
                ) : (
                  <div className="w-1/2 flex items-center justify-center text-xs text-slate-400">
                    No image
                  </div>
                )}

                {slides[currentSlide].page2 ? (
                  <img
                    src={slides[currentSlide].page2}
                    className="w-1/2 max-h-[32rem] object-contain cursor-pointer hover:opacity-80 transition-opacity"
                    alt={`Page ${currentSlide * 2 + 2}`}
                    onClick={() => handleImageClick(slides[currentSlide].page2)}
                  />
                ) : (
                  <div className="w-1/2">
                  </div>
                )}
              </div>
            )}

            {/* Cas où slides.length est 0 et qu'il n'y a pas d'images de contenu */}
            {slides.length === 0 && (
              <div className="flex gap-0 bg-white">
                <div className="w-full flex items-center justify-center text-xs text-slate-400 max-h-[32rem]">
                  No content images
                </div>
              </div>
            )}

            {/* Flèches et bouton acheter */}
            <div className="flex justify-center items-center gap-4 mt-4">
              {slides.length > 1 && (
                <button
                  onClick={prevSlide}
                  className="bg-transparent border-0 hover:brightness-0 hover:invert transition-all duration-200"
                >
                  <img
                    src={leftArrow}
                    className={`w-12 lg:w-14 transition-all duration-200 ${
                      arrowClicked.left ? "brightness-0 invert" : ""
                    }`}
                    alt="Précédent"
                  />
                </button>
              )}
              <button
                onClick={handleAddToCart}
                className="bg-white hover:bg-green-500 text-black hover:text-white font-bowlby text-2xl py-3 px-6 lg:py-4 lg:px-8 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                Acheter
              </button>
              {slides.length > 1 && (
                <button
                  onClick={nextSlide}
                  className="bg-transparent border-0 hover:brightness-0 hover:invert transition-all duration-200"
                >
                  <img
                    src={rightArrow}
                    className={`w-12 lg:w-14 transition-all duration-200 ${
                      arrowClicked.right ? "brightness-0 invert" : ""
                    }`}
                    alt="Suivant"
                  />
                </button>
              )}
            </div>
          </div>

          {/* Image cover (couverture avant) */}
          {book.coverImg ? (
            <img
              src={book.coverImg}
              className="w-64 lg:w-80 xl:w-96 cursor-pointer hover:opacity-80 transition-opacity"
              alt="Première de couverture"
              onClick={() => handleImageClick(book.coverImg)}
            />
          ) : (
            <div className="w-64 lg:w-80 xl:w-96 bg-slate-100 flex items-center justify-center text-xs text-slate-400 h-96">
              No image
            </div>
          )}
        </div>

          {/* Carousel Mobile */}
          <div className="md:hidden mb-4 sm:mb-8">
          {/* Affichage des couvertures en haut */}
          <div className="flex gap-2 sm:gap-4 justify-center mb-4 sm:mb-6">
            {book.coverImg && (
              <img
                src={book.coverImg}
                className="w-48 cursor-pointer hover:opacity-80 transition-opacity"
                alt="Première de couverture"
                onClick={() => handleImageClick(book.coverImg)}
              />
            )}
            {book.backImg && (
              <img
                src={book.backImg}
                className="w-48 cursor-pointer hover:opacity-80 transition-opacity"
                alt="Quatrième de couverture"
                onClick={() => handleImageClick(book.backImg)}
              />
            )}
          </div>

          {/* Carousel du contenu (pages intérieures une par une) */}
          {slides.length > 0 &&
            slides.flatMap((s) => [s.page1, s.page2].filter(Boolean)).length >
              0 && (
              <div className="relative max-w-md mx-auto">
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
                        className="w-full shadow-lg"
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
                            className="bg-transparent border-0 hover:brightness-0 hover:invert transition-all duration-200"
                          >
                            <img
                              src={leftArrow}
                              className={`w-12 transition-all duration-200 ${
                                arrowClicked.left ? "brightness-0 invert" : ""
                              }`}
                              alt="Précédent"
                            />
                          </button>
                          <button
                            onClick={handleAddToCart}
                            className="bg-white hover:bg-green-500 text-white font-bowlby hover:text-white py-2 px-4 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105 text-sm"
                          >
                            Acheter
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
                            className="bg-transparent border-0 hover:brightness-0 hover:invert transition-all duration-200 "
                          >
                            <img
                              src={rightArrow}
                              className={`w-12 transition-all duration-200 ${
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
        <div className="flex flex-wrap justify-center items-center gap-2 xs:gap-3 sm:gap-6 md:gap-12 lg:gap-20 xl:gap-32 mb-6 sm:mb-8 px-2">
          {/* Code barre (ISBN) */}
          <div className="text-center flex-shrink-0 whitespace-nowrap min-w-max">
            <img
              src={barCode}
              className="w-6 xs:w-7 sm:w-10 md:w-12 lg:w-16 xl:w-20 mx-auto mb-0.5 xs:mb-1 text-gray-400"
              alt="Code barre"
            />
            <h5
              className="text-[8px] xs:text-[9px] sm:text-xs md:text-sm lg:text-base font-bold italic leading-tight text-gray-400 break-words"
              style={{ fontFamily: "'Roboto Condensed', sans-serif" }}
            >
              {book.isbn || "N/A"}
            </h5>
            </div>

            {/* Dimensions */}
            <div className="text-center flex-shrink-0 whitespace-nowrap min-w-max">
            <img
              src={bookOfBlackCover}
              className="w-6 xs:w-7 sm:w-10 md:w-12 lg:w-16 xl:w-20 mx-auto mb-0.5 xs:mb-1 text-gray-400"
              alt="Dimensions"
            />
            <h5
              className="text-[8px] xs:text-[9px] sm:text-xs md:text-sm lg:text-base font-bold italic leading-tight text-gray-400 break-words"
              style={{ fontFamily: "'Roboto Condensed', sans-serif" }}
            >
              {book.dimensions || "N/A"}
            </h5>
            </div>

            {/* Pages */}
            <div className="text-center flex-shrink-0 whitespace-nowrap min-w-max">
            <img
              src={openBook}
              className="w-6 xs:w-7 sm:w-10 md:w-12 lg:w-16 xl:w-20 mx-auto mb-0.5 xs:mb-1 text-gray-400"
              alt="Pages"
            />
            <h5
              className="text-[8px] xs:text-[9px] sm:text-xs md:text-sm lg:text-base font-bold italic leading-tight text-gray-400 break-words"
              style={{ fontFamily: "'Roboto Condensed', sans-serif" }}
            >
              {book.pages ? `${book.pages} pages` : "N/A"}
            </h5>
            </div>

            {/* Date */}
            <div className="text-center flex-shrink-0 whitespace-nowrap min-w-max">
            <img
              src={calendar}
              className="w-6 xs:w-7 sm:w-10 md:w-12 lg:w-16 xl:w-20 mx-auto mb-0.5 xs:mb-1 text-gray-400"
              alt="Date"
            />
            <h5
              className="text-[8px] xs:text-[9px] sm:text-xs md:text-sm lg:text-base font-bold italic leading-tight text-gray-400 break-words"
              style={{ fontFamily: "'Roboto Condensed', sans-serif" }}
            >
              {book.releaseDate || "N/A"}
            </h5>
            </div>

            {/* Panier */}
            <div className="text-center flex-shrink-0 whitespace-nowrap min-w-max">
            <button
              onClick={handleAddToCartOnly}
              className="border-0 cursor-pointer hover:scale-110 transition-transform rounded-lg p-1 xs:p-1.5 sm:p-2 md:p-3"
            >
              <img
                src={basket}
                className="w-7 xs:w-8 sm:w-11 md:w-14 lg:w-18 xl:w-24 mx-auto mb-0.5 xs:mb-1 text-gray-400"
                alt="Ajouter au panier"
              />
              <h5
                className="text-[8px] xs:text-[9px] sm:text-xs md:text-sm lg:text-base font-bold italic leading-tight text-gray-400 break-words"
                style={{ fontFamily: "'Roboto Condensed', sans-serif" }}
              >
                {book.price || "Prix N/A"}
              </h5>
            </button>
            </div>
        </div>

        {/* Affichage de l'image sélectionnée - Popup mobile uniquement */}
        {selectedImage && (
          <div className="md:hidden fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-2 sm:p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-full max-h-[90vh] overflow-auto flex flex-col">
              {/* Bouton Fermer */}
              <div className="sticky top-0 flex justify-between items-center p-2 sm:p-4 border-b-2 border-gray-300 z-10">
                <button
                  onClick={() => setSelectedImage(null)}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 sm:py-2 sm:px-4 rounded text-sm sm:text-base transition-all duration-200"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  ✕ Fermer
                </button>
              </div>

              {/* Image */}
              <div className="flex items-center justify-center p-2 sm:p-4">
                <img
                  src={selectedImage}
                  className="w-full h-auto max-w-full max-h-[75vh] object-contain rounded"
                  alt="Image agrandie"
                />
              </div>
            </div>
          </div>
        )}

        {/* Affichage de l'image sélectionnée en bas - Desktop et tablette uniquement */}
        {selectedImage && (
          <div className="hidden md:block mt-16 mb-12 border-t-4 pt-12">
            <div className="flex flex-col items-center">
              <button
                onClick={() => setSelectedImage(null)}
                className="mb-6 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 md:py-3 md:px-8 rounded text-sm md:text-base transition-all duration-200"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                ✕ Fermer
              </button>
              <img
                src={selectedImage}
                className="w-full max-w-4xl lg:max-w-6xl object-contain rounded-lg"
                alt="Image agrandie"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
