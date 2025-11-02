// MovieCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMovies } from '../contexts/MovieContext';
import TrailerModal from './TrailerModal';

const MovieCard = ({ movie }) => {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist, getTrailerUrl } = useMovies();
  const [isTrailerModalOpen, setIsTrailerModalOpen] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [loadingTrailer, setLoadingTrailer] = useState(false);

  const inWatchlist = isInWatchlist(movie.imdbID);

  const posterUrl = movie.Poster !== 'N/A' 
    ? movie.Poster 
    : 'https://placehold.co/300x450/1a1a1a/ffffff?text=No+Poster';

  const handleImageClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setLoadingTrailer(true);
    setIsTrailerModalOpen(true);
    
    try {
      const url = await getTrailerUrl(movie.Title);
      setTrailerUrl(url);
    } catch (error) {
      console.error('Error loading trailer:', error);
      setTrailerUrl(null);
    } finally {
      setLoadingTrailer(false);
    }
  };

  const handleCloseModal = () => {
    setIsTrailerModalOpen(false);
    setTrailerUrl(null);
  };

  // Determine if it's a TV show
  const isTvShow = movie.Type === 'series';

  return (
    <>
      <div className="relative group">
        {/* TV Show Badge */}
        {isTvShow && (
          <div className="absolute top-2 left-2 z-10">
            <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-md">
              TV
            </span>
          </div>
        )}

        {/* Clickable Image for Trailer */}
        <div 
          className="aspect-[2/3] rounded overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:z-10 cursor-pointer"
          onClick={handleImageClick}
        >
          <img 
            src={posterUrl} 
            alt={movie.Title} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://placehold.co/300x450/1a1a1a/ffffff?text=No+Poster';
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-16 h-16 bg-netflix-red rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                <span className="text-white text-2xl">▶</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Watchlist Button */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (inWatchlist) {
                removeFromWatchlist(movie.imdbID);
              } else {
                addToWatchlist(movie);
              }
            }}
            className="w-8 h-8 bg-black bg-opacity-70 rounded-full flex items-center justify-center hover:bg-opacity-90 transition-colors"
          >
            {inWatchlist ? '✓' : '+'}
          </button>
        </div>

        {/* Movie/TV Show Info */}
        <div className="mt-2">
          <Link to={`/movie/${movie.imdbID}`} onClick={(e) => e.stopPropagation()}>
            <h3 className="text-white text-sm font-medium truncate hover:text-gray-300 transition-colors">
              {movie.Title}
            </h3>
          </Link>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-2">
              {movie.imdbRating && movie.imdbRating !== 'N/A' && (
                <span className="text-green-500">⭐ {movie.imdbRating}</span>
              )}
              <span>{movie.Year}</span>
            </div>
            {isTvShow && (
              <span className="text-purple-400 text-xs">TV Series</span>
            )}
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={isTrailerModalOpen}
        onClose={handleCloseModal}
        trailerUrl={trailerUrl}
        movieTitle={movie.Title}
        loading={loadingTrailer}
      />
    </>
  );
};

export default MovieCard;