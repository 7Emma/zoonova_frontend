import React, { useState } from "react";
import VideoPlayer from "./VideoPlayer";

// ============ HOME COMPONENT ============
const BookCard = ({ book, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Get first video from videos array if exists, priority: videos array > main_image
  const firstVideo =
    book?.videos && book.videos.length > 0 ? book.videos[0]?.video_url : null;
  const mainImage =
    book?.main_image ||
    book?.coverImg ||
    book?.image ||
    book?.image_url ||
    null;

  return (
    <div className="flex flex-col items-center px-0 mx-0">
      <div
        className={`w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden shadow-lg cursor-pointer transition-transform duration-300 ${
          isHovered ? "scale-105" : "scale-100"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
      >
        {firstVideo ? (
          <VideoPlayer
            videoUrls={firstVideo}
            className="w-full h-full object-cover"
            style={{ background: "transparent", transform: "scale(1.32)" }}
          />
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
        className="mt-4 text-sm font-baloo font-bold text-center text-slate-700 border-2 border-white rounded-3xl px-4 py-1 break-words whitespace-normal"
        style={{  backgroundColor: "transparent", maxWidth: "180px" }}
      >
        {book.titre || book.title}
      </h3>
    </div>
  );
};

export default BookCard;
