import React from 'react';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function Error404() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://i.imgur.com/your-image.jpg')`,
          filter: 'brightness(0.7)'
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/60 via-pink-800/50 to-yellow-700/40" />
      
      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-white">
        {/* 404 Number */}
        <div className="mb-8 text-center">
          <h1 className="text-9xl font-bold tracking-wider drop-shadow-2xl md:text-[12rem]">
            404
          </h1>
          <div className="mt-2 h-1 w-32 bg-gradient-to-r from-transparent via-white to-transparent mx-auto" />
        </div>
        
        {/* Message */}
        <div className="mb-12 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Page Introuvable
          </h2>
          <p className="text-lg text-gray-200 md:text-xl">
            Oups ! La page que vous recherchez semble s'être perdue dans l'espace.
            Elle a peut-être été déplacée ou n'existe plus.
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <button className="group flex items-center gap-2 rounded-full bg-white px-8 py-4 font-semibold text-purple-900 shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-white/20">
            <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
            Retour
          </button>
          
          <button className="group flex items-center gap-2 rounded-full border-2 border-white bg-transparent px-8 py-4 font-semibold text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-white hover:text-purple-900">
            <Home className="h-5 w-5" />
            Accueil
          </button>
          
          <button className="group flex items-center gap-2 rounded-full border-2 border-white bg-transparent px-8 py-4 font-semibold text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-white hover:text-purple-900">
            <Search className="h-5 w-5" />
            Rechercher
          </button>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 h-20 w-20 rounded-full bg-white/10 blur-xl animate-pulse" />
        <div className="absolute bottom-32 right-16 h-32 w-32 rounded-full bg-pink-500/20 blur-2xl animate-pulse" style={{animationDelay: '1s'}} />
        <div className="absolute top-1/3 right-1/4 h-16 w-16 rounded-full bg-yellow-400/20 blur-xl animate-pulse" style={{animationDelay: '2s'}} />
      </div>
    </div>
  );
}