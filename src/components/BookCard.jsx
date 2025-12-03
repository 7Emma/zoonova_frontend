import React, { useState } from "react";

// ============ HOME COMPONENT ============
const BookCard = ({ book, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Get first video from videos array if exists, priority: videos array > main_image
  const firstVideo = book?.videos && book.videos.length > 0 ? book.videos[0]?.video_url : null;
  const mainImage = book?.main_image || book?.coverImg || book?.image || book?.image_url || null;

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
            style={{ background: "transparent" }}
            autoPlay
            muted
            playsInline
            loop
          >
            <source src={firstVideo} type="video/mp4" />
          </video>
        ) : (
          mainImage ? (
            <img
              src={mainImage}
              alt={book?.titre || book?.title || ''}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-slate-100 flex items-center justify-center text-xs text-slate-400">No image</div>
          )
        )}
      </div>
      <h3
        className="mt-4 text-base md:text-lg font-semibold text-center text-slate-700 bg-white rounded-3xl"
        style={{ fontFamily: "'Baloo 2', cursive" }}
      >
        {book.titre || book.title}
      </h3>
    </div>
  );
};

export default BookCard;
