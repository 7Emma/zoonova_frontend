import { useNavigate } from "react-router-dom";
import BookCard from "../components/BookCard";
import { useEffect, useState } from "react";
import booksService from "../services/booksService";
import videoService from "../services/videoService";

const Home = () => {
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [videoError, setVideoError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const data = await booksService.getBooks({ page_size: 8 });
        const items = Array.isArray(data) ? data : data.results || [];

        // Charger les détails complets (avec les vidéos) pour chaque livre
        const detailedBooksPromises = items.map((book) =>
          booksService.getBookBySlug(book.slug || book.id).catch(() => book)
        );

        const detailedBooks = await Promise.all(detailedBooksPromises);
        const finalBooks = detailedBooks.slice(0, 8);
        if (mounted) setBooks(finalBooks);
      } catch (e) {
        console.error(e);
      }
    };

    load();
    return () => (mounted = false);
  }, []);

  // Charger les vidéos en vedette
  useEffect(() => {
    let mounted = true;
    const loadVideos = async () => {
      try {
        setLoadingVideos(true);
        const videosData = await videoService.getFeaturedVideos({ page_size: 4 });
        const formattedVideos = videoService.formatVideos(videosData);
        if (mounted) {
          setVideos(formattedVideos);
          setVideoError(null);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des vidéos:', err);
        if (mounted) {
          setVideoError('Impossible de charger les vidéos');
          setVideos([]);
        }
      } finally {
        if (mounted) setLoadingVideos(false);
      }
    };

    loadVideos();
    return () => (mounted = false);
  }, []);
  const handleBookClick = (book) => {
    const slug =
      book.slug || (book.link || "").split("/book/")[1] || book.title || "";
    navigate(`/book/${slug}`);
  };

  return (
    <main
      className="max-w-8xl mx-auto px-5 py-10"
      style={{
        background:
          "linear-gradient(135deg, #f4f6d4 0%, #fef4e8 25%, #fde8f0 50%, #f0e8f8 75%, #e8f0fc 100%)",
      }}
    >
      {/* Main Title */}
      <div className="text-center mb-8">
        <h1
          className="text-xl md:text-6xl lg:text-4xl  mb-6"
          style={{
            fontFamily: "'Alfa Slab One', cursive",
            color: "white",
            WebkitTextStroke: "1px #c45554",
          }}
        >
          « JE NE VEUX PLUS ÊTRE... »
        </h1>

        {/* Subtitle  */}
        <h2
          className="text-center text-xl md:text-2xl lg:text-3xl font-bold uppercase mb-6 text-slate-700 leading-relaxed"
          style={{ fontFamily: "'Baloo 2', cursive" }}
        >
          EST UNE COLLECTION DE LIVRES JEUNESSE DESTINÉE AUX ENFANTS DE 4 À 10
          ANS.
        </h2>

        {/* Description */}
        <p
          className="text-center text-xl md:text-2xl lg:text-3xl font-bold text-slate-700 leading-relaxed  mb-12"
          style={{ fontFamily: "'Baloo 2', cursive" }}
        >
          DES HISTOIRES QUI RACONTENT LES AVENTURES D'ANIMAUX QUI
          <br />
          SOUHAITENT RENONCER À LEUR NATURE POUR RÉALISER LEURS RÊVES.
          <br />
          MAIS LE VOYAGE SERA INCERTAIN, CAR AUX YEUX DE LEURS SEMBLABLES,
          <br />
          CE DÉSIR D'ACCOMPLISSEMENT SEMBLE CONTRE NATURE...
        </p>
      </div>

      {/* First Row of Books */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {books.slice(0, 4).map((book) => (
          <BookCard
            key={book.id || book.slug}
            book={book}
            onClick={() => handleBookClick(book)}
          />
        ))}
      </div>

      {/* Invitation Text */}
      <div className="text-center my-12">
        <h2
          className="text-xl md:text-2xl lg:text-3xl font-bold uppercase text-slate-600 leading-relaxed"
          style={{ fontFamily: "'Roboto', sans-serif" }}
        >
          ZOONOVA VOUS INVITE À DÉCOUVRIR LES SURPRENANTES AVENTURES
          <br />
          D'ABEILLE.532, BÉLIOS, CASTORIN, DAUPHINOIS, ÉLÉPHANKA...
        </h2>
      </div>

      {/* Second Row of Books */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12">
        {books.slice(4, 8).map((book) => (
          <BookCard
            key={book.id || book.slug}
            book={book}
            onClick={() => handleBookClick(book)}
          />
        ))}
      </div>

      {/* Videos Section */}
      {videos.length > 0 && (
        <div className="mt-16 pb-12">
          <div className="text-center mb-12">
            <h2
              className="text-2xl md:text-3xl lg:text-4xl font-bold uppercase text-slate-700 leading-relaxed"
              style={{ fontFamily: "'Alfa Slab One', cursive" }}
            >
              Découvrez nos vidéos
            </h2>
          </div>

          {/* Videos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {videos.map((video) => (
              <div
                key={video.id}
                className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow bg-white"
              >
                {/* YouTube Embed */}
                {video.youtubeId ? (
                  <div className="relative w-full aspect-video bg-black">
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${video.youtubeId}`}
                      title={video.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                ) : video.thumbnail ? (
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-64 object-cover"
                  />
                ) : (
                  <div className="w-full h-64 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                    <span className="text-slate-500">Vidéo</span>
                  </div>
                )}

                {/* Video Info */}
                <div className="p-4">
                  <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-2">
                    {video.title}
                  </h3>
                  {video.description && (
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {video.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loadingVideos && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-700"></div>
        </div>
      )}

      {/* Error State */}
      {videoError && !loadingVideos && (
        <div className="text-center py-8 text-red-600">
          <p>{videoError}</p>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=Roboto:wght@400;600;700&family=Baloo+2:wght@400;600;700&display=swap');
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .aspect-video {
          aspect-ratio: 16 / 9;
        }
      `}</style>
    </main>
  );
};

export default Home;
