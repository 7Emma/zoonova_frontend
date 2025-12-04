import React, { useState } from "react";

// ============ HOME COMPONENT ============
const BookCard = ({ book, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Debug: log book data structure
  if (!window.__bookCardDebugLogged) {
    console.log("BookCard - Book data structure:", {
      id: book.id,
      titre: book.titre,
      videos: book.videos,
      videos_count: book.videos?.length,
      firstVideo: book.videos?.[0],
      main_image: book.main_image,
    });
    window.__bookCardDebugLogged = true;
  }

  // Get first video from videos array if exists, priority: videos array > main_image
  const firstVideo =
    book?.videos && book.videos.length > 0 ? book.videos[0]?.video_url : null;
  const mainImage =
    book?.main_image ||
    book?.coverImg ||
    book?.image ||
    book?.image_url ||
    null;

  console.log(`BookCard (${book.titre}) - Using:`, {
    hasVideo: !!firstVideo,
    videoUrl: firstVideo,
    hasImage: !!mainImage,
    imageUrl: mainImage,
  });

  return (
    <div className="flex flex-col items-center">
      <div
        className={`w-40 h-40 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden shadow-lg cursor-pointer transition-transform duration-300 ${
          isHovered ? "scale-105" : "scale-100"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
      >
        {firstVideo ? (
          <video
            className="w-full h-full object-cover"
            style={{ background: "transparent", transform: "scale(1.32)" }}
            autoPlay
            muted
            playsInline
            loop
          >
            <source src={firstVideo} type="video/mp4" />
          </video>
        ) : mainImage ? (
          <img
            src={mainImage}
            alt={book?.titre || book?.title || ""}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-slate-100 flex items-center justify-center text-xs text-slate-400">
            No image
          </div>
        )}
      </div>
      <h3
        className="mt-4 text-sm font-baloo font-bold text-center text-slate-700 border-2 border-white rounded-3xl px-2 py-1 break-words whitespace-normal"
        style={{  backgroundColor: "transparent", maxWidth: "220px" }}
      >
        {book.titre || book.title}
      </h3>
    </div>
  );
};

export default BookCard;
