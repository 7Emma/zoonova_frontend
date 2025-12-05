import { useState, useEffect } from "react";
import { X, Check } from "lucide-react";

export default function Toast({ message, type = "success", duration = 3000, onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const bgColor = type === "success" ? "bg-cyan-300" : type === "error" ? "bg-red-500" : "bg-cyan-300";
  const icon = type === "success" ? <Check className="w-5 h-5" /> : null;

  return (
    <div
      className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${bgColor} text-gray-800 px-8 py-6 rounded-lg shadow-lg flex items-center gap-3 z-50 max-w-md`}
    >
      {icon}
      <span className="font-medium">{message}</span>
      <button
        onClick={() => setIsVisible(false)}
        className="ml-2 hover:bg-white/20 p-0.5 rounded transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
