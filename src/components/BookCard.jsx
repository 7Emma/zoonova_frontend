import React, { useState } from "react";

// ============ HOME COMPONENT ============
const BookCard = ({ book, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const src = book?.main_image || book?.coverImg || book?.image || book?.image_url || null;

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
        {book.main_video || book.video ? (
          <video
            className="w-full h-full object-cover"
            style={{ background: "transparent" }}
            autoPlay
            muted
            playsInline
            loop
          >
            <source src={book.main_video || book.video} type="video/mp4" />
          </video>
        ) : (
          src ? (
            <img
              src={src}
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
        <br />
        {book.legende || book.subtitle || book.nom}
      </h3>
    </div>
  );
};

export default BookCard;
