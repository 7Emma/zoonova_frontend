import React, { useState, useEffect } from "react";

export default function LoadingScreen({ isVisible = true, duration = 5000 }) {
  const [show, setShow] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 shadow-2xl flex flex-col items-center gap-4">
        {/* Spinner Animation */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-blue-500 animate-spin"></div>
        </div>

        {/* Loading Text */}
        <p className="text-gray-700 font-semibold text-lg">Chargement...</p>
      </div>
    </div>
  );
}
