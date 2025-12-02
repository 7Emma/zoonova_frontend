import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import barCode from "../assets/png/barcode-lines.png";
import openBook from "../assets/png/open-book.png"
import bookOfBlackCover from "../assets/png/book-of-black-cover-closed.png";
import calendar from "../assets/png/calendar.png";
import basket from "../assets/png/basket (2).png";
import leftArrow from "../assets/fleches/left-arrow.png";
import rightArrow from "../assets/fleches/right-arrow.png";
import booksService from '../services/booksService';

// fetchBookDetails: utilise l'API backend (booksService.getBookBySlug)
const fetchBookDetails = async (slug) => {
  try {
    // 1. Tente la méthode directe (getBookBySlug)
    const res = await booksService.getBookBySlug(slug);
    return res;
  } catch (e) {
    console.error(`Erreur critique lors de la récupération directe du livre (${slug}) :`, e);
    // 2. Tente le fallback lourd si l'appel direct échoue
    try {
      const list = await booksService.getBooks({ page_size: 1000 });
      const items = Array.isArray(list) ? list : (list.results || []);
      const foundBook = items.find((b) => b.slug === slug);
      if (foundBook) return foundBook;
      // Si on ne trouve rien, on log l'échec total.
      console.warn(`Livre "${slug}" non trouvé, même après le fallback sur la liste.`);
      return null; 
    } catch (e) {
      console.error('Erreur lors du fallback sur la liste des livres:', e);
      return null;
    }
  }
};


export default function BookDetailPage() {
  // 1. Récupération du paramètre de l'URL
  const { bookSlug } = useParams();

  // États locaux
  const [book, setBook] = useState(null); // Détails du livre récupérés
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentMobileSlide, setCurrentMobileSlide] = useState(0);

  // helper: normalize backend/book object to the shape the UI expects
  const normalizeBook = (raw) => {
  if (!raw) return null;

  // 1. Tente d'utiliser les listes d'images détaillées de l'API
  // Si elles sont absentes, on obtient une liste vide.
  const detailedImages = Array.isArray(raw.images) ? raw.images : (raw.images_urls || []);
  
  // =========================================================================
  // ÉTAPE 1 : NORMALISATION DES IMAGES DÉTAILLÉES (Peut être vide)
  // =========================================================================
  const allImages = detailedImages.map(i => ({ 
      url: i?.image_url || i?.image || i, 
      type: (i?.type || 'other').toLowerCase(),
      isMain: i?.is_main_cover || false,
      order: i?.order || 0,
    }))
    .filter(i => i.url) 
    .sort((a, b) => a.order - b.order);

  // 2. Détermination des images
  let coverFrontImage = allImages.find(i => i.isMain || i.type === 'cover_front');
  const coverBackImage = allImages.find(i => i.type === 'cover_back');
  const contentImages = allImages
    .filter(i => i.type === 'content')
    .map(i => i.url);

  // =========================================================================
  // CORRECTION MAJEURE : UTILISER raw.main_image COMME COUVERTURE SI AUCUNE IMAGE DÉTAILLÉE N'EST TROUVÉE
  // =========================================================================
  const finalCoverImg = coverFrontImage 
    ? coverFrontImage.url 
    : (raw.main_image || null); // Utilisez main_image comme fallback direct

  // Le backImg utilisera la première page de contenu ou sera null si tout est vide
  const finalBackImg = coverBackImage 
    ? coverBackImage.url 
    : contentImages[0] || null;

  // 4. Création des paires de slides pour Desktop 
  const slidesPairs = [];
  // Si aucune image de contenu n'a été trouvée, et qu'il y a une main_image, 
  // on peut techniquement l'ajouter aux slides si on veut afficher quelque chose.
  // Cependant, nous allons nous concentrer sur la logique originale qui sépare les slides des couvertures.
  for (let i = 0; i < contentImages.length; i += 2) {
    const page1 = contentImages[i];
    const page2 = contentImages[i + 1] || null; 
    slidesPairs.push({ page1, page2 });
  }
  // Si vous voulez qu'au moins la couverture s'affiche dans le carrousel mobile 
  // si aucune image de contenu n'est trouvée:
  let finalMobileSlides = contentImages;
  if (finalMobileSlides.length === 0 && finalCoverImg) {
      finalMobileSlides = [finalCoverImg];
  }


  return {
    id: raw.id,
    slug: raw.slug,
    // Titres disponibles
    title: raw.titre || raw.title || raw.name || '',
    subtitle: raw.legende || raw.subtitle || '',
    description: raw.description || '',
    
    // Images corrigées
    coverImg: finalCoverImg,
    backImg: finalBackImg, 
    slides: slidesPairs,
    mobileSlides: finalMobileSlides, 
    
    // Métadonnées (Les champs manquants resteront vides)
    isbn: raw.code_bare || raw.isbn || '', // Manquant dans votre log
    dimensions: raw.dimensions || `${raw.largeur_cm || ''}x${raw.hauteur_cm || ''}`, // Manquant
    pages: raw.nombre_pages || raw.pages || '', // Manquant
    releaseDate: raw.date_publication || raw.releaseDate || '', // Manquant
    price: raw.prix_euros ? `${raw.prix_euros} €` : raw.prix || '', // OK (prix_euros et prix sont là)
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
        // Assurez-vous que 'images' ou 'images_urls' existe et n'est pas vide.
        // Assurez-vous que des champs comme 'titre', 'prix_euros', 'nombre_pages' existent.
        
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
  const slides = (book && book.slides) ? book.slides : [];
  const mobileSlides = (book && book.mobileSlides) ? book.mobileSlides : [];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextMobileSlide = () => {
    setCurrentMobileSlide((prev) => (prev + 1) % mobileSlides.length);
  };

  const prevMobileSlide = () => {
    setCurrentMobileSlide(
      (prev) => (prev - 1 + mobileSlides.length) % mobileSlides.length
    );
  };

  const handleAddToCart = () => {
    if (book && book.addToCartLink) {
      window.location.href = book.addToCartLink;
    }
  };

  // (dev helper for quick order removed)

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
        <h1
          className="text-center text-3xl md:text-4xl font-bold mb-4"
          style={{ color: "#F4B383" }}
        >
          {book.title}
        </h1>
        <h1
          className="text-center text-xl md:text-2xl mb-8"
          style={{ color: "#C2DEEA" }}
        >
          {book.subtitle}
        </h1>

        {/* Carousel Desktop */}
        <div className="hidden md:flex items-center justify-center mb-8 gap-4">
          {/* Image back (Dynamique) */}
          {book.backImg ? (
            <img
              src={book.backImg}
              className="w-64 lg:w-80"
              alt="Quatrième de couverture"
            />
          ) : (
            <div className="w-64 lg:w-80 bg-slate-100 flex items-center justify-center text-xs text-slate-400">No image</div>
          )}

          {/* Carousel des pages */}
          <div className="relative max-w-3xl">
            {slides.length > 0 && (
              <div className="flex gap-2">
                {slides[currentSlide].page1 ? (
                  <img
                    src={slides[currentSlide].page1}
                    className="w-1/2"
                    alt={`Page ${currentSlide * 2 + 1}`}
                  />
                ) : (
                  <div className="w-1/2 bg-slate-100 flex items-center justify-center text-xs text-slate-400">No image</div>
                )}

                {slides[currentSlide].page2 ? (
                  <img
                    src={slides[currentSlide].page2}
                    className="w-1/2"
                    alt={`Page ${currentSlide * 2}`}
                  />
                ) : (
                  <div className="w-1/2 bg-slate-100 flex items-center justify-center text-xs text-slate-400">No image</div>
                )}
              </div>
            )}

            {/* Flèches */}
            {slides.length > 1 && (
              <div className="flex justify-center gap-4 mt-4">
                <button onClick={prevSlide} className="bg-transparent border-0">
                  <img
                    src={leftArrow}
                    className="w-12"
                    alt="Précédent"
                  />
                </button>
                <button onClick={nextSlide} className="bg-transparent border-0">
                  <img
                    src={rightArrow}
                    className="w-12"
                    alt="Suivant"
                  />
                </button>
              </div>
            )}
          </div>

          {/* Image cover (Dynamique) */}
          {book.coverImg ? (
            <img
              src={book.coverImg}
              className="w-64 lg:w-80"
              alt="Première de couverture"
            />
          ) : (
            <div className="w-64 lg:w-80 bg-slate-100 flex items-center justify-center text-xs text-slate-400">No image</div>
          )}
        </div>

        {/* Carousel Mobile */}
        <div className="md:hidden mb-8">
          <div className="relative max-w-md mx-auto">
            {mobileSlides.length > 0 && (
              (mobileSlides[currentMobileSlide]) ? (
                <img
                  src={mobileSlides[currentMobileSlide]}
                  className="w-full"
                  alt="page"
                />
              ) : (
                <div className="w-full bg-slate-100 flex items-center justify-center text-xs text-slate-400">No image</div>
              )
            )}

            {/* Flèches Mobile */}
            {mobileSlides.length > 1 && (
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={prevMobileSlide}
                  className="bg-transparent border-0"
                >
                  <img
                    src={leftArrow}
                    className="w-12"
                    alt="Précédent"
                  />
                </button>
                <button
                  onClick={nextMobileSlide}
                  className="bg-transparent border-0"
                >
                  <img
                    src={rightArrow}
                    className="w-12"
                    alt="Suivant"
                  />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Section informations et panier (Désormais dynamiques) */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {/* Code barre */}
          <div className="text-center">
            <img
              src={barCode}
              className="w-16 mx-auto mb-2"
              alt="Code barre"
            />
            <h5 className="text-sm">{book.isbn}</h5>
          </div>

          {/* Dimensions */}
          <div className="text-center">
            <img
              src={bookOfBlackCover}
              className="w-16 mx-auto mb-2"
              alt="Dimensions"
            />
            <h5 className="text-sm">{book.dimensions}</h5>
          </div>

          {/* Pages */}
          <div className="text-center">
            <img
              src={openBook}
              className="w-16 mx-auto mb-2"
              alt="Pages"
            />
            <h5 className="text-sm">{book.pages}</h5>
          </div>

          {/* Date */}
          <div className="text-center">
            <img
              src={calendar}
              className="w-16 mx-auto mb-2"
              alt="Date"
            />
            <h5 className="text-sm">{book.releaseDate}</h5>
          </div>

          {/* Panier */}
          <div className="text-center">
            <div>
              <button
                onClick={handleAddToCart}
                className="bg-transparent border-0 cursor-pointer"
              >
              <img
                src={basket}
                className="w-16 mx-auto mb-2"
                alt="Panier"
              />
              <h5 className="text-sm">{book.price}</h5>
              </button>

              {/* dev helper removed */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
