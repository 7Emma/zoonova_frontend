// BookDetailPage.jsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import barCode from "../assets/png_rez/barcode-lines.png";
import openBook from "../assets/png_rez/open_book.png"
import bookOfBlackCover from "../assets/png_rez/book-of-black-cover-closed.png";
import calendar from "../assets/png_rez/calendar.png";
import basket from "../assets/png_rez/basket2.png";
import leftArrow from "../assets/png_rez/left-arrow.png";
import rightArrow from "../assets/png_rez/right-arrow.png";
import booksService from '../services/booksService';
import useCart from '../hooks/useCart';

// SIMPLIFICATION de la fonction : On délègue toute la logique de recherche
// et de récupération des détails à booksService.getBookBySlug, désormais robuste.
const fetchBookDetails = async (slug) => {
    try {
        const res = await booksService.getBookBySlug(slug);
        return res;
    } catch (e) {
        console.error(`Erreur critique lors de la récupération du livre (${slug}) :`, e);
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
    const [arrowClicked, setArrowClicked] = useState({ left: false, right: false });
    const [selectedImage, setSelectedImage] = useState(null);

    // helper: normalize backend/book object to the shape the UI expects
    const normalizeBook = (raw) => {
        if (!raw) return null;

        // L'API fournit maintenant le tableau 'images' dans les détails
        const detailedImages = Array.isArray(raw.images) ? raw.images : [];

        // =========================================================================
        // ÉTAPE 1 : NORMALISATION et TRI DES IMAGES DÉTAILLÉES (Fiable)
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
        const coverFrontImage = allImages.find(i => i.isMain || i.type === 'cover_front');
        const coverBackImage = allImages.find(i => i.type === 'cover_back');
        const contentImages = allImages
            .filter(i => i.type === 'content')
            .map(i => i.url);

        // 3. Définition des URL finales
        const finalCoverImg = coverFrontImage
            ? coverFrontImage.url
            : (raw.main_image || null); // Fallback sur main_image si la liste détaillée est absente

        const finalBackImg = coverBackImage
            ? coverBackImage.url
            : null; // Pas de fallback générique pour la 4ème de couv.

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

        // 5. Slides mobiles : Couverture avant + Couverture arrière + Contenu
        const finalMobileSlides = [];
        if (finalCoverImg) finalMobileSlides.push(finalCoverImg);
        if (finalBackImg) finalMobileSlides.push(finalBackImg);
        finalMobileSlides.push(...contentImages);


        return {
            id: raw.id,
            slug: raw.slug,
            // Titres disponibles
            title: raw.titre || raw.title || raw.name || '',
            subtitle: raw.legende || raw.subtitle || '',
            description: raw.description || '',

            // Images
            coverImg: finalCoverImg,
            backImg: finalBackImg,
            slides: slidesPairs,
            mobileSlides: finalMobileSlides,

            // Métadonnées (MAINTEANT PRÉSENTES DANS LES DONNÉES)
            isbn: raw.code_bare || raw.isbn || '',
            // Utilisation des champs largeur_cm, hauteur_cm, epaisseur_cm ou du champ dimensions complet
            dimensions: raw.dimensions || `${raw.largeur_cm || ''} × ${raw.hauteur_cm || ''} × ${raw.epaisseur_cm || ''}`.trim(),
            pages: raw.nombre_pages || raw.pages || '',
            releaseDate: raw.date_publication || raw.releaseDate || '',
            price: raw.prix_euros ? `${raw.prix_euros} €` : raw.prix || '',
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
    const slides = (book && book.slides) ? book.slides : [];
    const mobileSlides = (book && book.mobileSlides) ? book.mobileSlides : [];

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
            navigate('/cart');
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
                    {/* Image back (Dynamique) - Cliquable */}
                    {book.backImg ? (
                        <img
                            src={book.backImg}
                            className="w-64 lg:w-80 cursor-pointer hover:opacity-80 transition-opacity"
                            alt="Quatrième de couverture"
                            onClick={() => handleImageClick(book.backImg)}
                        />
                    ) : (
                        <div className="w-64 lg:w-80 bg-slate-100 flex items-center justify-center text-xs text-slate-400 h-96">No image</div>
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
                                    <div className="w-1/2 bg-slate-100 flex items-center justify-center text-xs text-slate-400 h-96">No image</div>
                                )}

                                {slides[currentSlide].page2 ? (
                                    <img
                                        src={slides[currentSlide].page2}
                                        className="w-1/2"
                                        alt={`Page ${currentSlide * 2 + 2}`}
                                    />
                                ) : (
                                    <div className="w-1/2 bg-slate-100 flex items-center justify-center text-xs text-slate-400 h-96">No image</div>
                                )}
                            </div>
                        )}

                        {/* Cas où slides.length est 0 et qu'il n'y a pas d'images de contenu */}
                        {slides.length === 0 && (
                            <div className="flex gap-2">
                                <div className="w-full bg-slate-100 flex items-center justify-center text-xs text-slate-400 h-96">No content images</div>
                            </div>
                        )}

                        {/* Flèches et bouton acheter */}
                        {slides.length > 1 && (
                            <div className="flex justify-center items-center gap-4 mt-4">
                                <button onClick={prevSlide} className="bg-transparent border-0">
                                    <img
                                        src={leftArrow}
                                        className={`w-12 transition-all duration-200 ${arrowClicked.left ? 'brightness-0 invert' : ''}`}
                                        alt="Précédent"
                                    />
                                </button>
                                <button
                                    onClick={handleAddToCart}
                                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105"
                                >
                                    Acheter - {book.price}
                                </button>
                                <button onClick={nextSlide} className="bg-transparent border-0">
                                    <img
                                        src={rightArrow}
                                        className={`w-12 transition-all duration-200 ${arrowClicked.right ? 'brightness-0 invert' : ''}`}
                                        alt="Suivant"
                                    />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Image cover (Dynamique) - Cliquable */}
                    {book.coverImg ? (
                        <img
                            src={book.coverImg}
                            className="w-64 lg:w-80 cursor-pointer hover:opacity-80 transition-opacity"
                            alt="Première de couverture"
                            onClick={() => handleImageClick(book.coverImg)}
                        />
                    ) : (
                        <div className="w-64 lg:w-80 bg-slate-100 flex items-center justify-center text-xs text-slate-400 h-96">No image</div>
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
                                    alt={`page ${currentMobileSlide + 1}`}
                                />
                            ) : (
                                <div className="w-full bg-slate-100 flex items-center justify-center text-xs text-slate-400 h-96">No image</div>
                            )
                        )}

                        {/* Cas où mobileSlides.length est 0 */}
                        {mobileSlides.length === 0 && (
                            <div className="w-full bg-slate-100 flex items-center justify-center text-xs text-slate-400 h-96">No image</div>
                        )}


                        {/* Flèches Mobile et bouton acheter */}
                        {mobileSlides.length > 1 && (
                            <div className="flex justify-center items-center gap-4 mt-4">
                                <button
                                    onClick={prevMobileSlide}
                                    className="bg-transparent border-0"
                                >
                                    <img
                                        src={leftArrow}
                                        className={`w-12 transition-all duration-200 ${arrowClicked.left ? 'brightness-0 invert' : ''}`}
                                        alt="Précédent"
                                    />
                                </button>
                                <button
                                    onClick={handleAddToCart}
                                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105 text-sm"
                                >
                                    Acheter - {book.price}
                                </button>
                                <button
                                    onClick={nextMobileSlide}
                                    className="bg-transparent border-0"
                                >
                                    <img
                                        src={rightArrow}
                                        className={`w-12 transition-all duration-200 ${arrowClicked.right ? 'brightness-0 invert' : ''}`}
                                        alt="Suivant"
                                    />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Section informations et panier (Désormais dynamiques grâce aux nouvelles données) */}
                <div className="flex flex-wrap justify-center gap-52 mb-8 ">
                    {/* Code barre (ISBN) */}
                    <div className="text-center">
                        <img
                            src={barCode}
                            className="w-16 mx-auto mb-2"
                            alt="Code barre"
                        />
                        <h5 className="text-sm">{book.isbn || 'N/A'}</h5>
                    </div>

                    {/* Dimensions */}
                    <div className="text-center">
                        <img
                            src={bookOfBlackCover}
                            className="w-16 mx-auto mb-2"
                            alt="Dimensions"
                        />
                        <h5 className="text-sm">{book.dimensions || 'N/A'}</h5>
                    </div>

                    {/* Pages */}
                    <div className="text-center">
                        <img
                            src={openBook}
                            className="w-16 mx-auto mb-2"
                            alt="Pages"
                        />
                        <h5 className="text-sm">{book.pages ? `${book.pages} pages` : 'N/A'}</h5>
                    </div>

                    {/* Date */}
                    <div className="text-center">
                        <img
                            src={calendar}
                            className="w-16 mx-auto mb-2"
                            alt="Date"
                        />
                        <h5 className="text-sm">{book.releaseDate || 'N/A'}</h5>
                    </div>

                    {/* Panier - Ajoute au panier sans redirection */}
                    <div className="text-center">
                        <div>
                            <button
                                onClick={handleAddToCartOnly}
                                className="bg-transparent border-0 cursor-pointer hover:scale-110 transition-transform"
                            >
                                <img
                                    src={basket}
                                    className="w-16 mx-auto mb-2"
                                    alt="Ajouter au panier"
                                />
                                <h5 className="text-sm">{book.price || 'Prix N/A'}</h5>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Affichage de l'image sélectionnée en grand format */}
                {selectedImage && (
                    <div className="mt-8 flex flex-col items-center">
                        <div className="relative">
                            <img
                                src={selectedImage}
                                className="max-w-full max-h-[600px] rounded-lg shadow-2xl"
                                alt="Image agrandie"
                            />
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-70 transition"
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