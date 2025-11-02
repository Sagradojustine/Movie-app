// Watchlist.jsx
import React, { useState } from 'react';
import { useMovies } from '../contexts/MovieContext';
import { Link } from 'react-router-dom';
import MovieCard from '../components/MovieCard';

const Watchlist = () => {
  const { watchlist, removeFromWatchlist, toggleWatched } = useMovies();
  const [filter, setFilter] = useState('all');
  
  const filteredWatchlist = watchlist.filter(movie => {
    if (filter === 'all') return true;
    if (filter === 'watched') return movie.watched;
    if (filter === 'unwatched') return !movie.watched;
    return true;
  });
  
  return (
    <div className="min-h-screen bg-black pt-20 pb-8 px-4 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">My List</h1>
            <p className="text-gray-400 mt-1">
              {watchlist.length} {watchlist.length === 1 ? 'title' : 'titles'}
            </p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded text-sm transition-colors ${
                filter === 'all'
                  ? 'bg-white text-black'
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unwatched')}
              className={`px-4 py-2 rounded text-sm transition-colors ${
                filter === 'unwatched'
                  ? 'bg-white text-black'
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              To Watch
            </button>
            <button
              onClick={() => setFilter('watched')}
              className={`px-4 py-2 rounded text-sm transition-colors ${
                filter === 'watched'
                  ? 'bg-white text-black'
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              Watched
            </button>
          </div>
        </div>
        
        {filteredWatchlist.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredWatchlist.map(movie => (
              <div key={movie.imdbID} className="relative group">
                <MovieCard movie={movie} />
                <button 
                  onClick={() => removeFromWatchlist(movie.imdbID)}
                  className="absolute top-2 right-2 bg-black bg-opacity-70 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
                <button 
                  onClick={() => toggleWatched(movie.imdbID)}
                  className="absolute top-2 left-2 bg-black bg-opacity-70 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity text-sm"
                >
                  {movie.watched ? '✓' : '○'}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📺</div>
            <h3 className="text-xl font-bold text-white mb-2">Your list is empty</h3>
            <p className="text-gray-400 mb-6">
              {filter !== 'all' 
                ? `No ${filter} titles in your list.` 
                : 'Add shows and movies to your list to watch them later.'}
            </p>
            <Link 
              to="/search"
              className="px-6 py-2 bg-white text-black rounded hover:bg-gray-200 transition-colors inline-block"
            >
              Find Something to Watch
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlist;