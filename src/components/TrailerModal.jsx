// TrailerModal.jsx
import React from 'react';
import { X, Loader } from 'lucide-react';

const TrailerModal = ({ isOpen, onClose, trailerUrl, movieTitle, loading = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
      <div className="relative w-full max-w-4xl mx-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
        >
          <X className="w-8 h-8" />
        </button>
        
        {/* Trailer Video */}
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-full text-white">
              <Loader className="w-8 h-8 animate-spin mr-2" />
              <p>Loading trailer...</p>
            </div>
          ) : trailerUrl ? (
            <iframe
              src={trailerUrl}
              title={`${movieTitle} Trailer`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <div className="flex items-center justify-center h-full text-white">
              <p>Trailer not available</p>
            </div>
          )}
        </div>
        
        {/* Movie Title */}
        <div className="mt-4 text-center">
          <h3 className="text-xl font-bold text-white">{movieTitle} - Trailer</h3>
        </div>
      </div>
    </div>
  );
};

export default TrailerModal;